import jwt from 'jsonwebtoken'
import variables from './../config/envVariablesConfig'
import User from './../models/userModel'
import bcrypt from 'bcryptjs'
import * as userService from '../services/userService'
import constants from '../commons/constants'

export const registerUser = async (email, password, name) => {
  let user = new User({ email, password, name })
  const token = jwt.sign({ id: user._id }, variables.JWT_SECRET, {
    expiresIn: constants.TOKEN_EXPIRATION_TIME
  })
  const payload = { user, token }

  await user.save()

  return payload
}

export const loginUserAndReturnPayloadWithToken = async (user, password) => {
  const isMatch = await user.comparePassword(password)

  if (isMatch) {
    const token = jwt.sign({ id: user._id }, variables.JWT_SECRET, {
      expiresIn: constants.TOKEN_EXPIRATION_TIME
    })

    userService.updateUser(user._id, {
      lastLogin: Date.now(),
      $inc: { loginCount: 1 }
    })

    const payload = { user: user, token }
    return payload
  }
  return null
}

export const changeUserPassword = async (user, newPassword) => {
  user.password = newPassword
  const userChanged = await user.save()
  return userChanged
}

export const resetPassword = async (user, userId, token, password) => {
  const secret = user.password + '-' + user.createdAt
  const payload = jwt.decode(token, secret)
  if (payload.userId === user.id) {
    const salt = await bcrypt.genSalt(10)
    if (!salt) {
      return
    }

    const hash = await bcrypt.hash(password, salt)
    if (!hash) {
      return
    }

    return await userService.updateUser(userId, { password: hash })
  }
}

export const confirmEmail = async (user, userId, token) => {
  const secret = user.password + '-' + user.createdAt
  const payload = jwt.decode(token, secret)
  if (payload.userId === user.id) {
    await userService.updateUser(userId, { emailConfirmed: true })
  }
}
