/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { model } from 'mongoose'
import { IPost } from './post.interface'
import { User } from '../user/user.model'

const PostSchema = new mongoose.Schema<IPost>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Vegetables', 'Flowers', 'Landscaping', 'Other'],
      required: true,
    },
    images: [{ type: String, required: true }],
    isPremium: { type: Boolean, default: false },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    upvotedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ], // Store users who upvoted
    downvotedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ], // Store users who downvoted
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: [] },
    ],
    views: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Query Middleware to exclude deleted posts
PostSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

PostSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

// Post-save middleware to update the user's posts array
PostSchema.post('save', async function (post, next) {
  try {
    // Find the user and push the post ID to the user's posts array
    await User.findByIdAndUpdate(post.author, {
      $push: { posts: post._id },
    })
    next()
  } catch (error: any) {
    console.error('Error adding post to user model:', error)
    next(error)
  }
})

export const Post = model<IPost>('Post', PostSchema)
