const mongoose = require('mongoose')

const Schema = mongoose.Schema

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    tokens: {
      type: Array
    },
    text: {
      type: String
    },
    hasTopics: {
      type: Boolean
    },
    fragment: {
      type: String,
      required: true
    },
    audioUrl: {
      type: String
    }
  },
  {
    collection: 'lesson',
    timestamps: true
  }
)

module.exports = mongoose.model('Lesson', lessonSchema)
