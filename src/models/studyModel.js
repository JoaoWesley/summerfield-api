const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const Schema = mongoose.Schema

const StudySchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  {
    collection: 'study',
    timestamps: true
  }
)

module.exports = mongoose.model('Study', StudySchema)
