import express from 'express'
import { mongoConnection } from './config/database/mongodbConfig'
import variables from './config/envVariablesConfig'
import bodyParser from 'body-parser'
import lessonRoute from './routes/api/lessonRoute'

mongoConnection.connect()

const app = express()

app.use(bodyParser.json())

app.use('/lesson', lessonRoute)

app.get('/', (req, res) => {
  res.json({ ok: 'true' })
})

app.listen(variables.PORT)
