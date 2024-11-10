import httpStatus from 'http-status'
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

// GET ALL POSTS
const getAllPosts = catchAsync(async (req, res) => {
  const item = await PostService.getAllPost(req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: item,
  })
})

// GET SINGLE POSTS
const getSinglePost = catchAsync(async (req, res) => {
  const item = await PostService.getSinglePostFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: item,
  })
})

// GET ALL PAID POST
const getAllPaidPost = catchAsync(async (req, res) => {
  const item = await PostService.getAllGetPaidPostFromDB()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Paid Post Retrieve successfully',
    data: item,
  })
})

// UPDATE   a Premium post
const premiumPost = catchAsync(async (req, res) => {
  const postId = req.params.id
  const item = await PostService.postPremium(postId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'This post now premium',
    data: item,
  })
})

// UPDATE POST
const updatePost = catchAsync(async (req, res) => {
  const postId = req.params.id
  const item = await PostService.updatePost(postId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'This post now premium',
    data: item,
  })
})

// DELETE POST
const deletePost = catchAsync(async (req, res) => {
  const postId = req.params.id
  const item = await PostService.deletePost(postId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post Delete successfully',
    data: item,
  })
})

// UPVOTE POST FORM
const upvotePost = catchAsync(async (req, res) => {
  const userId = req?.user?.userId
  const item = await PostService.upvotePostFromDB(req.params.id, userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Upvote Post successfully',
    data: item,
  })
})

// downVOTE POST FORM
const downVotePost = catchAsync(async (req, res) => {
  const userId = req?.user?.userId
  const item = await PostService.downvotePostFromDB(req.params.id, userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Downvote Post successfully',
    data: item,
  })
})

// GET POPULAR POSTS
const getPopularPosts = catchAsync(async (req, res) => {
  const item = await PostService.getPopularPostsFromDB()

  console.log(item)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Popular Post Retrieve successfully',
    data: item,
  })
})

export const PostControllers = {
  createPost,
  getAllPosts,
  premiumPost,
  deletePost,
  updatePost,
  upvotePost,
  downVotePost,
  getSinglePost,
  getPopularPosts,
  getAllPaidPost,
}
