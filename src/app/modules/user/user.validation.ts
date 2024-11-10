import { z } from 'zod'
import { USER_STATUS } from './user.constant'

const userValidationSchema = z.object({
  body: z.object({
    email: z.string().email(), // Required and must be a valid email
    password: z.string().min(6), // Required and must have at least 6 characters
    profilePicture: z.string().url().optional(), // Optional, but must be a valid URL if provided
    name: z.string().min(1), // Required and must have at least 1 character
    bio: z.string().optional(), // Optional bio
    followers: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(), // Array of ObjectIds (24-char hex strings) for followers
    following: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(), // Array of ObjectIds for following
    verified: z.boolean().optional().default(false), // Optional and defaults to false
    upvotesReceived: z.number().optional().default(0), // Optional and defaults to 0
    posts: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(), // Array of ObjectIds for posts
    favorites: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(), // Array of ObjectIds for favourites
  }),
})

const userChangeValidationSchema = z.object({
  body: z.object({
    status: z.enum([...Object.keys(USER_STATUS)] as [string, ...string[]]),
  }),
})

export const UserValidations = {
  userValidationSchema,
  userChangeValidationSchema,
}
