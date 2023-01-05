import { generalTodos } from './data.js'
import Project from '../objects/project.js'

// Storage
export const projects = []

// Add sort param because sorting while building projects array
// from local storage was causing some todos not to be loaded
export async function addProjectToStorage(project, sort = true) {
  projects.push(project)
  if(sort) projects.sort((a,b) => a.title > b.title)
}

export function deleteProjectFromStorage(project) {
  localStorage.removeItem(project.title)
  projects.splice(projects.findIndex(p => p.title === project.title), 1)
}

function loadDefaultObjects() {
  const general = (Project('General'))
  addProjectToStorage(general)
  generalTodos.forEach(todo => {
    general.addTodo(todo.title, todo.desc, todo.due, todo.priority, todo.completed)
  })
}

function fetchDataFromLocalStorage() {
  const projectItems = Object.keys(localStorage)
    .filter(key => key.startsWith('--todo-project--'))

  projectItems.forEach(key => {
    const projectData = JSON.parse(localStorage.getItem(key))
    addProjectToStorage(Project(projectData.title), false)
    projectData.todos.forEach(todo =>
      projects[projects.length - 1].addTodo(...todo))
  })
  projects.sort((a,b) => a.title > b.title)
}

if (localStorage.length) {
  fetchDataFromLocalStorage()
  if(!projects.length) {
    const userDeletedAllProjects = localStorage.getItem('--todo-app--return-visitor')
    if(!userDeletedAllProjects) setUpForFirstRun()
  }
}
else setUpForFirstRun()

function setUpForFirstRun() {
  loadDefaultObjects()
  localStorage.setItem('--todo-app--return-visitor', true)
}
