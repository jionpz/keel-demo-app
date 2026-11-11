import { addTodo, editTodo, filterTodos, remainingCount, removeTodo, toggleTodo } from '/src/todos.js'

const STORAGE_KEY = 'keel-demo-todos'

const list = document.getElementById('list')
const empty = document.getElementById('empty')
const form = document.getElementById('add-form')
const input = document.getElementById('new-todo')
const remaining = document.getElementById('remaining')
const filterButtons = Array.from(document.querySelectorAll('.filter'))

let todos = load()
// 当前筛选项仅存在于内存：刷新后回到「全部」，不写入 localStorage。
let filter = 'all'
// 正在编辑的事项 id，同样只是内存态；null 表示无编辑态。
let editingId = null

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
  const visible = filterTodos(todos, filter)

  list.replaceChildren()
  for (const todo of visible) {
    const editing = todo.id === editingId
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

    let editor = null
    if (editing) {
      label.className = 'editing'
      editor = document.createElement('input')
      editor.type = 'text'
      editor.className = 'title-input'
      editor.value = todo.title
      editor.autocomplete = 'off'
      bindEditor(editor, todo)
      label.append(checkbox, editor)
    } else {
      const text = document.createElement('span')
      text.textContent = todo.title
      label.append(checkbox, text)
    }

    const actions = document.createElement('div')
    actions.className = 'actions'

    if (!editing) {
      const edit = document.createElement('button')
      edit.type = 'button'
      edit.className = 'edit'
      edit.textContent = '编辑'
      edit.addEventListener('click', () => {
        editingId = todo.id
        render()
      })
      actions.append(edit)
    }

    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'remove'
    remove.textContent = '删除'
    remove.addEventListener('click', () => {
      todos = removeTodo(todos, todo.id)
      save()
      render()
    })
    actions.append(remove)

    li.append(label, actions)
    list.append(li)

    if (editor !== null) {
      editor.focus()
      editor.select()
    }
  }

  // 计数始终基于全量 todos，与当前筛选无关。
  remaining.textContent = `剩余 ${remainingCount(todos)} 项`

  empty.hidden = visible.length > 0
  if (visible.length === 0) {
    empty.textContent = todos.length === 0 ? '还没有事项。' : '该筛选下没有事项。'
  }
}

/**
 * 绑定编辑框的提交/取消。
 *
 * Escape 需要「取消且不能被随后的 blur 反写」：用一次性的 finished 标记，
 * 无论 Escape、Enter、blur 谁先触发，只有第一次生效。
 */
function bindEditor(editor, todo) {
  let finished = false

  function finish(keep) {
    if (finished) return
    finished = true
    if (keep) {
      // 空白标题自然落到 editTodo 返回原数组的分支，等价于取消。
      todos = editTodo(todos, todo.id, editor.value)
      save()
    }
    editingId = null
    render()
  }

  editor.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      finish(true)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      finish(false)
    }
  })
  editor.addEventListener('blur', () => finish(true))
}

function applyFilter(next) {
  filter = next
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

applyFilter('all')
