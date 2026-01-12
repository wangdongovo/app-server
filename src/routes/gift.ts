import Router from 'koa-router';
import { listGifts, scheduleGift, listScheduledGifts } from '../controllers/gift';

const router = new Router({
  prefix: '/gift'
});

router.get('/list', listGifts);
router.post('/schedule', scheduleGift);
router.get('/scheduled/list', listScheduledGifts);

export default router;
