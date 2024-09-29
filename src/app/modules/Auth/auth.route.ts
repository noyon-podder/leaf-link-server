import { Router } from 'express'
import { AuthControllers } from './auth.controller'
import validateRequest from '../../middleware/validateRequest'
import { AuthValidations } from './auth.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

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
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
)

router.post(
  '/refresh-token',
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
)

router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
)

router.post(
  '/reset-password',
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
)
export const AuthRoutes = router
