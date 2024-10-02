import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { verifyToken } from '../../utils/verifyJWT'
import { TUser } from './user.interface'
import { User } from './user.model'
import { JwtPayload } from 'jsonwebtoken'

const createUserIntoDB = async (student: TUser) => {
  const result = await User.create(student)

  return result
}

const getAllUsersFromDB = async () => {
  const result = await User.find({})

  return result
}

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findOne({ _id: id })

  if (!result) {
    throw new AppError(404, 'User Not Found')
  }

  return result
}

// single user soft delete from db
const userDeleteFromDB = async (id: string) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  )

  return result
}

// PROFILE PICTURE UPLOAD SUCCESSFULLY
const profilePictureUpload = async (
  file: string | undefined,
  token: string | undefined,
) => {
  if (!file) {
    throw new AppError(httpStatus.NOT_FOUND, 'File Is required')
  }
  let decode
  if (token) {
    decode = verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload
  }

  const user = await User.findByIdAndUpdate(
    decode?._id,
    {
      profilePicture: file,
    },
    { new: true, runValidators: true },
  )

  return user
}

// PROFILE PICTURE UPLOAD SUCCESSFULLY
const coverPhotoUpload = async (
  file: string | undefined,
  token: string | undefined,
) => {
  if (!file) {
    throw new AppError(httpStatus.NOT_FOUND, 'File Is required')
  }
  let decode
  if (token) {
    decode = verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload
  }

  const user = await User.findByIdAndUpdate(
    decode?._id,
    {
      coverPhoto: file,
    },
    { new: true, runValidators: true },
  )

  return user
}

// USER BIO UPDATE
const bioUpdate = async (bio: string, token: string | undefined) => {
  let decode
  if (token) {
    decode = verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload
  }

  const user = await User.findByIdAndUpdate(
    decode?._id,
    {
      bio: bio,
    },
    { new: true, runValidators: true },
  )

  return user
}

export const UserService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  userDeleteFromDB,
  profilePictureUpload,
  coverPhotoUpload,
  bioUpdate,
}
