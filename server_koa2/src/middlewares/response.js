/**
 * @author Achilles
 * @date 2024/11/02
 * @description 中间件  将success的code改为200，error的code改为500；并更好message和code的顺序
 */

'use strict';

/**
 * response 自己判断
 * @param ctx
 * @param res 返回内容  内含有 data, message='SUCCESS/或其他', code=200
 */
const feedback = (ctx, res) => {
  processResponse(ctx, res, 'response');
}

/**
 * response 成功
 * @param ctx
 * @param data 数据
 * @param message 状态描述 || [描述, 状态码] //success
 * @param code 状态码 
 */
const success = (ctx, res) => {
  processResponse(ctx, res);
}

/**
 * response 客户端错误
 * @param ctx
 * @param message 错误描述 || [错误描述, 错误码] //FAILURE
 * @param code 错误码 
 */
const failure = (ctx, res) => {
  processResponse(ctx, res, 'FAILURE', 400);
}

/**
 * response 服务器端错误
 * @param ctx
 * @param message 错误描述 || [错误描述, 错误码] //ERROR
 * @param code 错误码 
 */
const error = (ctx, res) => {
  processResponse(ctx, res, 'ERROR', 500);
}

const processResponse = (ctx, res, defaultMessage='SUCCESS', defaultCode='200') => {
  let code, message, data={};
  switch (typeof res) {
    case 'object':
      if (res === null) {
      } else if (Array.isArray(res)) {
          data = res;
      } else {
          data = res.data;
          code = res.code;
          message = res.message;
      }
      break;
    case 'string':
      try {
          const jsonObj = JSON.parse(res);
          data = jsonObj.data;
          code = jsonObj.code;
          message = jsonObj.message;
      } catch (e) {
          message = res;
      }
      break;
    case 'number':
    case 'boolean':
      message = '' + res;
      break;
    case 'function':
      message = res.toString();
      break;
    case 'undefined':
    default:
  }

  code = +code || defaultCode;
  message = message ?? defaultMessage;
  data = data || {};

  ctx.body = {code, message, data};
}

module.exports = async (ctx, next) => {
    ctx.feedback = feedback.bind(null, ctx);
    ctx.success = success.bind(null, ctx);
    ctx.failure = failure.bind(null, ctx);
    ctx.error = error.bind(null, ctx);
    await next();
}


// module.exports = {
//   success(message='SUCCESS', code=200, data={}){
//       return { 'code': +code, 'status': 'SUCCESS',  'message': message, 'data': data };
//   },
  
//   error(message='', code=400){
//       return { 'code': +code, 'status': 'ERROR',  'message': message };
//   }
// }
