import mongoose from 'mongoose'
import { z } from 'zod'

const categoryEnum = ['Vegetables', 'Flowers', 'Landscaping', 'Other'] as const

const createPostValidationSchema = z.object({
  body: z.object({
    author: z
      .string({
        required_error: 'Author ID is required',
      })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid Author ID',
      }), // Validate as a valid MongoDB ObjectId
    title: z.string({
      required_error: 'Title is required',
    }),
    content: z.string({
      required_error: 'Content is required',
    }),
    category: z.enum(categoryEnum, {
      required_error: 'Category is required',
      invalid_type_error: 'Invalid category value',
    }),
    isPremium: z.boolean().optional(),
    upvotes: z.number().optional().default(0),
    downvotes: z.number().optional().default(0),
    comments: z
      .array(
        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid Comment ID',
        }),
      )
      .optional(),
  }),
})

const updateValidationSchema = z.object({
  body: z.object({
    author: z
      .string()
      .optional()
      .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid Author ID',
      }), // Validate as a valid MongoDB ObjectId if provided

    title: z.string().optional(),

    content: z.string().optional(),

    category: z.enum(categoryEnum).optional().or(z.string().optional()), // Allow category as optional, or as a string fallback

    isPremium: z.boolean().optional(),

    upvotes: z.number().optional().default(0),

    downvotes: z.number().optional().default(0),

    comments: z
      .array(
        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid Comment ID',
        }),
      )
      .optional(),
  }),
})

export const PostValidation = {
  createPostValidationSchema,
  updateValidationSchema,
}
