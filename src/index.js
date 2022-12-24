import ProjectsList from "./components/projectList.js"
import ProjectView from "./components/projectView.js"
import Project from "./objects/project.js"
import { addProjectToStorage } from "./data/storage.js"
import { projects } from "./data/storage.js"
import './styles/index.css'

// Modal close
window.onclick = e => {
  if(e.target === document.querySelector('.modal')) {
      document.body.classList.remove('modal-open')
  }
}

// Hamburger
document.querySelector('.project-list-toggle').addEventListener('click', () =>
    document.body.classList.toggle('project-list-open')
)

export function swapElement(element) {
  const container = document.querySelector('.container')
  const exists = container.getElementsByClassName(element.classList[0])[0]
  if(exists) exists.replaceWith(element)
  else container.append(element)
}

function handleAddProject(e) {
  e.preventDefault()
  const projectOrError = Project(e.target.title.value)
  if(projectOrError instanceof Error) return console.log(projectOrError)

  addProjectToStorage(projectOrError)
  swapElement(ProjectsList())
}

// Load initial project list and project
const container = document.querySelector('.container')
container.querySelector('#add-project-form').onsubmit = handleAddProject
container.append(ProjectsList())
container.append(ProjectView(projects.length && projects[0] || null))

document.body.classList.toggle('project-list-open')

