'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;  // 或 const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  uid: { 
    type: String, 
    // required: true, 
    unique: true 
  },
  phone: { 
    type: String,
    required: [true, '手机号是必需的'],
    unique: true,
    trim: true,
    match: [/^1[3-9]\d{9}$/, '请输入有效的手机号']
  },
  username: {
    type: String,
    required: [true, '用户名是必需的'],
    trim: true,
    minlength: [2, '用户名最少2个字'],
    maxlength: [20, '用户名最多20个字']
  },
  password: {
    type: String,
    required: [true, '密码是必需的'],
    minlength: [6, '密码最少6个字'],
    select: false
  },
  role: { 
    type: String, 
    enum: ['admin', 'user', 'locked', 'demo'], //locked: 封禁的, demo: 试用账户
    default: 'user' 
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// 创建索引
userSchema.index({ uid: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

const getNextSequence = async (sequenceName) => {
  const counter = await mongoose.connection.collection('counters').findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequence_value: 1 } },
      { returnDocument: 'after', upsert: true }
  );
  return counter.sequence_value;
};

// 在保存之前自动生成uid
userSchema.pre('save', async function(next) {
  if (!this.uid) {
    // 生成16位随机字串作为uid
    const seq = await getNextSequence('uid');
    this.uid = `U${seq}`; // Format: U10001, U10002, etc.
  }
  next();
});

// 保存前加密密码
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);//
  this.password = await bcrypt.hash(this.password, salt);
});

// 验证密码的方法
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);