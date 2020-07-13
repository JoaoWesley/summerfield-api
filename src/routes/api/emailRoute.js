import express from 'express'
import {
  sendPasswordResetEmail,
  sendConfirmationEmail
} from '../../controllers/api/emailController'

const router = express()

router.post('/send-password-reset-email/', sendPasswordResetEmail)
router.post('/send-confirmation-email/', sendConfirmationEmail)

export default router
