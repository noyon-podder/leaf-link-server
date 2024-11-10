import axios from 'axios'
import config from '../../config'

export const initiatePayment = async (paymentData: any) => {
  const response = await axios.post(config.paymentURL!, {
    store_id: config.store_id,
    tran_id: paymentData.transactionId,
    success_url: `http://localhost:8000/api/v1/payment/confirmation?transactionId=${paymentData.transactionId}`,
    fail_url: 'http://www.merchantdomain.com/failedpage.html',
    cancel_url: 'http://www.merchantdomain.com/cancellpage.html',
    amount: '30.0',
    currency: 'BDT',
    signature_key: config.signature_key,
    desc: 'Merchant Registration Payment',
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: 'N/A',
    cus_add2: 'N/A',
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: 'N/A',
    cus_country: 'N/A',
    cus_phone: 'N/A',
    type: 'json',
  })

  return response.data
}
