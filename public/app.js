import { addTodo, filterTodos, parseFilter, remainingCount, removeTodo, toggleTodo } from '/src/todos.js'

const STORAGE_KEY = 'keel-demo-todos'
// 筛选项单独持久化：key 与 todos 不同，todos 的存储格式保持不变。
const FILTER_STORAGE_KEY = 'keel-demo-filter'

const list = document.getElementById('list')
const empty = document.getElementById('empty')
const form = document.getElementById('add-form')
const input = document.getElementById('new-todo')
const remaining = document.getElementById('remaining')
const filterButtons = Array.from(document.querySelectorAll('.filter'))

let todos = load()
// 启动时恢复上次的筛选；未知或损坏的存储值由 parseFilter 回落到「全部」。
let filter = loadFilter()

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

function loadFilter() {
  try {
    return parseFilter(localStorage.getItem(FILTER_STORAGE_KEY))
  } catch {
    // localStorage 不可用（隐私模式等）时保持默认「全部」。
    return 'all'
  }
}

function saveFilter() {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, filter)
  } catch {
    // 写入失败不影响本次会话内的筛选。
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
  saveFilter()
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

applyFilter(filter)
