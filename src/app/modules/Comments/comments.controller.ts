// ADD COMMENT

import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { CommentsService } from './comments.service'

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

export const CommentControllers = {
  addComment,
}
