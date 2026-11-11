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

/**
 * 把外部输入（localStorage、DOM dataset 等）规范化为合法筛选项。
 *
 * 只接受 'all' / 'active' / 'done'；undefined、null、空串、未知值以及
 * 非字符串输入一律回落到 'all'。纯函数且绝不抛错。
 */
export function parseFilter(value) {
  if (value === 'active' || value === 'done') return value
  return 'all'
}

/**
 * 按完成状态筛选事项。
 *
 * - all / 未知取值：返回原数组（不复制、不改动）
 * - active：只保留 done === false
 * - done：只保留 done === true
 *
 * 纯函数：始终返回新数组或原数组，绝不修改入参。
 */
export function filterTodos(todos, filter) {
  if (filter === 'active') return todos.filter((t) => t.done === false)
  if (filter === 'done') return todos.filter((t) => t.done === true)
  return todos
}

/** 统计未完成事项数量；只认 done === false。 */
export function remainingCount(todos) {
  let count = 0
  for (const t of todos) {
    if (t.done === false) count += 1
  }
  return count
}

function nextId(todos) {
  let max = 0
  for (const t of todos) {
    if (Number.isInteger(t.id) && t.id > max) max = t.id
  }
  return max + 1
}
