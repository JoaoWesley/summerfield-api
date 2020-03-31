const mongoose = require('mongoose')

const Schema = mongoose.Schema

const lessonSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  words: {
    type: Array,
    required: true
  },
  text: {
    type: String,
    required: true
  }
},
{
  collection: 'lesson',
  timestamps: true
}
)

module.exports = mongoose.model('Lesson', lessonSchema)
