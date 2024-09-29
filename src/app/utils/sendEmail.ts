import nodemailer from 'nodemailer'
import config from '../config'

export const sendEMail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  })

  await transporter.sendMail({
    from: config.email_user,
    to,
    subject: 'Reset your password within ten mins!',
    text: '',
    html,
  })
}
