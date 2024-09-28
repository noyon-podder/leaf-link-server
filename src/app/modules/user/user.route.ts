import express from 'express'
import { UserControllers } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import { UserValidations } from './user.validation'

const router = express.Router()

router.post(
  '/register',
  validateRequest(UserValidations.userValidationSchema),
  UserControllers.createUser,
)

router.get('/users', UserControllers.getAllUsers)

router.get('/:id', UserControllers.getSingleUser)

router.delete('/:id', UserControllers.userDelete)
export const UserRoutes = router
