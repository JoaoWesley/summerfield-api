import express from 'express'
import { getLessons, getLessonById, postLesson } from '../../controllers/api/lessonController'

const router = express()

router.get('/', getLessons)
router.get('/:id', getLessonById)
router.post('/', postLesson)

export default router
