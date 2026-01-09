import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

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

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
