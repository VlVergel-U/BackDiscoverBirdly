import nodemailer from 'nodemailer';
import { mail } from '../config/email.config.js';

const emailTransporter = nodemailer.createTransport({
service: 'gmail',
host: mail.host,
port: mail.port,
  auth: {
    user: mail.user,
    pass: mail.pass
  },
  tls: {
    rejectUnauthorized: false 
  }
});

export const sendEmail = async (email, subject, html) => {
    try {
        await emailTransporter.sendMail({
          from: mail.user,
          to: email,
          subject: subject,
          html: html
        });
        console.log('Correo enviado exitosamente');
      } catch (error) {
        console.error('Error al enviar el correo:', error);
      }
  };
