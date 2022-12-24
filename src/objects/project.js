import { projects } from '../data/storage.js'
import Todo from './todo.js'

export default function Project(title = '') {
  const todos = []

  function getErrorIfTitleInvalid(titleToValidate = title, type = 'Project') {
    const storage = type === 'Project' ? projects : todos

    if(titleToValidate === '') {
      return Error(`${type} must have a name.`)
    }
    else if (storage
      .some(object => object.title.toLowerCase() === titleToValidate.toLowerCase())
    ) {
      return Error(`A ${type} with this name already exists.`)
    }
    return null // valid title
  }

  function addTodo(todoTitle, ...rest) {
    todoTitle = todoTitle.trim()
    const error = getErrorIfTitleInvalid(todoTitle, 'Todo')
    if(error) return error

    const newTodo = Todo(todoTitle, ...rest)
    const arrayLength = todos.push(newTodo)
    newTodo.id = arrayLength - 1
    newTodo.project = this
    addOrUpdateProjectInLocalStorage()
    return newTodo
  }

  function removeTodo(todo) {
    todos.splice(todo.id, 1)
    updateTodoIndexes()
    addOrUpdateProjectInLocalStorage()
  }

  function updateTodoIndexes() {
    todos.forEach((todo, index ) => todo.id = index)
  }

  function rename(newTitle) {
    newTitle = newTitle.trim()
    const error = getErrorIfTitleInvalid(newTitle)
    if(error) return error
    localStorage.removeItem(title)
    title = newTitle
    addOrUpdateProjectInLocalStorage()
  }

  function getProjectData() {
    return {
      title,
      todos: todos.map(todo => Object.values(todo).slice(0, 5))
    }
  }

  function addOrUpdateProjectInLocalStorage() {
    localStorage.setItem(title, JSON.stringify(getProjectData()))
  }

  // New project
  title = title.trim()
  const error = getErrorIfTitleInvalid(title)
  if(error) return error

  addOrUpdateProjectInLocalStorage()

  return {
    get title() { return title },
    set title(newTitle) { rename(newTitle) },
    get todos() { return todos },
    rename,
    addTodo,
    removeTodo,
    getProjectData,
    addOrUpdateProjectInLocalStorage
  }
}
