// utils/errors.js
'use strict';

const { errLogger } = require('./logger');

// 业务错误类
class BusinessError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
  }
}

// 认证错误类
class AuthError extends Error {
  constructor(message = '认证失败') {
    super(message);
    this.name = 'AuthError';
    this.code = 401;
  }
}

// 权限错误类
class PermissionError extends Error {
  constructor(message = '没有权限执行此操作') {
    super(message);
    this.name = 'PermissionError';
    this.code = 403;
  }
}

// 资源不存在错误类
class NotFoundError extends Error {
  constructor(message = '请求的资源不存在') {
    super(message);
    this.name = 'NotFoundError';
    this.code = 404;
  }
}

// 统一的错误处理方法
const handleError = (ctx, error) => {
  // 记录错误日志
  errLogger.error('Operation failed:', error);

  // 根据错误类型返回相应的错误信息
  if (error instanceof BusinessError) {
    ctx.error({ 
      code: error.code,
      message: error.message 
    });
    return;
  }

  if (error instanceof AuthError) {
    ctx.error({ 
      code: 401,
      message: error.message 
    });
    return;
  }

  if (error instanceof PermissionError) {
    ctx.error({ 
      code: 403,
      message: error.message 
    });
    return;
  }

  if (error instanceof NotFoundError) {
    ctx.error({ 
      code: 404,
      message: error.message 
    });
    return;
  }

  // 其他未知错误当作服务器内部错误处理
  ctx.error({ 
    code: 500,
    message: '服务器内部错误，请稍后重试'
  });
};

module.exports = {
  BusinessError,
  AuthError,
  PermissionError,
  NotFoundError,
  handleError
};