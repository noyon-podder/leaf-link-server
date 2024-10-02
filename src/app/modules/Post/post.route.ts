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

// CREATE POST
router.post(
  '/',
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: 'postImages' }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost,
)

// GET ALL POST ====> common user see all post
router.get('/', PostControllers.getAllPosts)

// SINGLE POST
router.get('/:id', PostControllers.getSinglePost)

// UPDATE POST
router.put(
  '/:id',
  auth(USER_ROLE.USER),
  validateRequest(PostValidation.updateValidationSchema),
  PostControllers.updatePost,
)

// DELETE POST
router.delete('/:id', auth(USER_ROLE.USER), PostControllers.deletePost)

// Post premium
router.put('/premium/:id', auth(USER_ROLE.USER), PostControllers.premiumPost)

// UPVOTE POST
router.post('/:id/upvote', auth(USER_ROLE.USER), PostControllers.upvotePost)

// UPVOTE POST
router.post('/:id/downvote', auth(USER_ROLE.USER), PostControllers.downVotePost)

// POPULAR POSTS
router.get('/popular/posts', PostControllers.getPopularPosts)

export const PostRoutes = router
