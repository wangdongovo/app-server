import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import dotenv from 'dotenv'
import router from './routes'

dotenv.config()

const app = new Koa()

app.use(bodyParser())

// Register the centralized router
app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
