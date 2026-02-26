const jwt = require('jsonwebtoken')

const TOKEN_NAME = 'tanzania_admin_token'

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev-secret'
  return jwt.sign(payload, secret, { expiresIn: '8h' })
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'dev-secret'
  return jwt.verify(token, secret)
}

function getTokenFromReq(req) {
  const cookie = req.headers.cookie || ''
  const match = cookie.split(';').map(s => s.trim()).find(s => s.startsWith(TOKEN_NAME + '='))
  if (!match) return null
  return match.split('=')[1]
}

module.exports = { signToken, verifyToken, getTokenFromReq, TOKEN_NAME }
