import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.services'
import config from '../../config'

// register a new user with access token and refresh token
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

// login user with  email and password and set token in cookie
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

export const AuthControllers = {
  registerUser,
  loginUser,
}
