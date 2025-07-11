import { useEffect, useState } from 'react'
import axios from '../../utils/axios' 
import LogoutButton from '../../components/LogoutButton'

function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [searchUser, setSearchUser] = useState('')
  const [searchStore, setSearchStore] = useState('')
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddStore, setShowAddStore] = useState(false)

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: '',
  })

  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    fetchDashboardStats()
    fetchUsers()
    fetchStores()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get('/admin/dashboard')
      setStats(res.data)
    } catch (err) {
      console.error('Stats error:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      console.error('Users error:', err)
    }
  }

  const fetchStores = async () => {
    try {
      const res = await axios.get('/admin/stores')
      setStores(res.data)
    } catch (err) {
      console.error('Stores error:', err)
    }
  }

  const handleAddUser = async () => {
    try {
      await axios.post('/admin/users', newUser)
      setNewUser({ name: '', email: '', password: '', address: '', role: '' })
      setShowAddUser(false)
      fetchUsers()
    } catch (err) {
      console.error('Add user error:', err)
    }
  }

  const handleAddStore = async () => {
    try {
      await axios.post('/admin/stores', newStore)
      setNewStore({ name: '', email: '', address: '' })
      setShowAddStore(false)
      fetchStores()
    } catch (err) {
      console.error('Add store error:', err)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  )

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchStore.toLowerCase())
  )

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Stores</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalStores || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Ratings</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.totalRatings || 0}</p>
        </div>
      </div>

      {/* Add Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add User
        </button>
        <button
          onClick={() => setShowAddStore(!showAddStore)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Store
        </button>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
          <h3 className="text-lg font-bold mb-2">Add New User</h3>
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Address"
            value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
          />
          <select
            className="border p-2 rounded w-full"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save User
          </button>
        </div>
      )}

      {/* Add Store Form */}
      {showAddStore && (
        <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
          <h3 className="text-lg font-bold mb-2">Add New Store</h3>
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            value={newStore.email}
            onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Address"
            value={newStore.address}
            onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
          />
          <button
            onClick={handleAddStore}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Store
          </button>
        </div>
      )}

      {/* Search and Users Table */}
      <div className="mb-4">
        <input
          type="text"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder="Search users by name"
          className="border p-2 rounded w-full sm:w-1/2"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Address</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.address}</td>
                  <td className="p-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search and Stores Table */}
      <div className="mb-4">
        <input
          type="text"
          value={searchStore}
          onChange={(e) => setSearchStore(e.target.value)}
          placeholder="Search stores by name"
          className="border p-2 rounded w-full sm:w-1/2"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Stores</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Address</th>
                <th className="p-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id} className="border-t">
                  <td className="p-2">{store.name}</td>
                  <td className="p-2">{store.email}</td>
                  <td className="p-2">{store.address}</td>
                  <td className="p-2">{store.average_rating || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;
