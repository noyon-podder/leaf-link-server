import { Types } from 'mongoose'

export interface IPost {
  title: string
  content: string
  author: Types.ObjectId
  categories: string[]
  isPremium: boolean
  images?: string[]
  upvotes?: number
  downvotes?: number
  comments?: Types.ObjectId[]
}
