import express from 'express'
import {
  getLessons,
  getLessonById,
  getLessonTopicsByLessonId,
  postLesson,
  putLesson,
  putLessonTopic,
  deleteLesson,
  importLesson,
  deleteLessonTopic
} from '../../controllers/api/lessonController'

const router = express()

router.get('/', getLessons)
router.get('/:id', getLessonById)
router.get('/:id/lesson-topics', getLessonTopicsByLessonId)
router.post('/', postLesson)
router.post('/import-lesson', importLesson)
router.put('/', putLesson)
router.put('/:id/lesson-topics', putLessonTopic)
router.delete('/:id', deleteLesson)
router.delete('/:id/lesson-topics', deleteLessonTopic)

export default router
