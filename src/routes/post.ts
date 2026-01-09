import Router from 'koa-router'
import { PostController } from '../controllers/post'
import { authMiddleware } from '../middleware/auth'

const router = new Router({
  prefix: '/posts'
})

// 发布动态
router.post('/', authMiddleware, PostController.createPost)

// 获取动态列表
router.get('/', PostController.getPostList)

// 获取动态详情
router.get('/:id', PostController.getPostDetail)

// 删除动态
router.delete('/:id', authMiddleware, PostController.deletePost)

export default router
