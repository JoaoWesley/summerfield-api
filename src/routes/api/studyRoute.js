import express from 'express'
import {
  postItem,
  getItems,
  getItem,
  trimPhrase,
  putItem,
  review,
  evaluate,
  getPopularTranslation,
  postPopularTranslation,
  getTranslation
} from '../../controllers/api/studyController'

const router = express()

router.get('/item', getItems)
router.get('/item/:wordPhrase', getItem)
router.post('/item', postItem)
router.put('/item', putItem)
router.get('/trim-phrase/:phrase', trimPhrase)
router.get('/review/', review)
router.post('/evaluate/', evaluate)
router.get('/popular-translation/', getPopularTranslation)
router.post('/popular-translation/', postPopularTranslation)
router.get('/translation/', getTranslation)

export default router
