let EventEmitter = require("events");
let http = require("http");
let context = require("./context");
let requestProxy = require("./requestProxy");
let responseProxy = require("./responseProxy");

class Application extends EventEmitter {
  constructor() {
    super();
    this.middlewares = [];
    this.context = context;
    this.requestProxy = requestProxy;
    this.responseProxy = responseProxy;
  }

  listen() {
    let server = http.createServer(this.callback());
    server.listen(...arguments);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  callback() {
    return (req, res) => {
      let ctx = this.createContext(req, res);
      let onerror = err => this.onerror(err, ctx);
      let fn = this.compose();
      return fn(ctx).catch(onerror);
    };
  }

  compose() {
    return async ctx => {
      const createNext = (middleware, next) => {
        return async () => {
          await middleware(ctx, next);
        };
      };

      let next = () => {};
      for (let i = this.middlewares.length - 1; i >= 0; i--) {
        next = createNext(this.middlewares[i], next);
      }

      await next();
    };
  }

  createContext(request, response) {
    let ctx = Object.create(this.context);
    ctx.req = Object.create(this.requestProxy);
    ctx.res = Object.create(this.responseProxy);
    ctx.request = ctx.req.request = request;
    ctx.response = ctx.res.response = response;
    return ctx;
  }

  onerror(err, ctx) {
    if (err.code === "ENOENT") {
      ctx.response.statusCode = 404;
    } else {
      ctx.response.statusCode = 500;
    }
    let msg = err.message || "[moa-koa] err occered!";
    ctx.res.end(JSON.stringify(msg));
    this.emit("error", err);
  }
}

module.exports = Application;
