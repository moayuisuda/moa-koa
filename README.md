## 精简版koa

#### 更符合自己逻辑的命名
`ctx`中，`response`这种全称作为原生response，`res`这种缩写作为response代理。去除`ctx.body`这种不指明`res`还是`req`偷懒意味明显的代理方法。

#### 尽量能完全控制请求周期的每一步
去除每一次周期最后的自动`res.end`。仅保留少量必要代理方法，如需增加可自己编写中间件更改`ctx.res`与`ctx.req`。

#### 中间件函数精简
精简了但洋葱圈模型的意思是到了。