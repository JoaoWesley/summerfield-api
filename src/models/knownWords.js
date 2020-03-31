const mongoose = require('mongoose')

const Schema = mongoose.Schema

const knownWordsSchema = new Schema({
  words: {
    type: Array,
    required: true
  }
},
{
  collection: 'known-words',
  timestamps: true
}
)

module.exports = mongoose.model('KnownWords', knownWordsSchema)
