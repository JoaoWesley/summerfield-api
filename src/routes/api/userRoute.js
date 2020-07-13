import express from 'express'
import {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser
} from '../../controllers/api/userController'

const router = express()

router.get('/', getAllUsers)
router.get('/:id', getOneUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
