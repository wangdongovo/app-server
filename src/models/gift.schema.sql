-- 礼物表
CREATE TABLE `gifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `description` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 初始礼物数据
INSERT INTO `gifts` (`name`, `price`, `description`) VALUES ('玫瑰', 9.9, '一朵浪漫的玫瑰'), ('红包', 88.8, '一个大红包'), ('跑车', 999.0, '一辆豪华跑车');
