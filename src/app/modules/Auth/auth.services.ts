import config from '../../config'
import AppError from '../../errors/AppError'
import { createToken } from '../../utils/verifyToken'
import { User } from '../user/user.model'
import { USER_ROLE, USER_STATUS } from '../user/usre.constant'
import { TLoginUser, TRegisterUser } from './auth.interface'
import httpStatus from 'http-status'

// register a new user
const registerUser = async (payload: TRegisterUser) => {
  const user = await User.isUserExistsByEmail(payload.email)

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!')
  }

  payload.role = USER_ROLE.USER

  const newUser = await User.create(payload)

  // create JWT payload and sent to client
  const jwtPayload = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
  }

  // create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
  }
}

// login user with token
const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload?.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  // checking if the user is blocked
  const userStatus = user?.status

  if (userStatus === USER_STATUS.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked')
  }

  // checking password if the user password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password')
  }

  //  create jwt payload
  const jwtPayload = {
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    status: user?.status,
  }

  // create accessToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  // create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
  }
}

export const AuthServices = {
  registerUser,
  loginUser,
}
