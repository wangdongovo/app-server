import Router from 'koa-router'
import { register, login, getProfile } from '../controllers/user'
import { authMiddleware } from '../middleware/auth'

const router = new Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authMiddleware, getProfile)

export default router
