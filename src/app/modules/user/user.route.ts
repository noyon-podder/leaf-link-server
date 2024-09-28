import express from 'express'
import { UserValidations } from './user.validation'
import validateRequest from '../../middleware/validateRequest'
import { UserControllers } from './user.controller'

const router = express.Router()

router.post(
  '/create-user',
  validateRequest(UserValidations.userValidationSchema),
  UserControllers.createUser,
)

router.get('/users', UserControllers.getAllUsers)

router.get('/:id', UserControllers.getSingleUser)

router.delete('/:id', UserControllers.userDelete)
export const UserRoutes = router
