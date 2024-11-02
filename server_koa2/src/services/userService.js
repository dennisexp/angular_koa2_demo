'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models/user');//--
const config = require('../config/index');

// const { decryptPassword, encryptPassword } = ('../utils/crypto');
const { generateToken } = require('../middlewares/auth');
const cryptoUtil = require('../utils/crypto.util');

const {logger, appLogger, errLogger} = require('../utils/logger');


class UserService {
  constructor() { }

  // 根据手机号查找用户
  static async findUserByPhone(phone) {
    return await User.findOne({ phone }).select('+password');  // 需要查出密码字段
  }

  /**
   * 处理用户注册并生成token
   * @param {string} phone 手机号
   * @param {string} username 用户名
   * @param {string} encryptedPassword 加密后的密码
   * @returns {Object} 用户信息和token
   */
  async register(phone, username, encryptedPassword) {
    // 检查手机号是否已存在
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new Error('手机号已被注册');
    }

    // 解密密码
    const { hashedPassword } = await cryptoUtil.decryptPassword(encryptedPassword);
    
    // 创建新用户
    const user = new User({
      phone,
      username,
      password: hashedPassword
    });
    await user.save();

    logger.info('User registration: ' + user);

    // 生成token
    const token = generateToken({
      uid: user.uid,
      username: user.username,
      phone: user.phone,
    });

    // 返回用户信息（不包含密码）和token
    return {
      token,
      userInfo: {
        uid: user.uid,
        phone: user.phone,
        username: user.username,
        role: user.role
      }
    };

  }

  /**
   * 处理用户登录
   * @param {string} phone 手机号
   * @param {string} encryptedPassword 加密后的密码
   * @returns {Object} 用户信息和token
   */
  async login(phone, encryptedPassword) {
    // 查找用户并包含密码字段
    const user = await User.findOne({ phone }).select('+password');
    if (!user) {
      throw new Error('账号不存在');
    }

    //TODO: 用户是否被封禁了，role=locked
    if(!user.role || user.role.toLowerCase()=='locked') {
      throw new Error('该账号已被封禁');
    }

    // 2. 解密客户端加密的密码
    const { hashedPassword } = await cryptoUtil.decryptPassword(encryptedPassword);

    // 验证密码
    const isMatch = await user.matchPassword(hashedPassword);
    if (!isMatch) {
      throw new Error('密码错误');
    }

    // 生成 JWT token
    const token = generateToken({
        uid: user.uid,
        username: user.username,
        phone: user.phone,
    });

    // 返回用户信息和token
    return {
      userInfo: {
        uid: user.uid,
        role: user.role,
        username: user.username,
        phone: user.phone,
      },
      token
    };
  }

  async findOne(uid){
    const user = await User.findOne({ uid });
    // const user = { uid: '123456', username: 'mjnkcc86', phone: '18812345678', role: 'user', created_at: new Date}
    if (!user) {
      throw new Error('账号不存在');
    }

    return {
      user: {
        uid: user.uid,
        role: user.role,
        username: user.username,
        phone: user.phone,
        created_at: user.created_at
      }
    };
  }
}

module.exports = new UserService();