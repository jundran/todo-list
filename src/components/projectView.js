import { swapElement } from "../index.js"
import { deleteProjectFromStorage } from "../data/storage.js"
import TodoDetail from "./todoDetail.js"
import ProjectList from "./projectList.js"

const filterStatus = { ongoing: true, completed: true }

export default function ProjectView(project) {
  const projectView = document.createElement('section')
  projectView.className = 'project-view'

  // Handle null project
  if(!project) {
    projectView.innerHTML = `
      <div class='no-content'>
        <div>
          <p>No project is selected</p>
          <button class='mobile-only'>Project List</button>
        </div>
      </div>
    `
    projectView.querySelector('button').onclick = () => {
      document.body.classList.add('project-list-open')
    }
  }
  else {
    projectView.innerHTML = `
      <h2>${project.title}</h2>
      <div class="add-object-input">
        <p>Add Todo <span>+</span></p>
        <form id="add-todo-form">
          <input tabindex=0 name="title" aria-label="todo title" maxlength=50>
          <button>Add</button>
        </form>
      </div>
      <div class="options-wrapper">
        <form id="filter-form">
          <ul class=options>
            <li>
              <label for="ongoing">Ongoing</label>
              <input
                id="ongoing" name="ongoing"
                ${filterStatus.ongoing ? `type="checkbox" checked` : `type="checkbox"`}
              >
            </li>
            <li>
              <label for="completed">Completed</label>
              <input
                id="completed" name="completed"
                ${filterStatus.completed ? `type="checkbox" checked` : `type="checkbox"`}
              >
            </li>
            <li>
              <button class="rename-button" type=button>Rename Project</button>
              <button class="delete-button" type=button>Delete Project</button>
            </li>
          </ul>
        </form>
        <form class="rename">
          <input name="newName">
          <button>Submit</button>
        </form>
      </div>
    `
    activateFilterCheckboxes()
    projectView.querySelector('.rename-button').onclick = handleRenameButton
    projectView.querySelector('.rename').onsubmit = handleRenameButtonSubmit
    projectView.querySelector('.delete-button').onclick = handleDeleteButton
    projectView.querySelector('#filter-form').onchange = handleFilterChange
    projectView.querySelector('#add-todo-form').onsubmit = handleAddTodo
  }
  loadTodoItems()
  return projectView

  // FUNCTIONS
  function activateFilterCheckboxes() {
    if(filterStatus.ongoing) projectView.querySelector('#ongoing').checked = true
    if(filterStatus.completed) projectView.querySelector('#completed').checked = true
  }

  function TodoListItem(todo) {
    function handleClick(e) {
      if(e.target.tagName === 'INPUT') {
        todo.completed = e.target.checked
        return loadTodoItems()
      }

      document.body.classList.add('modal-open')
      document.querySelector('.modal')
        .replaceChildren(TodoDetail(todo))
    }

    const todoListItem = document.createElement('li')
    todoListItem.tabIndex = 0
    todoListItem.addEventListener("keydown", e => {
      if (['Enter', ' '].includes(e.key)) document.activeElement.click()
    })
    todoListItem.innerHTML = `
      <p class="title">${todo.title}</p>
      <div>
        <input
          name="completed"
          ${todo.completed ? `type="checkbox" checked` : `type="checkbox"`}
        >
        <p class="due">Due: ${todo.getDueFormatted()}</p>
        <p class=priority>Priority: <span>${todo.priority}</span></p>
      </div>
    `
    const dueField = todoListItem.querySelector('.due')
    if(dueField.textContent.includes('(Overdue)')) dueField.style.color = 'red'

    setPriorityColour(todoListItem, todo.priority)
    todoListItem.addEventListener('click', handleClick)
    return todoListItem
  }

  function setPriorityColour(todoListItem, priority) {
    const prioritySpan = todoListItem.querySelector('.priority span')
    if(priority === 'High') prioritySpan.style.color = 'red'
    else if(priority === 'Normal') prioritySpan.style.color = 'green'
    else prioritySpan.style.color = 'grey'
  }

  function handleDeleteButton() {
    deleteProjectFromStorage(project)
    swapElement(ProjectView(null))
    swapElement(ProjectList())
  }

  function handleRenameButtonSubmit(e) {
    e.preventDefault()
    projectView.querySelector('.rename').style.display = 'none'
    project.title = e.target.newName.value
    swapElement(ProjectView(project))
    swapElement(ProjectList())
  }

  function handleRenameButton() {
    const rename = projectView.querySelector('.rename')
    rename.style.display = rename.style.display === 'flex' ? 'none' : 'flex'
  }

  function handleAddTodo(e) {
    e.preventDefault()
    const todoOrError = project.addTodo(e.target.title.value)
    if(todoOrError instanceof Error) return console.log(todoOrError)

    loadTodoItems()
  }

  function handleFilterChange(e) {
    filterStatus.ongoing = e.currentTarget.ongoing.checked
    filterStatus.completed = e.currentTarget.completed.checked
    loadTodoItems()
  }

  function loadTodoItems() {
    const todoList = document.createElement('section')
    todoList.className = 'todo-list'
    if(!project) return swapElement(todoList)

    if(!project.todos.length) {
      todoList.innerHTML = `
        <div>
          <div style="font-size: 1.5rem">
            <p>Project does not have any todos</p>
          </div>
        </div>
      `
    }
    else {
      const ul = document.createElement('ul')
      todoList.append(ul)

      const filtered = project.todos.filter(todo => {
        if(filterStatus.completed && todo.completed) return true
        else if (filterStatus.ongoing && todo.completed === false) return true
      })
      ul.innerHTML = ''
      filtered.forEach(todo => ul.append(TodoListItem(todo)))
    }
    swapElement(todoList)
  }
}
