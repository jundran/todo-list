import { differenceInDays } from 'date-fns'
export default function Todo(
  title,
  desc = '',
  due = 'Not set',
  priority = 'Normal',
  completed = false
)
{

  function setTimeToStartOfDay(date) {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
  }

  function getFormattedDate(dueLocal) {
    if(due === 'Not set') return due

    // Due date
    const [year, month, day] = dueLocal.split('-')
    const dueDate = new Date()
    dueDate.setFullYear(year)
    dueDate.setMonth(month - 1) // 0 indexed
    dueDate.setDate(day)
    setTimeToStartOfDay(dueDate)

    // Today
    const todayDate = new Date()
    setTimeToStartOfDay(todayDate)

    // Output
    const days = differenceInDays(dueDate, todayDate)
    let daysTillDue = `(${days} ${days === 1 ? 'day' : 'days'})`
    if(days < 0) daysTillDue = '(Overdue)'
    else if(days === 0) daysTillDue = '(Today)'
    return `${dueDate.toDateString()} ${daysTillDue}`
  }

  return {
    get title() { return title },
    get desc() { return desc },
    get due() { return due },
    get priority() { return priority },
    get completed() { return completed },

    set title(newValue) {
      title = newValue
      this.project.addOrUpdateProjectInLocalStorage()
    },
    set desc(newValue) {
      desc = newValue
      this.project.addOrUpdateProjectInLocalStorage()
    },
    set due(newValue) {
      due = newValue || 'Not set'
      this.project.addOrUpdateProjectInLocalStorage()
    },
    set priority(newValue) {
      priority = newValue
      this.project.addOrUpdateProjectInLocalStorage()
    },
    set completed(newValue) {
      completed = newValue
      this.project.addOrUpdateProjectInLocalStorage()
    },
    getDueFormatted() { return getFormattedDate(this.due) },
  }
}
