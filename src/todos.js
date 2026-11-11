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
 * 修改指定事项的标题。
 *
 * - 标题与 addTodo 同一语义：String(title ?? '').trim() 后为空即无效，返回原数组。
 * - id 不存在时返回原数组，调用方无需先做存在性检查。
 * - 只替换 title，id 与 done 原样保留，因此已完成事项也可以改名。
 *
 * 纯函数：命中时返回新数组，未命中返回原数组，绝不修改入参。
 */
export function editTodo(todos, id, title) {
  const text = String(title ?? '').trim()
  if (text === '') return todos
  if (!todos.some((t) => t.id === id)) return todos
  return todos.map((t) => (t.id === id ? { ...t, title: text } : t))
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
