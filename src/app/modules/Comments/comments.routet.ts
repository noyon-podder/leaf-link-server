import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { CommentControllers } from './comments.controller'

const router = Router()

router.post(
  '/:postId/add-comment',
  auth(USER_ROLE.USER),
  CommentControllers.addComment,
)

router.post(
  '/:commentId/replay',
  auth(USER_ROLE.USER),
  CommentControllers.repliedComment,
)

router.get(
  '/:postId/comments',
  auth(USER_ROLE.USER),
  CommentControllers.getComments,
)

router.delete(
  '/:commentId',
  auth(USER_ROLE.USER),
  CommentControllers.deleteComment,
)

router.put(
  '/:commentId',
  auth(USER_ROLE.USER),
  CommentControllers.updateComment,
)

export const CommentRoutes = router
