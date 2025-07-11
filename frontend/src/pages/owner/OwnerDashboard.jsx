import { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import LogoutButton from '../../components/LogoutButton'

function OwnerDashboard() {
  const [storeName, setStoreName] = useState('')
  const [averageRating, setAverageRating] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  })
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    fetchDashboardData()

    const interval = setInterval(() => {
      fetchDashboardData()
    }, 10000) 

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('/owner/dashboard')
      console.log('Dashboard data:', res.data)

      setStoreName(res.data.storeName)
      setAverageRating(res.data.averageRating)
      setRatings(res.data.ratings)
      setLoading(false)
    } catch (err) {
      console.error('Owner dashboard fetch error:', err)
      setError('Failed to fetch dashboard info')
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      const res = await axios.put('/owner/change-password', passwordForm)
      setPasswordMessage(res.data.message)
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (err) {
      console.error(err)
      setPasswordMessage(err.response?.data?.message || 'Failed to change password')
    }
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Store Owner Dashboard</h1>
        <LogoutButton />
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">{error}</div>
      )}

      {/* Store Info */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Store: {storeName}</h2>
        <p className="text-gray-600 text-lg">
          <span className="font-semibold">Average Rating:</span>{' '}
          <span className="text-yellow-600 font-bold text-xl">
            {averageRating || 'N/A'}
          </span>
        </p>
      </div>

      {/*  Change Password Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {showPasswordForm ? 'Cancel' : 'Change Password'}
        </button>

        {showPasswordForm && (
          <div className="mt-4 bg-white p-4 rounded shadow space-y-4">
            {passwordMessage && (
              <p className="text-sm text-green-600">{passwordMessage}</p>
            )}

            <input
              type="password"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleChangePassword}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Customer Ratings:</h3>
        {ratings.length === 0 ? (
          <p className="text-gray-500">No ratings submitted yet.</p>
        ) : (
          <ul className="space-y-3">
            {ratings.map((rating, idx) => (
              <li key={idx} className="border-b pb-2">
                <span className="text-blue-700 font-medium">{rating.userName}</span>{' '}
                rated your store{' '}
                <span className="font-semibold text-yellow-600">{rating.rating}/5</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard;
