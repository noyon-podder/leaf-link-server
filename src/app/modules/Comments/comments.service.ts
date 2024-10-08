import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { Post } from '../Post/post.model'
import { Comment } from './commnets.model'

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

export const CommentsService = { addCommentIntoDB }
