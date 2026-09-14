import CalendarWidget from './CalendarWidget'
import ExpenseTracker from './ExpenseTracker'

function HomeDashboard() {
  return (
    <div className="space-y-6 p-8">
      <CalendarWidget />
      <ExpenseTracker />
    </div>
  )
}

export default HomeDashboard
