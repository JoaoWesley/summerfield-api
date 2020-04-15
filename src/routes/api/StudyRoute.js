import express from 'express'
import { postItem, trimPhrase } from '../../controllers/api//studyController'

const router = express()

router.post('/', postItem)
router.post('/trim-phrase', trimPhrase)

export default router
