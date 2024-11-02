'use strict';

const Router = require('@koa/router');
const router = new Router();

router.get('/', async (ctx) => {
  ctx.success({message: 'welcome'});
});

router.get('/config', async (ctx) => {
  console.log('----------get config--------');

  

  ctx.success();
  
});


router.get('/test', async (ctx) => {

  console.log('----------test get--------');
  // ctx.success({code:201});
  // ctx.error();
  ctx.success([1,2,3]);
  // ctx.feedback();
  // ctx.failure()
  
});

router.post('/test', async (ctx) => {
  console.log('----------test post--------');
  ctx.success();
});





module.exports=router;