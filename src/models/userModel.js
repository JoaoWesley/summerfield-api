import bcrypt from 'bcryptjs'
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const SALT_WORK_FACTOR = 10

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    lastLogin: {
      default: Date.now(),
      required: true,
      type: Date
    },
    loginCount: {
      default: 0,
      type: Number
    },
    token: {
      type: String,
      required: false
    },
    emailConfirmed: {
      type: Boolean,
      required: true
    }
  },
  {
    collection: 'user',
    timestamps: true
  }
)

UserSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
