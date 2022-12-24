
function getDate() {
  const date = new Date()
  // Get date string one year from now
  // Add 1 to getMonth() because it's an array starting at 0
  return `${date.getFullYear() + 1}-${date.getMonth() + 1}-${date.getDate()}`
}
export const generalTodos = [
  {
    title: 'Make a todo app',
    desc: 'Write some nice looking code',
    due: getDate(),
    priority: 'High',
    completed: true
  },
  {
    title: 'Get a job writing code',
    due: getDate()
  },
  {
    title: 'Live happily ever after',
    due: getDate(),
    priority: 'Low'
  }
]
