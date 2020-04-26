import express from 'express'
import { getLessons, getLessonById, postLesson, putLesson, deleteLesson } from '../../controllers/api/lessonController'

const router = express()

router.get('/', getLessons)
router.get('/:id', getLessonById)
router.post('/', postLesson)
router.put('/', putLesson)
router.delete('/:id', deleteLesson)

export default router
