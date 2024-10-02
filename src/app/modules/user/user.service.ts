import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { TUser } from './user.interface'
import { User } from './user.model'
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
  userId: string,
) => {
  if (!file) {
    throw new AppError(httpStatus.NOT_FOUND, 'File Is required')
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      profilePicture: file,
    },
    { new: true, runValidators: true },
  )

  return user
}
// COVER PHOTO  UPLOAD SUCCESSFULLY
const coverPhotoUpload = async (file: string | undefined, userId: string) => {
  if (!file) {
    throw new AppError(httpStatus.NOT_FOUND, 'File Is required')
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      coverPhoto: file,
    },
    { new: true, runValidators: true },
  )

  return user
}

// USER BIO UPDATE
const bioUpdate = async (bio: string, userID: string) => {
  const user = await User.findByIdAndUpdate(
    userID,
    {
      bio: bio,
    },
    { new: true, runValidators: true },
  )

  return user
}

// FOLLOW USER SERVICES FUNCTION
const followUser = async (userId: string, targetUserId: string) => {
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
  userId: string,

  targetUserId: string,
) => {
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
