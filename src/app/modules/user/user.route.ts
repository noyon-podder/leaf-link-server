import express from 'express'
import { UserValidations } from './user.validation'
import validateRequest from '../../middleware/validateRequest'
import { UserControllers } from './user.controller'
import { multerUpload } from '../../config/multer.config'
import auth from '../../middleware/auth'
import { USER_ROLE } from './user.constant'

const router = express.Router()

router.post(
  '/create-user',
  validateRequest(UserValidations.userValidationSchema),
  UserControllers.createUser,
)

router.get('/users', UserControllers.getAllUsers)

router.get('/:id', UserControllers.getSingleUser)

router.delete('/:id', UserControllers.userDelete)

router.put(
  '/profile-picture',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  multerUpload.single('image'),
  UserControllers.profilePictureUpload,
)

router.put(
  '/cover-photo',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  multerUpload.single('image'),
  UserControllers.coverPhotoUpload,
)

router.put(
  '/update-bio',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.bioUpdate,
)
export const UserRoutes = router
