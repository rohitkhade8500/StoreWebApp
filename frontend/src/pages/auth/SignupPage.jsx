import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function SignupPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    const { name, email, address, password } = formData

    if (name.length < 3 || name.length > 60) {
      newErrors.name = 'Name must be between 3 and 60 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!address || address.length > 400) {
      newErrors.address = 'Address must be less than 400 characters'
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/
    if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must be 8-16 chars, 1 uppercase, 1 special char'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!validate()) return

    try {
      const payload = {
        ...formData,
        role: 'user', 
      }

      const res = await axios.post('http://localhost:5000/api/auth/register', payload)

      setMessage('✅ User registered successfully!')
      setFormData({ name: '', email: '', address: '', password: '' })

      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      console.error('Signup error:', err)
      setMessage(err.response?.data?.message || '❌ Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">User Signup</h2>

        {message && <div className="mb-4 text-center text-sm text-green-600">{message}</div>}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Full name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Email address"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Address"
              rows="3"
            ></textarea>
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>

<p className="text-sm mt-4 text-center text-gray-600">
  Already have an account?{' '}
  <button
    type="button"
    className="text-blue-600 hover:underline"
    onClick={() => navigate('/login')}
  >
    Login
  </button>
</p>

      </div>
    </div>
  )
}



export default SignupPage;
