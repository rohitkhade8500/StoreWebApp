import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import LogoutButton from '../../components/LogoutButton'

function UserStoreList() {
  const [stores, setStores] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [userRatings, setUserRatings] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const res = await axios.get('/stores')
      setStores(res.data)
    } catch (err) {
      console.error('Fetch stores error:', err)
      setMessage('Failed to load stores')
    }
  }

  const handleRatingChange = (storeId, value) => {
    setUserRatings((prev) => ({ ...prev, [storeId]: value }))
  }

  const handleSubmitRating = async (storeId) => {
    const rating = Number(userRatings[storeId])
    if (!rating || rating < 1 || rating > 5) {
      alert('Select a valid rating from 1 to 5')
      return
    }

    try {
      const res = await axios.post('/ratings', {
        store_id: storeId,
        rating,
      })
      setMessage(res.data.message)
      fetchStores()
    } catch (err) {
      console.error('Rating error:', err)
      setMessage('Failed to submit rating')
    }

    setTimeout(() => setMessage(''), 3000)
  }

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Browse Stores</h1>
        <LogoutButton />
      </div>

      {message && <div className="mb-4 text-green-600">{message}</div>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or address..."
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredStores.map((store) => (
          <div key={store.id} className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800">{store.name}</h2>
            <p className="text-gray-600 mb-1">📍 {store.address}</p>
            <p className="text-yellow-600 font-medium mb-2">
              ⭐ Avg Rating: {store.average_rating || 'N/A'}
            </p>

            <div className="flex items-center gap-3 mb-3">
              <input
                type="number"
                min="1"
                max="5"
                value={userRatings[store.id] || ''}
                onChange={(e) => handleRatingChange(store.id, e.target.value)}
                className="border p-1 w-20 rounded-md"
              />
              <button
                onClick={() => handleSubmitRating(store.id)}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Submit Rating
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserStoreList;
