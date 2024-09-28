import jwt from 'jsonwebtoken'

import { Types } from 'mongoose'
import { USER_ROLE, USER_STATUS } from '../modules/user/usre.constant'

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
