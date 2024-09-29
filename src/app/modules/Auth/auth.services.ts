import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import AppError from '../../errors/AppError'
import { createToken } from '../../utils/verifyJWT'
import { User } from '../user/user.model'
import { USER_ROLE, USER_STATUS } from '../user/user.constant'
import { TLoginUser, TRegisterUser } from './auth.interface'
import httpStatus from 'http-status'
import bcrypt from 'bcryptjs'

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

  // check the user is Deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Delete!')
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

// CHANGE PASSWORD
const changePassword = async (
  userData: JwtPayload,
  payload: {
    oldPassword: string
    newPassword: string
  },
) => {
  const user = await User.isUserExistsByEmail(userData.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  // checking if the user is blocked
  if (user?.status === USER_STATUS.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked!')
  }

  // checking if the user is deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Delete!')
  }

  // checking the password is matched
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is not matched')
  }

  // hash new password
  const newPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  await User.findOneAndUpdate(
    { email: userData.email, role: userData.role },
    { password: newPassword, passwordChangedAt: new Date() },
  )

  return null
}

// REFRESH TOKEN
const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload

  const { email, iat } = decoded

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // checking if the user is blocked
  const userStatus = user?.status

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
  }

  //  CREATE JWT PAYLOAD
  const jwtPayload = {
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    status: user?.status,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  return {
    accessToken,
  }
}

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
}
