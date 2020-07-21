import jwt from 'jsonwebtoken'
import variables from '../config/envVariablesConfig'
import HttpStatus from 'http-status-codes'

export const auth = (req, res, next) => {
  let token = null
  token = req.cookies.token

  if (!token) {
    token = req.headers.authorization
  }

  if (!token) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'No authorization provided' })
  }
  try {
    jwt.verify(token, variables.JWT_SECRET)
    res.userOnRequest = jwt.decode(token, variables.JWT_SECRET)
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default auth
