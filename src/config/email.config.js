dotenv.config();

export const mail = {
    host: 'localhost',
    port: 8000,
    user: process.env.email,
    pass: process.env.email
  }
  