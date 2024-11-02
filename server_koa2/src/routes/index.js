// routes/index.js
'use strict';

const Router = require('@koa/router');
const userRoutes = require('./user.routes');
const demoRoutes = require('./demo.routes');

class RouteManager {
  static registerRoutes(app) {
    const router = new Router();

    // 注册用户模块路由 - /user/...
    router.use('/user', userRoutes.routes(), userRoutes.allowedMethods());

    // 注册demo路由 - /demo/...
    router.use('/demo', demoRoutes.routes(), demoRoutes.allowedMethods());

    // 将所有路由挂载到app实例上
    app.use(router.routes());
    app.use(router.allowedMethods());
  }
}

module.exports = RouteManager;