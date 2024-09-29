import { NextFunction, Request, Response } from 'express'
import { USER_ROLE, USER_STATUS } from '../modules/user/user.constant'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import { verifyToken } from '../utils/verifyJWT'
import config from '../config'
import { JwtPayload } from 'jsonwebtoken'
import { User } from '../modules/user/user.model'

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    // CHECKING IF THE TOKEN IS MISSING
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized!')
    }

    const decode = verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    const { role, email, iat } = decode

    //  CHECKING IF THE USER IS EXIST
    const user = await User.isUserExistsByEmail(email)

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    // CHECKING THE USER IS DELETED
    const isDeleted = user?.isDeleted

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is Deleted')
    }

    //  CHECKING IF THE USER US BLOCKED
    const userStatus = user?.status

    if (userStatus === USER_STATUS.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, 'Your account is blocked')
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
    }

    //  CHECKING IF THE USER HAS THE REQUIRED ROLE
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized !')
    }

    // NOW SET THE USER INFO IN THE REQUEST
    req.user = decode as JwtPayload

    next()
  })
}

export default auth
