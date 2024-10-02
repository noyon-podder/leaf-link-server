import httpStatus from 'http-status'
import { QueryBuilder } from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { TImageFiles } from '../../interface/image.interface'
import { PostsSearchableFields } from './post.constant'
import { IPost } from './post.interface'
import { Post } from './post.model'

// CREATE A NEW POST
const createPost = async (payload: IPost, images: TImageFiles) => {
  const { postImages } = images

  payload.images = postImages.map((image) => image.path)

  const result = await Post.create(payload)

  return result
}

// GET ALL POST WITH SEARCH
const getAllPost = async (query: Record<string, unknown>) => {
  const itemQuery = new QueryBuilder(Post.find().populate('author'), query)
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

export const PostService = {
  createPost,
  getAllPost,
  postPremium,
  deletePost,
  updatePost,
}
