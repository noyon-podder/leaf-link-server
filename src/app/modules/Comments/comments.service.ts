import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { Post } from '../Post/post.model'
import { Comment } from './comments.model'

// ADD COMMENT
const addCommentIntoDB = async (
  postId: string,
  payload: { authorId: string; content: string },
) => {
  const { authorId, content } = payload

  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post Not Found')
  }

  // Create a new comment
  const newComment = new Comment({
    post: postId,
    author: authorId,
    content,
  })

  await newComment.save()

  // Add the comment to the post's comment array
  post.comments!.push(newComment._id)
  await post.save()

  return newComment
}

// REPLIED SPECIFIC COMMENT
const repliedSpecificComment = async (
  commentId: string,
  payload: { authorId: string; content: string },
) => {
  const { authorId, content } = payload

  const parentComment = await Comment.findById(commentId)
  if (!parentComment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parent comment not found')
  }

  const newReply = new Comment({
    post: parentComment.post,
    author: authorId,
    content,
  })

  await newReply.save()

  // Add the reply to the parent comment's replies array
  parentComment.replies.push(newReply._id)
  await parentComment.save()

  return parentComment
}

// GET ALL COMMENT
const getCommentsByPost = async (postId: string) => {
  const comments = await Comment.find({ post: postId })
    .populate('author', 'name profilePicture')
    .populate('replies')

  return comments
}

// DELETE A COMMENT
const deleteCommentFromDb = async (commentId: string) => {
  const result = await Comment.findByIdAndDelete(commentId)

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment  not found')
  }

  return result
}

// UPDATE COMMENT
const updateCommentFromDB = async (commentId: string, payload: string) => {
  const result = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: payload,
    },
    { new: true },
  )

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found')
  }

  return result
}
export const CommentsService = {
  addCommentIntoDB,
  repliedSpecificComment,
  getCommentsByPost,
  deleteCommentFromDb,
  updateCommentFromDB,
}
