// app.js
/**
  Koa2 的中间件执行顺序是"洋葱模型"，从外到内，再从内到外。先进后出(FILO)的执行顺序。
  第一层：基础安全和日志
  第二层：请求预处理
  第三层：会话和身份验证
  第四层：请求体解析
  第五层：静态资源
  第六层：业务路由
  第七层：错误处理
  原因是：
  1.基础安全和日志要最先处理，确保所有请求都被记录和保护
  2.请求预处理（如跨域、压缩）要在实际处理请求之前完成
  3.身份验证要在解析请求体之前，避免处理未授权的大量数据
  4.请求体解析要在路由之前，确保路由处理器能获取到完整的请求数据
  5.静态资源处理要在动态路由之前，提高静态文件服务效率
  6.业务路由处理在主体中间件之后
  7.错误处理永远放在最后，可以捕获所有之前中间件产生的错误

  这样的顺序可以确保：
  安全性（先进行安全验证）
  性能（优化压缩和静态文件处理）
  可靠性（完整的错误处理）
  可维护性（清晰的中间件分层）
  需要我详细解释任何部分吗？
 */
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');//安全
const json = require('koa-json');
const compress = require('koa-compress');
const static = require('koa-static');
const session = require('koa-session');
const rateLimit = require('koa-ratelimit');//设置单位时间内访问次数的限制
const jwt = require('koa-jwt');
const path = require('path');

// 加载环境变量
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const RouteManager = require('./src/routes');
const connectDB = require('./src/utils/db');
const {accessLogger, appLogger, errLogger} = require('./src/utils/logger');
const response = require('./src/middlewares/response');

// 初始化应用
const app = new Koa();


// 第一层：基础安全和日志
app.use(response);           // 自定义响应格式
app.use(accessLogger);       // 请求日志
app.use(helmet());          // 安全头


// 第二层：请求预处理
// CORS配置, 跨域处理
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 速率限制, 限流
const rateDB = new Map();
app.use(rateLimit({
  driver: 'memory',
  db: rateDB,
  duration: 60000, // 1分钟
  errorMessage: {message:'请求过于频繁，请稍后再试'},
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 6,
  disableHeader: false
}));

// 响应压缩
app.use(compress({
  threshold: 2048,
  gzip: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: require('zlib').constants.Z_SYNC_FLUSH,
  },
  br: false
}));


// 第三层：会话和身份验证
// Session配置
app.keys = [process.env.SESSION_SECRET || 'your-session-secret'];
const SESSION_CONFIG = {
  key: 'koa.sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};
app.use(session(SESSION_CONFIG, app));

// JWT中间件（排除不需要验证的路由）
// app.use(jwt({ 
//   secret: process.env.JWT_SECRET || 'your-jwt-secret' 
// }).unless({ 
//   path: [
//     /^\/api\/auth\/login/,
//     /^\/api\/auth\/register/,
//     /^\/public/,
//     /^\//
//   ] 
// }));


// 第四层：请求体解析
// 解析请求体
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb',
}));

// 优化 JSON 输出
app.use(json());


// 第五层：静态资源
app.use(static(path.join(__dirname, 'public')));


// 第六层：业务路由
RouteManager.registerRoutes(app);


// 第七层：错误处理
// 404处理
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.error({ message: '请求的资源不存在',  code: 404 });
});

//全局错误处理中间件
app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.error({
          message: err.message,
          data: (process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
      // 错误事件监听
      ctx.app.emit('error', err, ctx);
    }
});

// 错误事件处理
app.on('error', (err, ctx) => {
    errLogger.error('server error', err, ctx);
  // 这里可以添加错误日志记录
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    appLogger.info(`Server is running on port ${PORT}`);
    appLogger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;