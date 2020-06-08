import HttpStatus from 'http-status-codes'
import * as lessonService from '../../services/lessonService'
import * as fileService from '../../services/file/fileService'
import * as lessonTopicsService from '../../services/lessonTopicsService'

export const getLessons = async (req, res) => {
  const lessons = await lessonService.getLessons()
  res.status(HttpStatus.OK).json(lessons)
}

export const getLessonById = async (req, res) => {
  const lesson = await lessonService.getLessonById(req.params.id)
  res.status(HttpStatus.OK).json(lesson)
}

export const getLessonTopicsByLessonId = async (req, res) => {
  if (req.query.topicId) {
    const lesson = await lessonTopicsService.getLessonTopicsByIdAndTopic(req.params.id, req.query.topicId)
    res.status(HttpStatus.OK).json(lesson)
    return
  }

  const lessonTopics = await lessonTopicsService.getLessonTopicsByLessonId(req.params.id)
  res.status(HttpStatus.OK).json(lessonTopics)
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

export const importLesson = async (req, res) => {
  const file = await fileService.uploadFile(req, res)
  const fileTextAndTitle = await fileService.readFile(file)
  fileService.deleteFile(file.path)
  const lessonCreated = await lessonService.importLesson(fileTextAndTitle.text, fileTextAndTitle.title || file.originalname)
  res.status(HttpStatus.CREATED).json(lessonCreated)
}
