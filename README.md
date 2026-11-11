# keel-demo-app

一个刻意做小的 Todo 应用，用来验证 [Keel](https://github.com/jionpz/keel) 的
端到端研发闭环：真实 Issue → 自动分析 / 设计 / 开发 / QA / Review → 真实 PR → 真实 CI。

## 运行

```bash
npm start        # http://127.0.0.1:3000
npm test         # node --test，零依赖
```

端口可用 `PORT` 覆盖。

## 操作

- 输入框回车或点「添加」新增一条事项。
- 点事项右侧「编辑」，标题变成预填当前标题的输入框：按 Enter 或点击别处（失焦）保存，按 Escape 取消。
- 提交空白标题（清空或只填空格）等同取消，保留原标题。
- 勾选框切换完成状态；点「删除」移除事项。
- 标题与完成状态保存在 `localStorage['keel-demo-todos']`，刷新后仍在。

## 结构

```
public/          页面（HTML / CSS / 前端 JS）
src/todos.js     纯函数模型（前端与测试共用）
test/            node:test
server.mjs       零依赖静态服务器
```
