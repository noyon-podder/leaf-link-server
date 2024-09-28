import AppError from '../../errors/AppError'
import { TUser } from './user.interface'
import { User } from './user.model'

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

export const UserService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  userDeleteFromDB,
}
