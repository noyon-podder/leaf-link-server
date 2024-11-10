/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { Payment } from './payment.model'
import { User } from '../user/user.model'

const confirmationService = async (trxId: any) => {
  const paymentAccount = await Payment.findOneAndUpdate(
    { transactionId: trxId },
    { status: 'paid' },
  )

  if (!paymentAccount) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found!')
  }

  await User.findOneAndUpdate({ _id: paymentAccount.user }, { verified: true })
}

export const PaymentServices = {
  confirmationService,
}
