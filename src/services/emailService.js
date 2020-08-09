import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import variables from './../config/envVariablesConfig'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: variables.EMAIL_SENDER_LOGIN,
    pass: variables.EMAIL_SENDER_PASSWORD
  }
})

export const getPasswordResetURL = (user, token) => {
  return `${variables.CLIENT_BASE_URL}/?userId=${user._id}&token=${token}`
}

export const getConfirmationEmailURL = (user, token) => {
  return `${variables.CLIENT_BASE_URL}/?userId=${user._id}&token=${token}`
}

export const resetPasswordTemplate = (user, url) => {
  const from = variables.EMAIL_SENDER_LOGIN
  const to = user.email
  const subject = 'Summerfield criar nova senha'
  const html = `
  <p>Olá ${user.name || user.email},</p>
  <p>Vimos que você esqueceu sua senha de acesso. Sentimos muito por isso!</p>
  <p>Mas não se preocupe! Você pode utilizar o link a seguir para criar uma nova senha:</p>
  <a href=${url}>${url}</a>
  <p>Se você não utilizar esse link dentro de 24 horas ele vai se expirar.</p>  
  <p>–Summerfield</p>
  `
  // const html = `
  // <p>Hey ${user.name || user.email},</p>
  // <p>We heard that you lost your Backwoods password. Sorry about that!</p>
  // <p>But don’t worry! You can use the following link to reset your password:</p>
  // <a href=${url}>${url}</a>
  // <p>If you don’t use this link within 1 hour, it will expire.</p>
  // <p>Do something outside today! </p>
  // <p>–Your friends at Backwoods</p>
  // `

  return { from, to, subject, html }
}

export const confirmationTemplate = (user, url) => {
  const from = variables.EMAIL_SENDER_LOGIN
  const to = user.email
  const subject = 'Summerfield confirme seu e-mail'
  const html = `
  <p>Olá ${user.name || user.email},</p>
  <p>Para prosseguir com seu cadastro precisamos confirmar o seu e-mail, para isso clique no link a seguir</p>  
  <a href=${url}>${url}</a>
  <p>Se você não utilizar esse link dentro de 24 horas ele vai se expirar.</p>    
  <p>–Summerfield</p>
  `
  // const html = `
  // <p>Hey ${user.name || user.email},</p>
  // <p>We heard that you lost your Backwoods password. Sorry about that!</p>
  // <p>But don’t worry! You can use the following link to reset your password:</p>
  // <a href=${url}>${url}</a>
  // <p>If you don’t use this link within 1 hour, it will expire.</p>
  // <p>Do something outside today! </p>
  // <p>–Your friends at Backwoods</p>
  // `

  return { from, to, subject, html }
}

// `secret` is passwordHash concatenated with user's createdAt,
// so if someones gets a user token they still need a timestamp to intercept.
export const usePasswordHashToMakeToken = ({
  password: passwordHash,
  _id: userId,
  createdAt
}) => {
  const secret = passwordHash + '-' + createdAt
  const token = jwt.sign({ userId }, secret, {
    expiresIn: '1d' // 1 Day
  })
  return token
}

export const sendResetPasswordEmail = user => {
  const token = usePasswordHashToMakeToken(user)
  const url = getPasswordResetURL(user, token)
  const emailTemplate = resetPasswordTemplate(user, url)

  return new Promise((resolve, reject) => {
    transporter.sendMail(emailTemplate, (err, info) => {
      if (err) {
        reject(err)
      }
      resolve(info)
    })
  })
}

export const sendConfirmationEmail = user => {
  const token = usePasswordHashToMakeToken(user)
  const url = getConfirmationEmailURL(user, token)
  const emailTemplate = confirmationTemplate(user, url)

  return new Promise((resolve, reject) => {
    transporter.sendMail(emailTemplate, (err, info) => {
      if (err) {
        reject(err)
      }
      resolve(info)
    })
  })
}
