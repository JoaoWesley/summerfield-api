import jwt from 'jsonwebtoken'
import variables from './../config/envVariablesConfig'
import HttpStatus from 'http-status-codes'

export const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(HttpStatus.BAD_REQUEST).josn({ message: 'Bad Request' })
  }
  let token = req.headers.authorization
  token = token.replace('Bearer ', '')

  jwt.verify(token, variables.JWT_SECRET, err => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    next()
  })
}

export default auth
