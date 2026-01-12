import Router from 'koa-router'
import commonRouter from './common'
import userRouter from './user'
import postRouter from './post'
import giftRouter from './gift'

const router = new Router()

// Use the routers
router.use(commonRouter.routes())
router.use(userRouter.routes())
router.use(postRouter.routes())
router.use(giftRouter.routes())

export default router
