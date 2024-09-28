/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'

type TSendResponse = {
  statusCode: number
  data: any
  message: string
  success: boolean
}

const sendResponse = (res: Response, data: TSendResponse) => {
  return res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data,
  })
}

export default sendResponse
