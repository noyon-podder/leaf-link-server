import express from 'express'
import { UserRoutes } from '../modules/user/user.route'

const MainRouter = express.Router()

const moduleRoutes = [{ path: '/auth', routes: UserRoutes }]

moduleRoutes.forEach((route) => MainRouter.use(route.path, route.routes))

export default MainRouter
