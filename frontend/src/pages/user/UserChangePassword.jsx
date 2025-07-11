import { useState } from 'react'
import axios from '../../utils/axios'
import LogoutButton from '../../components/LogoutButton'

function UserChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return 'All fields are required'
    if (newPassword !== confirmPassword) return 'Passwords do not match'
    const re = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/
    if (!re.test(newPassword))
      return 'New password must be 8–16 chars, include uppercase & special char'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setMessage(err)
      return
    }
    try {
      const res = await axios.put('/auth/update-password', {
        currentPassword: oldPassword,
        newPassword,
      })
      setMessage(res.data.message || 'Password updated successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error('Password update error:', err)
      setMessage(err.response?.data?.message || 'Failed to update password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Change Password</h2>
          <LogoutButton />
        </div>
        {message && <p className="mb-4 text-sm text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border p-2 rounded"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full border p-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserChangePassword;
