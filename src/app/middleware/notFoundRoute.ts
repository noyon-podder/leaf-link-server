/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { RequestHandler } from 'express'

const notFoundRoute: RequestHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API Not Found',
    error: '',
  })
}

export default notFoundRoute
