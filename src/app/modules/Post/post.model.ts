import mongoose, { model } from 'mongoose'
import { IPost } from './post.interface'

const PostSchema = new mongoose.Schema(
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
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Post = model<IPost>('Post', PostSchema)
