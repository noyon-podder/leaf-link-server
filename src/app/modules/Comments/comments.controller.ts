import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { CommentsService } from './comments.service'

// ADD COMMENT
const addComment = catchAsync(async (req, res) => {
  const postId = req.params.postId
  const payload = req.body

  const result = await CommentsService.addCommentIntoDB(postId, payload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Successfully',
    data: result,
  })
})

// REPLIED SPECIFIC COMMENT
const repliedComment = catchAsync(async (req, res) => {
  const postId = req.params.commentId
  const payload = req.body

  const result = await CommentsService.repliedSpecificComment(postId, payload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Replay Successfully',
    data: result,
  })
})

// GET ALL COMMENTS
const getComments = catchAsync(async (req, res) => {
  const postId = req.params.postId

  const result = await CommentsService.getCommentsByPost(postId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Retrieve Successfully',
    data: result,
  })
})

// DELETE COMMENT
const deleteComment = catchAsync(async (req, res) => {
  const commentId = req.params.commentId

  const result = await CommentsService.deleteCommentFromDb(commentId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Delete Successfully',
    data: result,
  })
})

// UPDATE COMMENT
const updateComment = catchAsync(async (req, res) => {
  const commentId = req.params.commentId
  const payload = req.body.content

  const result = await CommentsService.updateCommentFromDB(commentId, payload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Update Successfully',
    data: result,
  })
})
export const CommentControllers = {
  addComment,
  repliedComment,
  getComments,
  deleteComment,
  updateComment,
}
