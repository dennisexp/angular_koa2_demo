// routes/user.routes.js
'use strict';

const Router = require('@koa/router');
const UserCtrl = require('../controllers/userCtrl');
const { validateRegister, validateLogin } = require('../middlewares/user-validation');
const { auth } = require('../middlewares/auth');

const router = new Router();

// 用户注册
router.post('/register', validateRegister, UserCtrl.register);

// 用户登录
router.post('/login', validateLogin, UserCtrl.login);

// 原始路由会重定向到新路由
router.get('/', async (ctx) => {
    ctx.redirect('/profile');
  });

// 获取用户信息
router.get('/profile', auth, UserCtrl.getProfile);

// 需要特定角色的路由
router.post('/admin', 
    auth({ required: true, roles: ['admin'] }), // 需要admin角色
    UserCtrl.getProfile  //adminOperation
);

module.exports = router;