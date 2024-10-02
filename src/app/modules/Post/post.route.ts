import { parseBody } from './../../middleware/bodyParse'
import { Router } from 'express'
import { multerUpload } from '../../config/multer.config'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import validateImageFileRequest from '../../middleware/validateImageRequest'
import { ImageFilesArrayZodSchema } from '../../zod/image.validation'
import { PostControllers } from './post.controller'
import validateRequest from '../../middleware/validateRequest'
import { PostValidation } from './post.validation'

const router = Router()

router.post(
  '/',
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: 'postImages' }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost,
)

router.get(
  '/',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  PostControllers.getAllPosts,
)

export const PostRoutes = router
