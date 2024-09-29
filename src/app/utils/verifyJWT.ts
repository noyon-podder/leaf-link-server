/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken'

import { Types } from 'mongoose'
import { USER_ROLE, USER_STATUS } from '../modules/user/usre.constant'
import AppError from '../errors/AppError'

export const createToken = (
  jwtPayload: {
    _id?: Types.ObjectId
    name: string
    email: string
    role: keyof typeof USER_ROLE
    status: keyof typeof USER_STATUS
  },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  })
}

export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch (error: any) {
    throw new AppError(401, 'Your aer not authorized!')
  }
}
