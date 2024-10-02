import AppError from '../../errors/AppError'
import { TImageFiles } from '../../interface/image.interface'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PostService } from './post.service'

// CREATE A NEW POST
const createPost = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(400, 'Please upload an image')
  }

  const result = await PostService.createPost(
    req.body,
    req.files as TImageFiles,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post Create Successfully',
    data: result,
  })
})

export const PostControllers = {
  createPost,
}
