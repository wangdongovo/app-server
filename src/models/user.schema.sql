-- 创建用户表
CREATE TABLE `users` (
  `uid` int(11) NOT NULL,  -- 取消自增，触发器赋值，int(11) 可容纳9位数字
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`)  -- 主键强制唯一
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 删除旧触发器（避免冲突）
DROP TRIGGER IF EXISTS trg_generate_unique_uid;

-- 修改语句结束符
DELIMITER //

-- 创建限定 6-9 位数字的触发器
CREATE TRIGGER trg_generate_unique_uid
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  -- 定义6-9位数字的范围常量（增强可读性）
  DECLARE min_uid INT DEFAULT 100000;    -- 6位最小值
  DECLARE max_uid INT DEFAULT 999999999; -- 9位最大值
  
  -- 第一步：生成6-9位的随机基础uid
  SET NEW.uid = FLOOR(min_uid + RAND() * (max_uid - min_uid + 1));
  
  -- 第二步：循环校验，确保uid唯一（如果已存在则自增，直到找到唯一值）
  WHILE EXISTS (SELECT 1 FROM users WHERE uid = NEW.uid) DO
    -- 若uid达到9位最大值，重置为6位最小值（避免超出范围）
    IF NEW.uid >= max_uid THEN
      SET NEW.uid = min_uid;
    ELSE
      SET NEW.uid = NEW.uid + 1;
    END IF;
  END WHILE;
END //

-- 恢复默认结束符
DELIMITER ;