import * as userService from '../../services/userService'
import HttpStatus from 'http-status-codes'

export const getAllUsers = async (req, res) => {
  const users = await userService.getUsers()
  res.status(HttpStatus.OK).json(users)
}

export const getOneUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id)
  res.status(HttpStatus.OK).json(user)
}

export const updateUser = async (req, res) => {
  const id = req.params.id
  const update = req.body

  if (Object.keys(update).length === 0) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'no changes provided' })
  }
  if (update.email) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Email change not allowed' })
  }
  if (update.password) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Password cannot be changed from this endpoint' })
  }
  try {
    const oldUser = await userService.updateUser(id, update)
    if (!oldUser) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' })
    }
    const newUser = await userService.getUserById(oldUser.id)
    res.status(HttpStatus.OK).json(newUser)
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error updating user' })
  }
}

export const deleteUser = async (req, res) => {
  const user = await userService.deleteUser(req.params.id)

  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' })
  }
  res.status(HttpStatus.ACCEPTED).json({
    user,
    message: 'User was deleted'
  })
}
