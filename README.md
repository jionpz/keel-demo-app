# keel-demo-app

一个刻意做小的 Todo 应用，用来验证 [Keel](https://github.com/jionpz/keel) 的
端到端研发闭环：真实 Issue → 自动分析 / 设计 / 开发 / QA / Review → 真实 PR → 真实 CI。

## 运行

```bash
npm start        # http://127.0.0.1:3000
npm test         # node --test，零依赖
```

端口可用 `PORT` 覆盖。

## 结构

```
public/          页面（HTML / CSS / 前端 JS）
src/todos.js     纯函数模型（前端与测试共用）
test/            node:test
server.mjs       零依赖静态服务器
```
