import express from 'express'
import { postItem, getItems, getItem, trimPhrase, putItem } from '../../controllers/api//studyController'

const router = express()

router.get('/', getItems)
router.get('/:wordPhrase', getItem)
router.post('/', postItem)
router.post('/trim-phrase', trimPhrase)
router.put('/', putItem)

export default router
