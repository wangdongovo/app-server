import { Context } from 'koa'
import bcrypt from 'bcryptjs'
import pool from '../config/db'
import { signToken } from '../utils/jwt'
import { Result, ResultCode } from '../utils/result'

// Helper to generate a random 10-digit numeric UID
const generateUID = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000)
}

export const register = async (ctx: Context) => {
  const { username, password } = ctx.request.body as any

  if (!username || !password) {
    ctx.body = Result.error(ResultCode.BAD_REQUEST, 'Username and password are required')
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const uid = generateUID()

    await pool.query(
      'INSERT INTO users (uid, username, password) VALUES (?, ?, ?)',
      [uid, username, hashedPassword]
    )

    ctx.body = Result.success({ uid, username }, 'User registered successfully')
  } catch (error: any) {
    const code = error.code === 'ER_DUP_ENTRY' ? ResultCode.CONFLICT : ResultCode.INTERNAL_ERROR
    const message = error.code === 'ER_DUP_ENTRY' ? 'Username already exists' : 'Registration failed'
    ctx.body = Result.error(code, message, error.message)
  }
}

export const login = async (ctx: Context) => {
  const { username, password } = ctx.request.body as any

  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    const user = rows[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      ctx.body = Result.error(ResultCode.UNAUTHORIZED, 'Invalid username or password')
      return
    }

    const token = signToken({ uid: user.uid, username: user.username })

    ctx.body = Result.success({
      token,
      user: { uid: user.uid, username: user.username }
    }, 'Login successful')
  } catch (error: any) {
    ctx.body = Result.error(ResultCode.INTERNAL_ERROR, 'Login failed', error.message)
  }
}

export const getProfile = async (ctx: Context) => {
  ctx.body = Result.success({ user: ctx.state.user })
}
