import mongoose from 'mongoose'
import variables from '../envVariablesConfig'

export const mongoConnection = {
  connect: async () => {
    try {
      await mongoose.connect(variables.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    } catch (error) {
      console.log(error)
    }
  }
}
