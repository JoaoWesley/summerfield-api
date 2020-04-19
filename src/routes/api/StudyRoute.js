import express from 'express'
import { postItem, getItems, getItem, trimPhrase } from '../../controllers/api//studyController'

const router = express()

router.get('/', getItems)
router.post('/', postItem)
router.get('/:wordPhrase', getItem)
router.post('/trim-phrase', trimPhrase)

export default router
