// src/utils/crypto.util.js
'use strict';

const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const config = require('../config/index');
const { logger, appLogger, errLogger } =  require('../utils/logger')

class CryptoUtil {
  /**
   * 生成密码盐值
   * @param {number} rounds - 加密轮数，默认为10
   * @returns {Promise<string>} 生成的salt
   */
  static async generateSalt(rounds = 10) {
    try {
      return await bcrypt.genSalt(rounds);
    } catch (error) {
      console.error('Salt generation failed:', error);
      throw new Error('生成salt失败');
    }
  }

  /**
   * 使用salt加密密码
   * @param {string} password - 原始密码
   * @param {number} rounds - 加密轮数，默认为10
   * @returns {Promise<string>} 加密后的密码
   */
  static async hashPassword(password, rounds = 10) {
    try {
      const salt = await this.generateSalt(rounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Password hashing failed:', error);
      throw new Error('密码加密失败');
    }
  }


  // 密码二次加密（用于存储到数据库）
  static async encryptPassword(password) {
    return crypto
      .createHmac('sha256', config.passwordSecret)
      .update(password)
      .digest('hex');
  }

  /**
   * 验证密码
   * @param {string} plainPassword - 原始密码
   * @param {string} hashedPassword - 加密后的密码
   * @returns {Promise<boolean>} 验证结果
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Password verification failed:', error);
      throw new Error('密码验证失败');
    }
  }

  /**
   * 解密客户端加密的密码数据
   * @param {string} encryptedData - 客户端AES加密的数据
   * @returns {Promise<string>} 解密后的数据 (format: hashedPassword:timestamp)
   * @throws {Error} 解密失败时抛出错误
   */
  static async decryptPassword(encryptedData) {
    try {
      // 确保加密数据存在
      if (!encryptedData) {
        throw new Error('加密数据不能为空');
      }

      // 从配置或环境变量获取密钥（需要与客户端使用相同的密钥）
      // const publicKey = process.env.CRYPTO_PUBLIC_KEY || 'your-public-key';//TODO: 用config里面的
      logger.info('Public key: ', config.cryptoPublicKey);

      // 使用AES解密
      const bytes = CryptoJS.AES.decrypt(encryptedData, config.cryptoPublicKey);
      logger.info('bytes: ', bytes);
      // 转换为UTF8字符串
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      // 验证解密后的数据格式
      if (!decryptedData || !decryptedData.includes(':')) {
        throw new Error('无效的加密数据格式');
      }

      // return decryptedData;

      // 分离哈希后的密码和时间戳
      const [hashedPassword, timestamp] = decryptedData.split(':');

      return {
        hashedPassword,
        timestamp: parseInt(timestamp, 10)
      };

    } catch (error) {
      console.error('密码解密失败:', error);
      throw new Error('密码解密失败');
    }
  }

  /**
   * 生成随机字符串
   * @param {number} length - 字符串长度
   * @returns {string} 随机字符串
   */
  static generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 生成数字验证码
   * @param {number} length - 验证码长度
   * @returns {string} 数字验证码
   */
  static generateNumericCode(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return String(Math.floor(Math.random() * (max - min + 1) + min));
  }

  /**
   * Base64编码
   * @param {string} str - 待编码字符串
   * @returns {string} 编码后的字符串
   */
  static base64Encode(str) {
    return Buffer.from(str).toString('base64');
  }

  /**
   * Base64解码
   * @param {string} base64Str - base64编码字符串
   * @returns {string} 解码后的字符串
   */
  static base64Decode(base64Str) {
    return Buffer.from(base64Str, 'base64').toString();
  }

  /**
   * MD5哈希（如果需要的话）
   * @param {string} str - 待哈希字符串
   * @returns {string} MD5哈希值
   */
  static md5(str) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(str).digest('hex');
  }
}

module.exports = CryptoUtil;


/**
// 在其他文件中使用
const CryptoUtil = require('../utils/crypto.util');

// 示例使用
async function example() {
  try {
    // 密码加密
    const password = 'myPassword123';
    const hashedPassword = await CryptoUtil.hashPassword(password);
    console.log('Hashed password:', hashedPassword);

    // 密码验证
    const isValid = await CryptoUtil.verifyPassword(password, hashedPassword);
    console.log('Password valid:', isValid);

    // 生成随机字符串
    const randomString = CryptoUtil.generateRandomString(16);
    console.log('Random string:', randomString);

    // 生成验证码
    const verificationCode = CryptoUtil.generateNumericCode(6);
    console.log('Verification code:', verificationCode);

    // Base64编解码
    const original = 'Hello World';
    const encoded = CryptoUtil.base64Encode(original);
    const decoded = CryptoUtil.base64Decode(encoded);
    console.log('Base64:', { original, encoded, decoded });

    // MD5哈希
    const md5Hash = CryptoUtil.md5('test string');
    console.log('MD5 hash:', md5Hash);

  } catch (error) {
    console.error('Error:', error);
  }
}
 */