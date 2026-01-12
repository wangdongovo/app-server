import cron from 'node-cron';
import pool from '../config/db';

export const initScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    console.log('[Scheduler] Checking for scheduled gifts...');
    const now = new Date();
    
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM scheduled_gifts WHERE status = "pending" AND scheduled_time <= ?',
        [now]
      );

      for (const gift of rows) {
        console.log(`[Scheduler] Delivering gift ${gift.gift_id} to user ${gift.user_id}`);
        
        // Here you would implement actual delivery logic (e.g., updating user balance, sending notification, etc.)
        // For now, we just update the status to 'sent'
        
        try {
          await pool.query(
            'UPDATE scheduled_gifts SET status = "sent", sent_time = ? WHERE id = ?',
            [new Date(), gift.id]
          );
          console.log(`[Scheduler] Gift ${gift.id} delivered successfully.`);
        } catch (err) {
          console.error(`[Scheduler] Failed to deliver gift ${gift.id}:`, err);
          await pool.query(
            'UPDATE scheduled_gifts SET status = "failed" WHERE id = ?',
            [gift.id]
          );
        }
      }
    } catch (error) {
      console.error('[Scheduler] Error querying scheduled gifts:', error);
    }
  });
};
