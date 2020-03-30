import express from 'express'
import { getLessons, getLessonById } from '../../controllers/api/lessonController'

const router = express()

router.get('/', getLessons)
router.get('/:id', getLessonById)

export default router
