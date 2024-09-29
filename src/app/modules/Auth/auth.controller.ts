import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.services'
import config from '../../config'

// REGISTER A NEW USER WITH ACCESS TOKEN & REFRESH TOKEN
const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body)

  const { refreshToken, accessToken } = result

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  })
})

// LOGIN USER WITH EMAIL & PASSWORD WITH TOKEN SET IN COOKIE
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)

  const { refreshToken, accessToken } = result

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  })
})

// CHANGE PASSWORD FROM CONTROLLER
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body

  const result = await AuthServices.changePassword(req.user, passwordData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Update Successfully!',
    data: result,
  })
})

export const AuthControllers = {
  registerUser,
  loginUser,
  changePassword,
}
