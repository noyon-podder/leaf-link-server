import httpStatus from 'http-status'
import { QueryBuilder } from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { TImageFiles } from '../../interface/image.interface'
import { PostsSearchableFields } from './post.constant'
import { IPost } from './post.interface'
import { Post } from './post.model'
import { User } from '../user/user.model'
import mongoose, { Types } from 'mongoose'

// CREATE A NEW POST
const createPost = async (payload: IPost, images: TImageFiles) => {
  const { postImages } = images

  payload.images = postImages.map((image) => image.path)

  const result = await Post.create(payload)

  return result
}

// GET ALL POST WITH SEARCH
const getAllPost = async (query: Record<string, unknown>) => {
  const itemQuery = new QueryBuilder(
    Post.find()
      .populate('author', '_id name email profilePicture')
      .populate('comments'),
    query,
  )
    .filter()
    .search(PostsSearchableFields)
    .sort()
    .fields()

  const result = await itemQuery.modelQuery

  return result
}

// Post Premium
const postPremium = async (postId: string) => {
  const result = await Post.findByIdAndUpdate(
    postId,
    { isPremium: true },
    { new: true },
  )

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post  not found')
  }

  return result
}

// GET ALL PAID POST
const getAllGetPaidPostFromDB = async () => {
  const result = await Post.find({ isPremium: true })
    .populate('author', '_id name email profilePicture')
    .populate('comments')

  return result
}

// UPDATE POST
const updatePost = async (itemId: string, payload: IPost) => {
  const result = await Post.findByIdAndUpdate(itemId, payload, { new: true })

  return result
}

// Delete A POST
const deletePost = async (postId: string) => {
  const result = await Post.findByIdAndUpdate(
    postId,
    { isDeleted: true },
    { new: true },
  )

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post  not found')
  }

  return result
}

// UPVOTE POST
export const upvotePostFromDB = async (
  postId: string | Types.ObjectId,
  userId: string | Types.ObjectId,
) => {
  const postObjectId = new mongoose.Types.ObjectId(postId)
  const userObjectId = new mongoose.Types.ObjectId(userId)

  const post = await Post.findById(postObjectId)
  const user = await User.findById(userObjectId)

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  // Check if the user has already upvoted or downvoted the post
  const hasUpvoted = post.upvotedBy!.some((id: Types.ObjectId) =>
    id.equals(userObjectId),
  )
  const hasDownvoted = post.downvotedBy!.some((id: Types.ObjectId) =>
    id.equals(userObjectId),
  )

  if (hasUpvoted) {
    // If the user has already upvoted, remove the upvote
    post.upvotes! -= 1
    post.upvotedBy = post.upvotedBy!.filter(
      (id: mongoose.Types.ObjectId) => !id.equals(userObjectId),
    )
    user.upvotesReceived -= 1 // Decrease user's total upvote count
  } else {
    // If the user has downvoted before, remove the downvote first
    if (hasDownvoted) {
      post.downvotes! -= 1
      post.downvotedBy = post.downvotedBy!.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userObjectId),
      )
    }

    // Add the upvote
    post.upvotes! += 1
    post.upvotedBy!.push(userObjectId) // Add the user's ObjectId to the upvotedBy array
    user.upvotesReceived += 1 // Increase user's total upvote count
  }

  // Save the post and the user after updates
  await post.save()
  await user.save()

  return post
}

// DOWN VOTE POST
export const downvotePostFromDB = async (
  postId: string | Types.ObjectId,
  userId: string | Types.ObjectId, // Same for userId
) => {
  // Check if `postId` and `userId` are valid MongoDB ObjectId strings
  if (
    !mongoose.Types.ObjectId.isValid(postId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid post or user ID')
  }

  // Fetch the post and user by their IDs
  const post = await Post.findById(postId)
  const user = await User.findById(userId)

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  // Check if the user has already downvoted or upvoted the post
  const hasUpvoted = post.upvotedBy!.includes(userId as mongoose.Types.ObjectId)
  const hasDownvoted = post.downvotedBy!.includes(
    userId as mongoose.Types.ObjectId,
  )

  if (hasDownvoted) {
    // If the user has already downvoted, remove the downvote
    post.downvotes! -= 1
    post.downvotedBy = post.downvotedBy!.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== userId.toString(),
    )
    user.downvotesReceived! -= 1 // Decrease user's total downvote count (if applicable)
  } else {
    // If the user has upvoted before, remove the upvote first
    if (hasUpvoted) {
      post.upvotes! -= 1
      post.upvotedBy = post.upvotedBy!.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== userId.toString(),
      )
    }

    // Add the downvote
    post.downvotes! += 1
    post.downvotedBy!.push(new mongoose.Types.ObjectId(userId)) // Ensure proper ObjectId type is used
    user.downvotesReceived! += 1 // Increase user's total downvote count (if applicable)
  }

  // Save the post and the user after updates
  await post.save()
  await user.save()

  return post
}

// GET SINGLE POST FROM DB
const getSinglePostFromDB = async (postId: string) => {
  const post = await Post.findById(postId)
    .populate('author', 'name email profilePicture') // Populate author's name and profilePicture for the post
    .populate({
      path: 'comments', // Populate the comments
      populate: [
        {
          path: 'author', // Populate author inside each comment
          select: 'name profilePicture', // Only select name and profilePicture for the author
        },
        {
          path: 'replies', // Populate replies within each comment
          populate: {
            path: 'author', // Populate author inside each reply
            select: 'name profilePicture content', // Only select name and profilePicture for the reply author
          },
        },
      ],
    })

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  }

  // Safely increment upvotes
  post.views = (post.views || 0) + 1

  await post.save()

  return post
}

// GET POPULAR POSTS FROM DB
const getPopularPostsFromDB = async () => {
  const result = await Post.find({}).sort({ upvotes: -1 }).exec()

  return result
}

// GET POST BY USER
const getPostByUserInDB = async (userId: string) => {
  const posts = await Post.find({ author: userId }).exec()

  if (!posts || posts.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  }

  return posts
}

export const PostService = {
  createPost,
  getAllPost,
  postPremium,
  deletePost,
  updatePost,
  upvotePostFromDB,
  downvotePostFromDB,
  getSinglePostFromDB,
  getPopularPostsFromDB,
  getAllGetPaidPostFromDB,
  getPostByUserInDB,
}
