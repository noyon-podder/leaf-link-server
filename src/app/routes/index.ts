import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/Auth/auth.route'
import { PostRoutes } from '../modules/Post/post.route'
import { CommentRoutes } from '../modules/Comments/comments.routet'
import { PaymentRoutes } from '../modules/payment/payment.route'

const MainRouter = express.Router()

const moduleRoutes = [
  { path: '/user', routes: UserRoutes },
  { path: '/auth', routes: AuthRoutes },
  { path: '/post', routes: PostRoutes },
  { path: '/comment', routes: CommentRoutes },
  { path: '/payment', routes: PaymentRoutes },
]

moduleRoutes.forEach((route) => MainRouter.use(route.path, route.routes))

export default MainRouter
