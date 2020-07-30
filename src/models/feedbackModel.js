const mongoose = require('mongoose')

const Schema = mongoose.Schema

const feedbackSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  {
    collection: 'feedback',
    timestamps: true
  }
)

module.exports = mongoose.model('Feedback', feedbackSchema)
