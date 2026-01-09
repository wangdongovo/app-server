import Router from 'koa-router'
import commonRouter from './common'
import userRouter from './user'
import postRouter from './post'

const router = new Router()

// Use the routers
router.use(commonRouter.routes())
router.use(userRouter.routes())
router.use(postRouter.routes())

export default router
