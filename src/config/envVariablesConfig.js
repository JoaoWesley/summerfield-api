import dotenv from 'dotenv'

dotenv.config()

export default {
  PORT: process.env.PORT,
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_SENDER_LOGIN: process.env.EMAIL_SENDER_LOGIN,
  EMAIL_SENDER_PASSWORD: process.env.EMAIL_SENDER_PASSWORD,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL
}
