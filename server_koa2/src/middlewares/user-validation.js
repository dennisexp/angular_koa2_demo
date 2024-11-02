// middlewares/user-validator.ts
const Joi = require('joi');

// 注册验证schema
const registerSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号是必填项'
    }),
  
  username: Joi.string()
    .min(2)
    .max(20)
    .required()
    .messages({
      'string.min': '用户名至少2个字',
      'string.max': '用户名最多20个字',
      'any.required': '用户名是必填项'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': '密码是必填项'
    }),
});

// 登录验证schema
const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号是必填项'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': '密码是必填项'
    }),

  timestamp: Joi.number()
    .required()
    .messages({
      'any.required': '时间戳是必填项'
    })
});

// 注册验证中间件
async function validateRegister(ctx, next) {
  try {
    await registerSchema.validateAsync(ctx.request.body);
    await next();
  } catch (error) {
    ctx.error({ message: error.message });
  }
}

// 登录验证中间件
async function validateLogin(ctx, next) {
  try {
    await loginSchema.validateAsync(ctx.request.body);
    await next();
  } catch (error) {
    ctx.error({ message: error.message });
  }
}

module.exports = {
  validateRegister,
  validateLogin
};