import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/Auth/auth.route'

const MainRouter = express.Router()

const moduleRoutes = [
  { path: '/user', routes: UserRoutes },
  { path: '/auth', routes: AuthRoutes },
]

moduleRoutes.forEach((route) => MainRouter.use(route.path, route.routes))

export default MainRouter
