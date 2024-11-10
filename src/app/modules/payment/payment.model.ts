import mongoose, { model, Schema } from 'mongoose'

const paymentSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    default: '',
  },
  transactionId: {
    type: String,
    default: '',
  },
})

export const Payment = model('Payment', paymentSchema)
