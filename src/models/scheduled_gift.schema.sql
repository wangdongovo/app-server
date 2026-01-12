-- 定时礼物下发表
CREATE TABLE `scheduled_gifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `gift_id` int(11) NOT NULL,
  `status` enum('pending', 'sent', 'failed') DEFAULT 'pending',
  `scheduled_time` datetime NOT NULL,
  `sent_time` datetime DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`),
  FOREIGN KEY (`gift_id`) REFERENCES `gifts`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
