import nodemailer from 'nodemailer';
import { mail } from '../config/email.config.js';
import { getEmailTemplate } from '../templates/email.templates.js';


const emailTransporter = nodemailer.createTransport({
service: 'gmail',
host: mail.host,
port: mail.port,
  auth: {
    user: mail.user,
    pass: mail.pass
  }
});

export const emailOptions = async (email, nameUser, token) => {
    await emailTransporter.sendMail({
      from: mail.user,
      to: email,
      subject: "Reset Password",
      html: getEmailTemplate(token, nameUser)
    });
  };
