import { swapElement } from "../index.js"
import ProjectView from "./projectView.js"

function handleCloseButton() {
  document.body.classList.remove('modal-open')
}

function handleCancelButton(todo) {
  document.querySelector('.modal').replaceChildren(TodoDetail(todo))
}

function handleDeleteButton(todo) {
  todo.project.removeTodo(todo)
  swapElement(ProjectView(todo.project))
  document.body.classList.remove('modal-open')
}

function handleSubmit(e, todo) {
  e.preventDefault()
  Object.keys(todo).slice(0, 5).forEach(key => {
    todo[key] = key !== 'completed' ? e.target[key].value : e.target[key].checked
  })
  swapElement(ProjectView(todo.project))
  document.querySelector('.modal').replaceChildren(TodoDetail(todo))
}

function handleEditButton(todoEdit, todo) {
  todoEdit.innerHTML = `
    <button id='close' aria-label for="desc"='close'>X</button>
    <form>
      <ul>
        <li id='title'>
          <label for="title">Title</label>
          <input aria-label='todo title' name='title' type="text" value="${todo.title}">
        </li>
        <li id='desc'>
          <label for="desc">Description</label">
          <textarea name='desc' rows="10">${todo.desc}</textarea>
        </li>
        <li id="due" class='flex'>
          <label for="due">Due: </label>
          <input name="due" type="date" value="${todo.due}">
        </li>
        <li id="priority" class='flex'>
          <label for="priority">Priority: </label>
          <select name="priority"></select>
        </li>
        <li id='completed' class='flex'>
          <label for="completed">Completed: </label>
          <input name="completed" ${todo.completed ? `type="checkbox" checked` : `type="checkbox"`}>
        </li>
      </ul>
      <button type='button' id='delete'>Delete</button>
      <button type='button' id='cancel'>Cancel</button>
      <button type='submit' id='save'>Save</button>
    </form>
  `

  ;['High', 'Normal', 'Low'].forEach(p => {
    todoEdit.querySelector('ul select')
      .append(new Option(p, p, p === 'Normal', todo.priority === p))
  }) 

  todoEdit.querySelector('#close').onclick = handleCloseButton
  todoEdit.querySelector('#delete').onclick = () => handleDeleteButton(todo)
  todoEdit.querySelector('#cancel').onclick = () => handleCancelButton(todo)
  todoEdit.querySelector('form').onsubmit = e => handleSubmit(e, todo)
}

export default function TodoDetail(todo) {
  const todoDetail = document.createElement('div')
  todoDetail.className = 'todo-detail'
  todoDetail.innerHTML = `
    <button id='close' aria-label for="desc"='close'>X</button>
    <ul>
      <li id='title'>
        <h2 aria-label='todo name'>${todo.title}</h2>
      </li>
      <li id='desc'>
        <label for="desc">Description</label for="desc">
        <p id="desc">${todo.desc ? todo.desc : '[No description added]'}</p>
      </li>
      <li id="due" class='flex'>
        <label for="due">Due: </label for="desc">
        <span>${todo.getDueFormatted()}</span>
      </li>
      <li id="priority" class='flex'>
        <label for="priority">Priority: </label for="desc"> 
        <span>${todo.priority}</span>
      </li>
      <li id='completed' class='flex'>
        <label for="completed">Status: </label for="desc">
        <span>${todo.completed ? "Completed" : "In progress"}</span>
      </li>
    </ul>
    <button id='edit'>Edit</button>
  `
  todoDetail.querySelector('#close').onclick = () => handleCloseButton(todo)
  todoDetail.querySelector('#edit').onclick = () => handleEditButton(todoDetail, todo)

  return todoDetail
}
