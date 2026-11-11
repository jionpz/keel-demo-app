import { addTodo, filterTodos, parseFilter, remainingCount, removeTodo, toggleTodo } from '/src/todos.js'

const STORAGE_KEY = 'keel-demo-todos'
const FILTER_KEY = 'keel-demo-filter'

const list = document.getElementById('list')
const empty = document.getElementById('empty')
const form = document.getElementById('add-form')
const input = document.getElementById('new-todo')
const remaining = document.getElementById('remaining')
const filterButtons = Array.from(document.querySelectorAll('.filter'))

let todos = load()
let filter = 'all'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw === null ? [] : JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

/** 读取持久化的筛选项；存储不可用或值非法时回落 'all'。 */
function loadFilter() {
  try {
    return parseFilter(localStorage.getItem(FILTER_KEY))
  } catch {
    return 'all'
  }
}

function render() {
  const visible = filterTodos(todos, filter)

  list.replaceChildren()
  for (const todo of visible) {
    const li = document.createElement('li')
    li.className = todo.done ? 'item done' : 'item'

    const label = document.createElement('label')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = todo.done
    checkbox.addEventListener('change', () => {
      todos = toggleTodo(todos, todo.id)
      save()
      render()
    })

    const text = document.createElement('span')
    text.textContent = todo.title

    label.append(checkbox, text)

    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'remove'
    remove.textContent = '删除'
    remove.addEventListener('click', () => {
      todos = removeTodo(todos, todo.id)
      save()
      render()
    })

    li.append(label, remove)
    list.append(li)
  }

  // 计数始终基于全量 todos，与当前筛选无关。
  remaining.textContent = `剩余 ${remainingCount(todos)} 项`

  empty.hidden = visible.length > 0
  if (visible.length === 0) {
    empty.textContent = todos.length === 0 ? '还没有事项。' : '该筛选下没有事项。'
  }
}

function applyFilter(next) {
  filter = parseFilter(next)
  localStorage.setItem(FILTER_KEY, filter)
  for (const button of filterButtons) {
    const selected = button.dataset.filter === filter
    button.classList.toggle('selected', selected)
    button.setAttribute('aria-pressed', selected ? 'true' : 'false')
  }
  render()
}

for (const button of filterButtons) {
  button.addEventListener('click', () => applyFilter(button.dataset.filter))
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  todos = addTodo(todos, input.value)
  input.value = ''
  save()
  render()
})

applyFilter(loadFilter())
