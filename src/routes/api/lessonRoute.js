import express from 'express'
import {
  getLessons,
  getLessonById,
  getLessonTopicsByLessonId,
  postLesson,
  putLesson,
  deleteLesson,
  importLesson
}
  from '../../controllers/api/lessonController'

const router = express()

router.get('/', getLessons)
router.get('/:id', getLessonById)
router.get('/:id/lesson-topics', getLessonTopicsByLessonId)
router.post('/', postLesson)
router.post('/import-lesson', importLesson)
router.put('/', putLesson)
router.delete('/:id', deleteLesson)

export default router
