import * as emailService from '../../services/emailService'
import * as userService from '../../services/userService'
import HttpStatus from 'http-status-codes'

export const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body

  let user = await userService.getUserByEmail(email)
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: 'No user with that email' })
  }

  emailService
    .sendResetPasswordEmail(user)
    .then(info => {
      console.log(`** Email sent **`, info.response)
      res.end()
    })
    .catch(error => {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error sending email' })
    })
}

export const sendConfirmationEmail = async (req, res) => {
  const { email } = req.body

  let user = await userService.getUserByEmail(email)
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: 'No user with that email' })
  }

  emailService
    .sendConfirmationEmail(user)
    .then(info => {
      console.log(`** Email sent **`, info.response)
      res.end()
    })
    .cacth(error => {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error sending email' })
    })
}
