import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { verifyToken } from '../../utils/verifyJWT'
import { TUser } from './user.interface'
import { User } from './user.model'
import { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'

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

// FOLLOW USER SERVICES FUNCTION
const followUser = async (token: string | undefined, targetUserId: string) => {
  let decode
  if (token) {
    decode = verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload
  }
  const userId = decode?._id
  // Convert string IDs into ObjectId
  const userObjectId = new Types.ObjectId(userId)
  const targetUserObjectId = new Types.ObjectId(targetUserId)

  const user = await User.findById(userObjectId)
  const targetUser = await User.findById(targetUserObjectId)

  if (!user || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  // If the user is already following the target user
  if (user.following.includes(targetUserObjectId)) {
    throw new Error('Already following this user')
  }

  user.following.push(targetUserObjectId)
  targetUser.followers.push(userObjectId)

  await user.save()
  await targetUser.save()

  return
}

// UN FOLLOW USER  SERVICES FUNCTION
const unFollowUser = async (
  token: string | undefined,
  targetUserId: string,
) => {
  let decode
  if (token) {
    decode = verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload
  }
  const userId = decode?._id

  const targetUserObjectId = new Types.ObjectId(targetUserId)

  const user = await User.findById(userId)
  const targetUser = await User.findById(targetUserObjectId)

  if (!user || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  // Remove from following list
  user.following = user.following.filter((id) => id.toString() !== targetUserId)
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== userId,
  )

  await user.save()
  await targetUser.save()

  return
}

export const UserService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  userDeleteFromDB,
  profilePictureUpload,
  coverPhotoUpload,
  bioUpdate,
  followUser,
  unFollowUser,
}
