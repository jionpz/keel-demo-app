import { addTodo, removeTodo, toggleTodo } from '/src/todos.js'

const STORAGE_KEY = 'keel-demo-todos'

const list = document.getElementById('list')
const empty = document.getElementById('empty')
const form = document.getElementById('add-form')
const input = document.getElementById('new-todo')

let todos = load()

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

function render() {
  list.replaceChildren()
  for (const todo of todos) {
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
  empty.hidden = todos.length > 0
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  todos = addTodo(todos, input.value)
  input.value = ''
  save()
  render()
})

render()
