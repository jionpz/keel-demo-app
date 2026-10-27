import assert from 'node:assert/strict'
import { test } from 'node:test'
import { addTodo, removeTodo, toggleTodo } from '../src/todos.js'

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
