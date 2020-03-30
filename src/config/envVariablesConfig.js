import dotenv from 'dotenv'

dotenv.config()

export default {
  PORT: process.env.PORT,
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING
}
