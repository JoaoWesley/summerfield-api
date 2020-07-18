const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const Schema = mongoose.Schema

const PopularTranslationSchema = new Schema(
  {
    wordPhrase: {
      type: String,
      required: true
    },
    translation: {
      type: String,
      required: true
    },
    context: {
      type: Object,
      required: true
    }
  },
  {
    collection: 'popular-translation',
    timestamps: true
  }
)

module.exports = mongoose.model('PopularTranslation', PopularTranslationSchema)
