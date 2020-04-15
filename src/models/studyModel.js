const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const Schema = mongoose.Schema

const ItemsSchema = new Schema({
  user: {
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

module.exports = mongoose.model('Study', ItemsSchema)
