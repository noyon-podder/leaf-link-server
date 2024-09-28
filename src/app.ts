import express, { Response, Request, Application } from 'express'
import cors from 'cors'
import MainRouter from './app/routes'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import notFoundRoute from './app/middleware/notFoundRoute'
import cookieParser from 'cookie-parser'

const app: Application = express()

//parser
app.use(cors())
app.use(cookieParser())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// whole project router call here
app.use('/api/v1', MainRouter)

// check routing
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'Hello Developer!!',
  })
})

// global error handler
app.use(globalErrorHandler)

// not found route
app.use(notFoundRoute)
export default app

//TODO: first off all start from user login and create access token and refresh token
//!Lets Start the code
