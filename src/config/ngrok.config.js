import dotenv from 'dotenv'

dotenv.config();

export const data_ngrok = {
token: process.env.token_ngrok,
domain: process.env.domain_ngrok
}