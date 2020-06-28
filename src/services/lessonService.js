
import LessonModel from '../models/lessonModel'
import LessonTopicsModel from '../models/lessonTopics'
import { ObjectId } from 'mongodb'
import * as tokenService from '../services/tokenService'
import tokenSpacerType from '../commons/tokenSpacerType'
import regexType from '../commons/regexType'

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

  lesson.fragment = requestData.text.substr(0, 27)

  return lesson
}

export const getLessons = async () => {
  const lessons = await LessonModel.find({}, {
    _id: 1,
    title: 1,
    hasTopics: 1,
    fragment: 1
  }).exec()
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
    hasTopics: true,
    fragment: lessonText.replace(regexType.DOUBLE_LINE_BREAK_TAG, tokenSpacerType.DOUBLE_LINE_BREAK).substr(0, 27)
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
    lessonTopics[index].text = tokenService.createTextFromTokens(lessonTopics[index].tokens)
    index++
  }

  while (lessonTopics.length > 0) {
    await LessonTopicsModel.create({ lessonId: ObjectId(lessonCreated._id), topics: lessonTopics.splice(0, 100) })
  }
  return lessonCreated
}
