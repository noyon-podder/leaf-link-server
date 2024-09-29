import { Router } from 'express'
import { AuthControllers } from './auth.controller'
import validateRequest from '../../middleware/validateRequest'
import { AuthValidations } from './auth.validation'

const router = Router()

router.post(
  '/register',
  validateRequest(AuthValidations.registerValidationSchema),
  AuthControllers.registerUser,
)

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
)

router.post(
  '/change-password',
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
)
export const AuthRoutes = router
