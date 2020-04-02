import express from 'express'
import { postWords } from '../../controllers/api/wordController'

const router = express()

router.post('/', postWords)

export default router
