//controllers/userCtrl.js
'use strict';
const UserService = require('../services/userService');
const {logger, appLogger, errLogger} = require('../utils/logger');

class userCtrl {

  /**
   * 用户注册
   * @param {Object} ctx Koa上下文
   */
  async register(ctx) {
    try {
      // 获取请求体数据
      const { phone, username, password } = ctx.request.body;

      // 调用service层处理注册逻辑
      const result = await UserService.register(phone, username, password);

      // 返回成功响应
      ctx.success({
        message: '注册成功',
        data: result
      });

    } catch (error) {
      // 错误处理
      if (error.message === '手机号已被注册') {
        ctx.error({message: error.message});
        return;
      }

      // 记录错误日志
      errLogger.error('注册错误:', error);

      // 其他未预期的错误
      ctx.error({message: '服务器内部错误'});
      
    }
  }

  /**
   * 
// 密码验证（登录时使用）
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
   */

  async login(ctx) {
    const { phone, password, timestamp } = ctx.request.body;
    try {
      // 1. 验证时间戳，防止重放攻击
      const currentTime = new Date().getTime();
      const delay = currentTime - (parseInt(timestamp) || 0);
      if (delay > 300000) { // 5分钟有效期
        ctx.error({ message: '请求已过期' });
        return;
      }

      // 验证请求数据
      if (!phone || !password) {
        ctx.error({ message: '请提供手机号和密码' });
        return
      }

      // 调用服务层处理登录
      const result = await UserService.login(phone, password);

      // 设置响应
      ctx.success({ data: result });

    } catch (error) {
      errLogger.error(error);
      ctx.error({ message: error.message });
    }
  };

  async getProfile(ctx){
    appLogger.info('---hello world----');

    // 从ctx.state获取用户信息（由auth中间件解析token后设置）
    const { uid } = ctx.state.user;
    try {
      const result = await UserService.findOne(uid);
      // 处理用户信息逻辑
      ctx.success({data:result});
    } catch (error) {
      ctx.error({ message: error.message });
    }
  }
}

module.exports = new userCtrl();