import Router from 'koa-router'
import pool from '../config/db'

const router = new Router()

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

export default router
