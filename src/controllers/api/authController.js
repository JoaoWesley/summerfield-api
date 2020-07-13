import * as authService from './../../services/authService'
import * as userService from './../../services/userService'
import HttpStatus from 'http-status-codes'

export const register = async (req, res) => {
  const { email, password } = req.body
  try {
    const existingUser = await userService.getUserByEmail(email)
    if (existingUser) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Email already exists' })
    }

    const payload = await authService.registerUser(email, password)
    res.status(HttpStatus.CREATED).json(payload)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'registration failed',
      message: error.message
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // TO DO -> Return user first then update login  number
    const user = await authService.returnUserIfExistsAndUpdate(email)

    if (!user.emailConfirmed) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'E-mail not confirmed' })
    }

    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User does not exist' })
    }

    const userLoggedInPayload = await authService.loginUserAndReturnPayloadWithToken(
      user,
      password
    )
    if (userLoggedInPayload) {
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
