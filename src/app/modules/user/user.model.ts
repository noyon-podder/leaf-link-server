import mongoose, { model, Schema } from 'mongoose'
import { USER_ROLE, USER_STATUS } from './user.constant'
import { IUserModel, TUser } from './user.interface'
import config from '../../config'
import bcryptjs from 'bcryptjs'

const userSchema = new Schema<TUser, IUserModel>({
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
  status: {
    type: String,
    enum: Object.keys(USER_STATUS),
    default: USER_STATUS.ACTIVE,
  },
  role: {
    type: String,
    enum: Object.keys(USER_ROLE),
    default: USER_ROLE.USER,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this // doc
  // hashing password and save into DB

  user.password = await bcryptjs.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )

  next()
})

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

// Query Middleware
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000
  return passwordChangedTime > jwtIssuedTimestamp
}
export const User = model<TUser, IUserModel>('User', userSchema)
