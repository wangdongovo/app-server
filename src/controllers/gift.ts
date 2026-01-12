import { Context } from 'koa';
import pool from '../config/db';
import { Result, ResultCode } from '../utils/result';

export const listGifts = async (ctx: Context) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM gifts');
    ctx.body = Result.success(rows);
  } catch (error: any) {
    ctx.body = Result.error(ResultCode.INTERNAL_ERROR, 'Failed to list gifts', error.message);
  }
};

export const scheduleGift = async (ctx: Context) => {
  const { giftId, userId, scheduledTime } = ctx.request.body as any;

  if (!giftId || !userId || !scheduledTime) {
    ctx.body = Result.error(ResultCode.BAD_REQUEST, 'giftId, userId, and scheduledTime are required');
    return;
  }

  try {
    // Check if gift exists
    const [gifts]: any = await pool.query('SELECT * FROM gifts WHERE id = ?', [giftId]);
    if (gifts.length === 0) {
      ctx.body = Result.error(ResultCode.NOT_FOUND, 'Gift not found');
      return;
    }

    // Check if user exists
    const [users]: any = await pool.query('SELECT * FROM users WHERE uid = ?', [userId]);
    if (users.length === 0) {
      ctx.body = Result.error(ResultCode.NOT_FOUND, 'User not found');
      return;
    }

    await pool.query(
      'INSERT INTO scheduled_gifts (user_id, gift_id, scheduled_time) VALUES (?, ?, ?)',
      [userId, giftId, new Date(scheduledTime)]
    );

    ctx.body = Result.success(null, 'Gift scheduled successfully');
  } catch (error: any) {
    ctx.body = Result.error(ResultCode.INTERNAL_ERROR, 'Failed to schedule gift', error.message);
  }
};

export const listScheduledGifts = async (ctx: Context) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT sg.*, g.name as gift_name, u.email as user_email FROM scheduled_gifts sg JOIN gifts g ON sg.gift_id = g.id JOIN users u ON sg.user_id = u.uid'
    );
    ctx.body = Result.success(rows);
  } catch (error: any) {
    ctx.body = Result.error(ResultCode.INTERNAL_ERROR, 'Failed to list scheduled gifts', error.message);
  }
};
