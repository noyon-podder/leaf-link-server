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
// GET ALL USERS
router.get('/users', auth(USER_ROLE.ADMIN), UserControllers.getAllUsers)

// GET SINGLE USER
router.get(
  '/single-user/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.getSingleUser,
)

// GET  POST BY USER ID
router.get(
  '/:userId',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.getAllPostByUserId,
)

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

// BIO UPDATE
router.put(
  '/update-bio',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.bioUpdate,
)

// FOLLOW USER
router.post(
  '/follow',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.followUser,
)

// UnFOLLOW USER
router.post(
  '/unfollow',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.unFollowUser,
)
export const UserRoutes = router

// VERIFIED USER BY AMAR PAY
router.post(
  '/verify',
  auth(USER_ROLE.USER),
  UserControllers.verifiedUserAmarPay,
)

// GET ME ROUTE
router.get(
  '/userInfo/me',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.getMe,
)

// CHANGE STATUS BY USER
router.put(
  '/change-status/:userId',
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidations.userChangeValidationSchema),
  UserControllers.changeStatus,
)

// TOP WRITERS
router.get('/writer/top-writers', UserControllers.topWrites)
