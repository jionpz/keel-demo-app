/**
 * Todo 的纯函数模型。
 *
 * 刻意不依赖 DOM / localStorage：前端与测试共用同一份逻辑，
 * 这样 `node --test` 不需要 jsdom，CI 也能秒级跑完。
 */

export function addTodo(todos, title) {
  const text = String(title ?? '').trim()
  if (text === '') return todos
  return [...todos, { id: nextId(todos), title: text, done: false }]
}

export function toggleTodo(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
}

export function removeTodo(todos, id) {
  return todos.filter((t) => t.id !== id)
}

function nextId(todos) {
  let max = 0
  for (const t of todos) {
    if (Number.isInteger(t.id) && t.id > max) max = t.id
  }
  return max + 1
}
