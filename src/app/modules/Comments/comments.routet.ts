import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { CommentControllers } from './comments.controller'

const router = Router()

router.post(
  '/add-comment/:postId',
  auth(USER_ROLE.USER),
  CommentControllers.addComment,
)

export const CommentRoutes = router
