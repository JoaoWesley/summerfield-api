import { ObjectId } from 'mongodb'
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const lessonTopicsSchema = new Schema({
  lessonId: {
    type: ObjectId,
    required: true
  },
  topics: {
    type: Array
  }
},
{
  collection: 'lesson-topics',
  timestamps: true
}
)

module.exports = mongoose.model('LessonTopics', lessonTopicsSchema)
