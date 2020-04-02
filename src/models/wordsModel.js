const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema

const WordsSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  words: {
    type: Array,
    required: true
  }
},
{
  collection: 'words',
  timestamps: true
}
)

module.exports = mongoose.model('Words', WordsSchema)
