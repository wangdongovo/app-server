# [1.0.0] - 2026-01-09

## Added
- 初始化 Koa2 + TypeScript 全栈基础架构。
- 集成 `mysql2` 连接池，支持本地 MySQL 数据库。
- 实现用户系统基础功能：完成 `POST /register`, `POST /login`, `GET /profile` 接口。
- 采用 JWT (JSON Web Token) 进行身份验证。
- 封装统一的 `Result` 返回类，标准化接口状态码及返回格式。
