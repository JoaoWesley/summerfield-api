import express from 'express'
import { postWords, statusReport, putWord } from '../../controllers/api/wordController'

const router = express()

router.post('/', postWords)
router.put('/', putWord)
router.get('/status-report', statusReport)

export default router
