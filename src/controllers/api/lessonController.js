import HttpStatus from 'http-status-codes'
import * as lessonService from '../../services/lessonService'

export const getLessons = async (req, res) => {
  const lessons = await lessonService.getLessons()
  res.json(lessons)
}

export const getLessonById = async (req, res) => {
  const lesson = await lessonService.getLessonById(req.params.id)
  res.json(lesson)
}

export const postLesson = async (req, res) => {
  const lesson = lessonService.buildLessonFromRequestData(req.body)

  const lessonCreated = await lessonService.createLesson(lesson)

  res.status(HttpStatus.CREATED).json(lessonCreated)
}

export const putLesson = async (req, res) => {
  const lesson = lessonService.buildLessonFromRequestData(req.body)

  await lessonService.updateLesson(lesson)

  res.status(HttpStatus.OK).end()
}

export const deleteLesson = async (req, res) => {
  await lessonService.deleteLesson(req.params.id)
  res.status(HttpStatus.OK).end()
}
