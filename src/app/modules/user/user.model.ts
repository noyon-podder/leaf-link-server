import mongoose, { model, Schema } from 'mongoose'
import { TUser } from './user.interface'

const userSchema = new Schema<TUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  name: { type: String, required: true },
  bio: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  verified: { type: Boolean, default: false },
  upvotesReceived: { type: Number, default: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
})

// Pre middleware to exclude documents where isDeleted is true
userSchema.pre('find', function () {
  this.where({ isDeleted: { $ne: true } })
})

userSchema.pre('findOne', function () {
  this.where({ isDeleted: { $ne: true } })
})

export const User = model<TUser>('User', userSchema)
