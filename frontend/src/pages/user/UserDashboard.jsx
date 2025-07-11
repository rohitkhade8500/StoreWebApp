import { Link } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'

function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">User Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome, User!</h2>
        <p className="text-gray-600 mb-4">Browse and rate stores below 👇</p>

        <Link
          to="/user/stores"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Browse Stores
        </Link>
      </div>
    </div>
  )
}

export default UserDashboard;
