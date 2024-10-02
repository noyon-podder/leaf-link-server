import { parseBody } from './../../middleware/bodyParse'
import { Router } from 'express'
import { multerUpload } from '../../config/multer.config'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import validateImageFileRequest from '../../middleware/validateImageRequest'
import { ImageFilesArrayZodSchema } from './post.validation'
import { PostControllers } from './post.controller'
import validateRequest from '../../middleware/validateRequest'
import { PostValidation } from './post.validationt'

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

export const PostRoutes = router
