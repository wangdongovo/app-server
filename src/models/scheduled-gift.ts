export type ScheduledGiftStatus = 'pending' | 'sent' | 'failed';

export interface ScheduledGift {
  id: number;
  user_id: number;
  gift_id: number;
  status: ScheduledGiftStatus;
  scheduled_time: Date;
  sent_time?: Date;
  create_time: Date;
  update_time: Date;
}
