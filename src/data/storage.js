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

function populateLocalStorage() {
  // Used to keep something in local storage even after all
  // projects deleted in order not to reload default projects
  localStorage.setItem('hasRunOnce', true)
  projects.map(project => {
    const data = project.getProjectData()
    localStorage.setItem(project.title, JSON.stringify(data))
  })
}

function fetchDataFromLocalStorage() {
  Object.keys(localStorage).forEach(key => {
    if(key === 'hasRunOnce') return
    const projectData = JSON.parse(localStorage.getItem(key))
    addProjectToStorage(Project(projectData.title), false)
    projectData.todos.forEach(todo =>
      projects[projects.length - 1].addTodo(...todo))
  })
  projects.sort((a,b) => a.title > b.title)
}

if (localStorage.length) fetchDataFromLocalStorage()
else {
  loadDefaultObjects()
  populateLocalStorage()
}
