// src/middlewares/auth.js
'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/index');

class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.status = status;
  }
}

/**
 * JWT认证中间件
 * @param {Object} options - 配置选项
 * @param {boolean} options.required - 是否必须认证
 * @param {string[]} options.roles - 允许的角色列表
 */
const auth = (options = { required: true, roles: [] }) => {
  return async (ctx, next) => {
    try {
      // 获取token
      const token = getTokenFromHeader(ctx);
      
      if (!token && options.required) {
        throw new AuthError('未提供认证令牌');
      }

      if (token) {
        try {
          // 验证token
          const decoded = jwt.verify(token, config.jwt.secret);
          
          // 将解码后的用户信息存储在ctx.state中
          ctx.state.user = decoded;

          // 检查角色权限
          if (options.roles && options.roles.length > 0) {
            const hasRole = options.roles.some(role => decoded.roles.includes(role));
            if (!hasRole) {
              throw new AuthError('权限不足', 403);
            }
          }

        } catch (error) {
          if (error.name === 'TokenExpiredError') {
            throw new AuthError('令牌已过期');
          }
          throw new AuthError('无效的认证令牌');
        }
      }

      await next();
      
    } catch (error) {
      if (error instanceof AuthError) {
        ctx.status = error.status;
        ctx.body = {
          success: false,
          message: error.message
        };
      } else {
        throw error;
      }
    }
  };
};

/**
 * 从请求头中获取token
 * @param {Object} ctx - Koa上下文
 * @returns {string|null}
 */
const getTokenFromHeader = (ctx) => {
  const authorization = ctx.get('Authorization');
  if (!authorization) return null;
  
  const parts = authorization.split(' ');
  if (parts.length !== 2) return null;
  
  const scheme = parts[0];
  const token = parts[1];
  
  if (!/^Bearer$/i.test(scheme)) return null;
  
  return token;
};

// 生成JWT token的辅助函数
const generateToken = (payload, expiresIn='24h') => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

module.exports = {
  auth,
  generateToken
};