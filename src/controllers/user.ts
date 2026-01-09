import { Context } from 'koa'
import bcrypt from 'bcryptjs'
import pool from '../config/db'
import { signToken } from '../utils/jwt'

// Helper to generate a random 10-digit numeric UID
const generateUID = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000)
}

export const register = async (ctx: Context) => {
  const { username, password } = ctx.request.body as any

  if (!username || !password) {
    ctx.status = 400
    ctx.body = { message: 'Username and password are required' }
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const uid = generateUID()

    await pool.query(
      'INSERT INTO users (uid, username, password) VALUES (?, ?, ?)',
      [uid, username, hashedPassword]
    )

    ctx.body = {
      status: 'success',
      message: 'User registered successfully',
      data: { uid, username }
    }
  } catch (error: any) {
    ctx.status = error.code === 'ER_DUP_ENTRY' ? 409 : 500
    ctx.body = {
      message: error.code === 'ER_DUP_ENTRY' ? 'Username already exists' : 'Registration failed',
      error: error.message
    }
  }
}

export const login = async (ctx: Context) => {
  const { username, password } = ctx.request.body as any

  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    const user = rows[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      ctx.status = 401
      ctx.body = { message: 'Invalid username or password' }
      return
    }

    const token = signToken({ uid: user.uid, username: user.username })

    ctx.body = {
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: { uid: user.uid, username: user.username }
      }
    }
  } catch (error: any) {
    ctx.status = 500
    ctx.body = { message: 'Login failed', error: error.message }
  }
}

export const getProfile = async (ctx: Context) => {
  ctx.body = {
    status: 'success',
    data: { user: ctx.state.user }
  }
}
