import LessonTopicsModel from '../models/lessonTopics'
import { ObjectId } from 'mongodb'
import * as tokenService from './tokenService'

export const getLessonTopicsByLessonId = async lessonId => {
  const lessonTopics = await LessonTopicsModel.find(
    { lessonId: ObjectId(lessonId) },
    { 'topics.title': 1, 'topics.index': 1, 'topics.text': 1 }
  ).exec()

  let topics = []
  while (lessonTopics.length > 0) {
    topics = topics.concat(lessonTopics.shift().topics)
  }

  return topics
}

export const getLessonTopicsByIdAndTopic = async (lessonId, topicIndex) => {
  const response = await LessonTopicsModel.aggregate([
    { $match: { lessonId: ObjectId(lessonId) } },
    { $unwind: '$topics' },
    { $match: { 'topics.index': +topicIndex } }
  ])

  const lessonTopics = response.pop()
  lessonTopics.topics.tokens = await tokenService.mapTokenStatus(
    lessonTopics.topics.tokens
  )
  return lessonTopics
}

export const deleteLessonTopic = async (lessonId, lessonTopicIndex) => {
  await LessonTopicsModel.findOneAndUpdate(
    { lessonId: ObjectId(lessonId) },
    { $pull: { topics: { index: +lessonTopicIndex } } },
    { multi: true }
  )
}

export const updateLessonTopic = async (lessonId, lessonTopic) => {
  lessonTopic.tokens = tokenService.tokenizeText(lessonTopic.text)

  await LessonTopicsModel.findOneAndUpdate(
    { lessonId: ObjectId(lessonId), 'topics.index': lessonTopic.index },
    {
      $set: {
        'topics.$.title': lessonTopic.title,
        'topics.$.tokens': lessonTopic.tokens,
        'topics.$.text': lessonTopic.text
      }
    }
  )
}
