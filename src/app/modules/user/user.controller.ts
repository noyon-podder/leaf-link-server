import { Request, Response } from 'express'
import { UserService } from './user.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'

// create a user
const createUser = catchAsync(async (req, res) => {
  const data = req.body

  const result = await UserService.createUserIntoDB(data)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Create Successfully',
    data: result,
  })
})

// get all students
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All User retrieve Successfully',
    data: result,
  })
})

// GET SINGLE USER
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await UserService.getSingleUserFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single User retrieve Successfully',
    data: result,
  })
})

//  GET POST BY ID
const getAllPostByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await UserService.getAllPostByID(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get Post by specific user',
    data: result,
  })
})

const userDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const result = await UserService.userDeleteFromDB(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Delete Successfully',
    data: result,
  })
})

// PROFILE PICTURE UPLOAD
const profilePictureUpload = catchAsync(async (req: Request, res: Response) => {
  const file = req?.file?.path
  const userId = req?.user?.userId

  const result = await UserService.profilePictureUpload(file, userId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile Picture Upload Successfully!',
    data: result,
  })
})

//cover PICTURE UPLOAD
const coverPhotoUpload = catchAsync(async (req: Request, res: Response) => {
  const file = req?.file?.path
  const userId = req.user.userId

  const result = await UserService.coverPhotoUpload(file, userId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cover Upload Successfully!',
    data: result,
  })
})

// BIO UPDATE
const bioUpdate = catchAsync(async (req: Request, res: Response) => {
  const bio = req?.body?.bio
  const userId = req.user.userId

  const result = await UserService.bioUpdate(bio, userId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bio Add Successfully!',
    data: result,
  })
})

// USER FOLLOW CONTROLLER
const followUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId
  const targetedUser = req.body.targetUserId
  console.log(userId, targetedUser)
  const result = await UserService.followUser(userId, targetedUser)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Followed Successfully!',
    data: result,
  })
})
// UN FOLLOW USER
const unFollowUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId
  const { targetedUser } = req.body

  const result = await UserService.unFollowUser(userId, targetedUser)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'UnFollow Successfully!',
    data: result,
  })
})

// VERIFIED USER BY AMAR PAY
const verifiedUserAmarPay = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId

  const result = await UserService.verifyUserByAmarPay(userId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Verified!',
    data: result,
  })
})

// GET ME CONTROLLER FUNCTION
const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user

  const result = await UserService.getMeFromDB(user.userId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get Me Successfully!',
    data: result,
  })
})

// USER CHANGE STATUS
const changeStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId
  const { status } = req.body

  console.log(status)
  const result = await UserService.changeUserStatus(userId, status)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Change Status Successfully!',
    data: result,
  })
})

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  userDelete,
  profilePictureUpload,
  coverPhotoUpload,
  bioUpdate,
  followUser,
  unFollowUser,
  getAllPostByUserId,
  verifiedUserAmarPay,
  getMe,
  changeStatus,
}
