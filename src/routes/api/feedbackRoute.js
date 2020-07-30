import express from 'express'
import { postFeedback } from '../../controllers/api/feedbackController'

const router = express()

router.post('/', postFeedback)

export default router
