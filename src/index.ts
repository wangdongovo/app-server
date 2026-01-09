import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import dotenv from 'dotenv'
import pool from './config/db'
import { register, login, getProfile } from './controllers/user'
import { authMiddleware } from './middleware/auth'

dotenv.config()

const app = new Koa()
const router = new Router()

app.use(bodyParser())

router.get('/', async ctx => {
  ctx.body = {
    message: 'Hello, Koa with TypeScript!',
    status: 'success',
  }
})

router.get('/health', async ctx => {
  ctx.body = { status: 'ok' }
})

router.get('/db-check', async ctx => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result')
    ctx.body = {
      status: 'success',
      message: 'Database connected successfully',
      data: rows,
    }
  } catch (error: any) {
    ctx.status = 500
    ctx.body = {
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    }
  }
})

// Auth routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/profile', authMiddleware, getProfile)

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
