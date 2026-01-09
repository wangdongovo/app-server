-- 创建动态表
CREATE TABLE `posts` (
  `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) COMMENT '动态唯一ID（UUID，默认调用UUID()生成）',
  `user_id` INT NOT NULL COMMENT '关联用户表的uid',
  `content` TEXT COMMENT '动态内容',
  `images` JSON NOT NULL DEFAULT ('[]') COMMENT '图片URL数组，格式：["https://cdn.hero-sms.com/assets/img/service/wb0.webp"]',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键约束
  PRIMARY KEY (`id`),
  -- 外键关联用户表，删除用户时级联删除动态
  FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE CASCADE,
  -- 索引优化：提升按user_id查询的效率
  INDEX idx_posts_user_id (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户动态表（UUID主键，无触发器）';
