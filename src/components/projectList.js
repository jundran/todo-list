import { swapElement } from '../index.js'
import { projects } from '../data/storage.js'
import ProjectView from './projectView.js'

function handleClick(project) {
  document.body.classList.remove('project-list-open')
  swapElement(ProjectView(project))
}

export default function ProjectList() {
  const projectList = document.createElement('section')
  projectList.className = 'project-list'
  const ul = document.createElement('ul')
  projects.forEach(project => {
    const li = document.createElement('li')
    li.append(project.title)
    li.className = 'project-list-item'
    li.onclick = () => handleClick(project)
    li.tabIndex = 0
    li.addEventListener("keydown", e => {
      if (['Enter', ' '].includes(e.key)) document.activeElement.click()
    })
    ul.append(li)
  })
  projectList.append(ul)
  return projectList
}
