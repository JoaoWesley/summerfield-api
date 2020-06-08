
import LessonModel from '../models/lessonModel'
import LessonTopicsModel from '../models/lessonTopics'
import { ObjectId } from 'mongodb'
import * as tokenService from '../services/tokenService'

export const buildLessonFromRequestData = (requestData) => {
  const lesson = {}

  if (requestData._id) {
    lesson._id = requestData._id
  }

  if (requestData.title) {
    lesson.title = requestData.title
  }

  if (requestData.text) {
    lesson.text = requestData.text
  }

  return lesson
}

export const getLessons = async () => {
  const lessons = await LessonModel.find().exec()
  return lessons
}

export const getLessonById = async (lessonId) => {
  const lesson = await LessonModel.findById(ObjectId(lessonId)).exec()

  lesson.tokens = await tokenService.mapTokenStatus(lesson.tokens)

  return lesson
}

export const createLesson = async (lesson) => {
  lesson.tokens = tokenService.tokenizeText(lesson.text)

  const lessonCreated = await LessonModel.create(lesson)
  return lessonCreated
}

export const updateLesson = async (lesson) => {
  lesson.tokens = tokenService.tokenizeText(lesson.text)

  await LessonModel.findOneAndUpdate(
    { _id: lesson._id },
    {
      $set: lesson
    }
  )
}

export const deleteLesson = async (id) => {
  await LessonModel.deleteOne(
    { _id: id }
  )
}

export const importLesson = async (lessonText, title) => {
  const lesson = {
    title,
    text: 'Qulaquer coisa', // Posso armazenar o texto original dentro da lição
    hasTopics: true
  }
  const lessonCreated = await LessonModel.create(lesson)
  const lessonTokens = tokenService.tokenizeText(lessonText)
  const lessonTopics = []
  let index = 0

  while (lessonTokens.length > 0) {
    lessonTopics.push({
      index,
      tokens: lessonTokens.splice(0, 1000),
      title: `Parte ${index + 1}`
    })
    index++
  }

  while (lessonTopics.length > 0) {
    await LessonTopicsModel.create({ lessonId: ObjectId(lessonCreated._id), topics: lessonTopics.splice(0, 100) })
  }
  return lessonCreated
}
