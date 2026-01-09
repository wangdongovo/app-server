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
  const { email, password } = ctx.request.body as any

  if (!email || !password) {
    ctx.body = Result.error(ResultCode.BAD_REQUEST, 'email and password are required')
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    

    

    await pool.query(
      'INSERT INTO users (email,password) VALUES (?, ?)',
      [email, hashedPassword]
    )

    ctx.body = Result.success({email }, 'User registered successfully')
  } catch (error: any) {
    const code = error.code === 'ER_DUP_ENTRY' ? ResultCode.CONFLICT : ResultCode.INTERNAL_ERROR
    let message = 'Registration failed'
    if (error.code === 'ER_DUP_ENTRY') {
      message = error.message.includes('email') ? 'Email already exists' : 'Email already exists'
    }
    ctx.body = Result.error(code, message, error.message)
  }
}

export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body as any

  if (!email || !password) {
    ctx.body = Result.error(ResultCode.BAD_REQUEST, 'Email and password are required')
    return
  }

  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    const user = rows[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      ctx.body = Result.error(ResultCode.UNAUTHORIZED, 'Invalid email or password')
      return
    }

    const token = signToken({ uid: user.uid, email: user.email })

    ctx.body = Result.success({
      token,
      user: { uid: user.uid, email: user.email }
    }, 'Login successful')
  } catch (error: any) {
    ctx.body = Result.error(ResultCode.INTERNAL_ERROR, 'Login failed', error.message)
  }
}


export const getProfile = async (ctx: Context) => {
  ctx.body = Result.success({ user: ctx.state.user })
}
