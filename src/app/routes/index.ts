import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/Auth/auth.route'
import { PostRoutes } from '../modules/Post/post.route'

const MainRouter = express.Router()

const moduleRoutes = [
  { path: '/user', routes: UserRoutes },
  { path: '/auth', routes: AuthRoutes },
  { path: '/post', routes: PostRoutes },
]

moduleRoutes.forEach((route) => MainRouter.use(route.path, route.routes))

export default MainRouter
