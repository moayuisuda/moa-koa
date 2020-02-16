const mKoa = require("./src/application");
const fs = require('fs');
const app = new mKoa();

app.use(async (ctx, next) => {
  ctx.response.setHeader("Access-Control-Allow-Origin", "*");
  const filePath = './index.html';
  fs.stat(filePath, (err, stats) => {
    if(err)  {
      ctx.res.end("err!");
    } else if(stats.isFile()) {
      fs.createReadStream(filePath).pipe(ctx.response);
    }
  });

  console.log(1);
  await next();
  console.log(6);
  // ctx.res.end();
});

app.use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(5);
});

app.use(async (ctx, next) => {
  console.log(3);
  await next();
  console.log(4);
});

app.listen(3000, () => {
  console.log("listenning on 3000");
});
