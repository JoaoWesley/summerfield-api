import express from 'express'
import { mongoConnection } from './config/database/mongodbConfig'
import variables from './config/envVariablesConfig'
import bodyParser from 'body-parser'
import lessonRoute from './routes/api/lessonRoute'
import wordRoute from './routes/api/wordRoute'
import studyRoute from './routes/api/studyRoute'
import userRoute from './routes/api//userRoute'
import authRoute from './routes/api/authRoute'
import emailRoute from './routes/api/emailRoute'
import cors from 'cors'
import auth from './middlewares/auth'

mongoConnection.connect()

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/lesson', auth, lessonRoute)
app.use('/word', auth, wordRoute)
app.use('/study', auth, studyRoute)
app.use('/user', userRoute)
app.use('/auth', authRoute)
app.use('/email', emailRoute)

app.get('/', (req, res) => {
  res.json({ ok: 'true' })
})

app.listen(variables.PORT)
