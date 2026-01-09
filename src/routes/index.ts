import Router from 'koa-router'
import commonRouter from './common'
import userRouter from './user'

const router = new Router()

// Use the routers
router.use(commonRouter.routes())
router.use(userRouter.routes())

export default router
