/**
 * 业务状态码枚举
 */
export enum ResultCode {
  SUCCESS = 200,          // 成功
  BAD_REQUEST = 400,      // 参数错误
  UNAUTHORIZED = 401,     // 未授权（未登录）
  FORBIDDEN = 403,        // 禁止访问（权限不足）
  NOT_FOUND = 404,        // 资源未找到
  CONFLICT = 409,         // 资源冲突（如用户名已存在）
  INTERNAL_ERROR = 500,   // 服务器内部错误
}

/**
 * 状态码含义映射
 */
export const ResultMessage: Record<ResultCode, string> = {
  [ResultCode.SUCCESS]: '请求成功',
  [ResultCode.BAD_REQUEST]: '请求参数有误',
  [ResultCode.UNAUTHORIZED]: '身份验证失败',
  [ResultCode.FORBIDDEN]: '权限不足',
  [ResultCode.NOT_FOUND]: '请求的资源不存在',
  [ResultCode.CONFLICT]: '资源冲突',
  [ResultCode.INTERNAL_ERROR]: '服务器内部错误',
}

/**
 * 统一返回结果类
 */
export class Result<T = any> {
  code: ResultCode
  message: string
  data: T | null

  constructor(code: ResultCode, message?: string, data: T | null = null) {
    this.code = code
    this.message = message || ResultMessage[code] || 'Unknown status'
    this.data = data
  }

  static success<T>(data: T | null = null, message?: string) {
    return new Result(ResultCode.SUCCESS, message, data)
  }

  static error(code: ResultCode = ResultCode.INTERNAL_ERROR, message?: string, data: any = null) {
    return new Result(code, message, data)
  }
}
