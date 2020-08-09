import * as authService from './../../services/authService'
import * as userService from './../../services/userService'
import HttpStatus from 'http-status-codes'
import responseCodeTypes from '../../commons/types/responseCodeTypes'
import emailValidator from 'email-validator'
import constants from '../../commons/constants'
import responseCodeTypes from '../../commons/types/responseCodeTypes'
import envVariablesConfig from '../../config/envVariablesConfig'

export const register = async (req, res) => {
  const { email, password, name } = req.body
  if (!emailValidator.validate(email)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'E-mail invalid'
    })
  }

  try {
    const existingUser = await userService.getUserByEmail(email)
    if (existingUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Email already exists',
        code: responseCodeTypes.EMAIL_ALREADY_EXISTS
      })
    }

    const payload = await authService.registerUser(email, password, name)
    res.cookie('token', payload.token, {
      maxAge: constants.TOKEN_EXPIRATION_TIME_COOKIE,
      expires: new Date(Date.now() + constants.TOKEN_EXPIRATION_TIME_COOKIE),
      secure: true,
      domain: envVariablesConfig.DOMAIN
    })
    res.status(HttpStatus.CREATED).json(payload)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'Registration failed',
      message: error.message
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await userService.getUserByEmail(email)

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User does not exist',
        code: responseCodeTypes.EMAIL_NOT_FOUND
      })
    }

    const userLoggedInPayload = await authService.loginUserAndReturnPayloadWithToken(
      user,
      password
    )
    if (userLoggedInPayload) {
      res.cookie('token', userLoggedInPayload.token, {
        maxAge: constants.TOKEN_EXPIRATION_TIME_COOKIE,
        expires: new Date(Date.now() + constants.TOKEN_EXPIRATION_TIME_COOKIE),
        secure: true,
        domain: envVariablesConfig.DOMAIN
      })
      return res.status(HttpStatus.OK).json(userLoggedInPayload)
    }

    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Invalid credentials' })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body

  try {
    const oldUser = await userService.getUserByEmail(email)
    if (!oldUser) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User does not exist' })
    }
    // check if old password is valid
    const isMatch = await oldUser.comparePassword(oldPassword)

    if (isMatch) {
      const newUser = await authService.changeUserPassword(oldUser, newPassword)
      res.status(HttpStatus.OK).json(newUser)
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Invalid old password' })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'change password failed',
      message: error.message
    })
  }
}

export const resetPassword = async (req, res) => {
  const { userId, token, password } = req.body

  try {
    const user = await userService.getUserById(userId)
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No user found' })
    }
    await authService.resetPassword(user, userId, token, password)
    res.status(HttpStatus.OK).json({ message: 'Password changed accepted' })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const confirmEmail = async (req, res) => {
  const { userId, token } = req.body

  try {
    const user = await userService.getUserById(userId)
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No user found' })
    }
    await authService.confirmEmail(user, userId, token)
    res.status(HttpStatus.OK).json({ message: 'E-mail confirmed' })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}
