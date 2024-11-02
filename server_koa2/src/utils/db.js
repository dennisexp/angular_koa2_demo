const mongoose = require('mongoose');
const {logger, errLogger, appLogger} = require('./logger');

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.set('strictQuery', true);

    const options = {
      dbName: process.env.DB_NAME || 'invoice_mgt'
    };

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

    mongoose.connect(uri, options)
      .then(() => {
        logger.info('MongoDB连接成功');
      })
      .catch((err) => {
        errLogger.error('MongoDB连接失败:', err);
        process.exit(1);
      });

    this.addEventListeners();
  }

  addEventListeners() {
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose连接已建立');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose连接断开');
    });

    process.on('SIGINT', this.closeConnection.bind(this));
    process.on('SIGTERM', this.closeConnection.bind(this));
  }

  async closeConnection() {
    try {
      await mongoose.connection.close();
      logger.info('Mongoose连接已关闭');
      process.exit(0);
    } catch (err) {
      logger.error('关闭Mongoose连接时出错:', err);
      process.exit(1);
    }
  }
}

module.exports = new Database();