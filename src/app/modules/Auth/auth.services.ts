import config from '../../config'
import AppError from '../../errors/AppError'
import { createToken } from '../../utils/verifyToken'
import { User } from '../user/user.model'
import { USER_ROLE } from '../user/usre.constant'

import { TRegisterUser } from './auth.interface'
import httpStatus from 'http-status'

// register a new user
const registerUser = async (payload: TRegisterUser) => {
  const user = await User.isUserExistsByEmail(payload.email)

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!')
  }

  payload.role = USER_ROLE.USER

  const newUser = await User.create(payload)

  // create token and sent to client
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

export const AuthServices = {
  registerUser,
}
