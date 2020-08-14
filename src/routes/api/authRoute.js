import express from 'express'
import {
  register,
  login,
  changePassword,
  resetPassword,
  confirmEmail,
  logout
} from '../../controllers/api/authController'

const router = express()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.put('/change-password', changePassword)
router.put('/reset-password', resetPassword)
router.put('/confirm-email', confirmEmail)

export default router
