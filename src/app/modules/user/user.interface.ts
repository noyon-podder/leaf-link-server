import { Types } from 'mongoose'

export type TUser = {
  email: string
  password: string
  profilePicture: string
  name: string
  bio: string
  followers: Types.ObjectId
  following: Types.ObjectId
  verified: boolean
  upvotesReceived: number
  posts: Types.ObjectId
  favorites: Types.ObjectId
  role: 'USER' | 'ADMIN'
}
