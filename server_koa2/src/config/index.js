'use strict';


module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET || '8a29ab14c4d6e8f0123456789abcdef0123456789abcdef0123456789abcdef0',
        expiresIn: '24h' // token有效期24h天
    },
    cryptoPublicKey: process.env.CRYPTO_PUBLIC_KEY || '2a101XmmP5RKd3Hi6I5RK3ICDqUrpWXO.3c8H6IC',
    // 数据库密码二次加密的密钥（仅后端使用）
    passwordSecret: process.env.PASSWORD_SECRET || 'ICDqUrpWXO.9vg5b5BPf1lqxQQZWywoG7$10$1Xm'
};