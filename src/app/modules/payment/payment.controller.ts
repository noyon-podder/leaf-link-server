import { Request, Response } from 'express'
import { PaymentServices } from './payment.service'

const confirmationController = async (req: Request, res: Response) => {
  const trxId = req.query.transactionId
  const result = await PaymentServices.confirmationService(trxId)
  res.send(`<h1>Payment Success</h1>
    <a href="http://localhost:3000" style="background: "red" color: white>Go To Home</a>
    `)
}

export const PaymentControllers = {
  confirmationController,
}
