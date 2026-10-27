import assert from 'node:assert/strict'
import { test } from 'node:test'
import { addTodo, filterTodos, remainingCount, removeTodo, toggleTodo } from '../src/todos.js'

test('addTodo 追加一条未完成事项', () => {
  const todos = addTodo([], '写周报')
  assert.equal(todos.length, 1)
  assert.equal(todos[0].title, '写周报')
  assert.equal(todos[0].done, false)
})

test('addTodo 忽略空白标题', () => {
  assert.deepEqual(addTodo([], '   '), [])
})

test('addTodo 生成不重复的 id', () => {
  const todos = addTodo(addTodo([], 'a'), 'b')
  assert.notEqual(todos[0].id, todos[1].id)
})

test('toggleTodo 翻转完成状态', () => {
  const todos = addTodo([], 'a')
  const toggled = toggleTodo(todos, todos[0].id)
  assert.equal(toggled[0].done, true)
  assert.equal(toggleTodo(toggled, todos[0].id)[0].done, false)
})

test('toggleTodo 不改动其他事项', () => {
  const todos = addTodo(addTodo([], 'a'), 'b')
  const toggled = toggleTodo(todos, todos[1].id)
  assert.equal(toggled[0].done, false)
  assert.equal(toggled[1].done, true)
})

test('removeTodo 删除指定事项', () => {
  const todos = addTodo(addTodo([], 'a'), 'b')
  const left = removeTodo(todos, todos[0].id)
  assert.equal(left.length, 1)
  assert.equal(left[0].title, 'b')
})

test('removeTodo 对不存在的 id 是幂等的', () => {
  const todos = addTodo([], 'a')
  assert.deepEqual(removeTodo(todos, 999), todos)
})

// --- filterTodos -----------------------------------------------------------

function sample() {
  return [
    { id: 1, title: 'a', done: false },
    { id: 2, title: 'b', done: true },
    { id: 3, title: 'c', done: false },
  ]
}

test('filterTodos all 返回全部事项', () => {
  const todos = sample()
  assert.deepEqual(filterTodos(todos, 'all'), todos)
})

test('filterTodos active 只保留未完成事项', () => {
  const visible = filterTodos(sample(), 'active')
  assert.deepEqual(visible.map((t) => t.id), [1, 3])
})

test('filterTodos done 只保留已完成事项', () => {
  const visible = filterTodos(sample(), 'done')
  assert.deepEqual(visible.map((t) => t.id), [2])
})

test('filterTodos 未知取值回落到 all', () => {
  const todos = sample()
  assert.deepEqual(filterTodos(todos, 'unknown'), todos)
  assert.deepEqual(filterTodos(todos, undefined), todos)
})

test('filterTodos 不修改入参', () => {
  const todos = sample()
  const snapshot = structuredClone(todos)
  filterTodos(todos, 'active')
  filterTodos(todos, 'done')
  filterTodos(todos, 'all')
  assert.deepEqual(todos, snapshot)
  assert.equal(todos.length, 3)
})

// --- remainingCount --------------------------------------------------------

test('remainingCount 对空数组返回 0', () => {
  assert.equal(remainingCount([]), 0)
})

test('remainingCount 只统计未完成事项', () => {
  assert.equal(remainingCount(sample()), 2)
})

test('remainingCount 全部完成时返回 0', () => {
  const todos = [
    { id: 1, title: 'a', done: true },
    { id: 2, title: 'b', done: true },
  ]
  assert.equal(remainingCount(todos), 0)
})
