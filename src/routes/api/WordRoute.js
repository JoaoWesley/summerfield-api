import express from 'express'
import { postWords, statusReport } from '../../controllers/api/wordController'

const router = express()

router.post('/', postWords)
router.get('/status-report', statusReport)

export default router
