import LessonTopicsModel from '../models/lessonTopics'
import { ObjectId } from 'mongodb'
import * as tokenService from './tokenService'

export const getLessonTopicsByLessonId = async (lessonId) => {
  const lessonTopics = await LessonTopicsModel.find({ lessonId: ObjectId(lessonId) }, { 'topics.title': 1, 'topics.index': 1 }).exec()

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
    { $match: { 'topics.index': +topicIndex } }]
  )

  const lessonTopics = response.pop()
  lessonTopics.topics.tokens = await tokenService.mapTokenStatus(lessonTopics.topics.tokens)
  return lessonTopics
}
