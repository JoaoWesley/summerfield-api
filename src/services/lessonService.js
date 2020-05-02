
import LessonModel from '../models/lessonModel'
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
