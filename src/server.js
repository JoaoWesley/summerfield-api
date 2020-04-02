import express from 'express'
import { mongoConnection } from './config/database/mongodbConfig'
import variables from './config/envVariablesConfig'
import bodyParser from 'body-parser'
import lessonRoute from './routes/api/lessonRoute'
import wordRoute from './routes/api/WordRoute'

mongoConnection.connect()

const app = express()

app.use(bodyParser.json())

app.use('/lesson', lessonRoute)
app.use('/word', wordRoute)

app.get('/', (req, res) => {
  res.json({ ok: 'true' })
})

app.listen(variables.PORT)
