import { Context } from 'koa'
import pool from '../config/db'
import { Result, ResultCode } from '../utils/result'

export class PostController {
  /**
   * 发布动态
   */
  static async createPost(ctx: Context) {
    const { content, images } = ctx.request.body as { content?: string; images?: string[] }
    const user = ctx.state.user

    if (!content && (!images || images.length === 0)) {
      ctx.body = Result.error(ResultCode.BAD_REQUEST, '内容或图片不能为空')
      return
    }

    try {
      const [result] = await pool.execute(
        'INSERT INTO posts (user_id, content, images) VALUES (?, ?, ?)',
        [user.uid, content || null, JSON.stringify(images || [])]
      ) 
      ctx.body = Result.success({  }, '发布成功')
    } catch (error) {
      console.error('Create post error:', error)
      ctx.body = Result.error(ResultCode.INTERNAL_ERROR, '发布失败')
    }
  }

  /**
   * 获取动态列表（信息流）
   */
  static async getPostList(ctx: Context) {
    const { page = 1, pageSize = 10, userId } = ctx.query
    const offset = (Number(page) - 1) * Number(pageSize)
    
    let sql = `SELECT p.*, u.username, u.avatar 
               FROM posts p 
               LEFT JOIN users u ON p.user_id = u.uid `
    const params: string[] = []

    if (userId) {
      sql += ` WHERE p.user_id = ? `
      params.push(String(userId))
    }

    sql += ` ORDER BY p.create_time DESC LIMIT ? OFFSET ?`
    params.push(String(pageSize), String(offset))

    try {
      const [rows] = await pool.execute(sql, params)
      ctx.body = Result.success(rows, '获取成功')
    } catch (error) {
      console.error('Get post list error:', error)
      ctx.body = Result.error(ResultCode.INTERNAL_ERROR, '获取失败')
    }
  }

  /**
   * 获取动态详情
   */
  static async getPostDetail(ctx: Context) {
    const { id } = ctx.params

    try {
      const [rows] = await pool.execute(
        `SELECT p.*, u.username, u.avatar 
         FROM posts p 
         LEFT JOIN users u ON p.user_id = u.uid 
         WHERE p.id = ?`,
        [id]
      )
      
      const post = (rows as any[])[0]
      if (!post) {
        ctx.body = Result.error(ResultCode.NOT_FOUND, '动态不存在')
        return
      }

      ctx.body = Result.success(post, '获取成功')
    } catch (error) {
      console.error('Get post detail error:', error)
      ctx.body = Result.error(ResultCode.INTERNAL_ERROR, '获取失败')
    }
  }

  /**
   * 删除动态
   */
  static async deletePost(ctx: Context) {
    const { id } = ctx.params
    const user = ctx.state.user

    try {
      // 先查询动态是否存在以及是否为本人发布
      const [rows] = await pool.execute('SELECT user_id FROM posts WHERE id = ?', [id])
      const post = (rows as any[])[0]

      if (!post) {
        ctx.body = Result.error(ResultCode.NOT_FOUND, '动态不存在')
        return
      }

      if (post.user_id !== user.uid) {
        ctx.body = Result.error(ResultCode.FORBIDDEN, '无权删除他人动态')
        return
      }

      await pool.execute('DELETE FROM posts WHERE id = ?', [id])
      ctx.body = Result.success(null, '删除成功')
    } catch (error) {
      console.error('Delete post error:', error)
      ctx.body = Result.error(ResultCode.INTERNAL_ERROR, '删除失败')
    }
  }
}
