import dotenv from 'dotenv'

dotenv.config();

export const mail = {
    host: 'smtp.gmail.com',
    port: 587,
    user: process.env.email,
    pass: process.env.email_pswd
  }
  