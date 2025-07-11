import { useState } from 'react'
import axios from 'axios'

function UpdatePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  })
  const [message, setMessage] = useState('')
  const token = localStorage.getItem('token')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await axios.put('http://localhost:5000/api/auth/update-password', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage(res.data.message || '✅ Password updated successfully!')
      setFormData({ currentPassword: '', newPassword: '' })
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error updating password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Update Password</h2>
        {message && <p className="mb-4 text-sm text-center text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            className="w-full border p-2 rounded"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            className="w-full border p-2 rounded"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword;
