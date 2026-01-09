import { Context, Next } from 'koa'
import { verifyToken } from '../utils/jwt'

export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    ctx.status = 401
    ctx.body = { message: 'Authentication token is missing' }
    return
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    ctx.status = 401
    ctx.body = { message: 'Invalid or expired token' }
    return
  }

  ctx.state.user = decoded
  await next()
}
