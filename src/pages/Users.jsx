import React, { useState, useEffect } from 'react'
import { Users as UsersIcon, Search } from 'lucide-react'
import { getUsers } from '../services/api'

const Users = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await getUsers()
      if (response.success) {
        // Transform API data to match component expectations
        const transformedUsers = response.users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          segment: user.segment_label || user.segment,
          segment_label: user.segment_label,
          segment_emoji: user.segment_emoji,
          lastActive: user.last_purchase_date ? new Date(user.last_purchase_date).toLocaleDateString() : 'Never',
          totalSpent: user.total_spent || 0,
          cartItems: user.cart_items || [],
          status: (user.total_spent || 0) > 1000 ? 'active' : 'inactive',
          confidence: user.segment_confidence
        }))
        setUsers(transformedUsers)
        setFilteredUsers(transformedUsers)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      // Fallback to mock data
      const mockUsers = [
        {
          id: 1,
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          segment: 'High Value',
          segment_label: 'High Value',
          segment_emoji: '💰',
          lastActive: '4/9/2024',
          totalSpent: 2500,
          cartItems: ['iPhone 15', 'AirPods'],
          status: 'active',
          confidence: 0.89
        },
        {
          id: 2,
          name: 'Priya Patel',
          email: 'priya@example.com',
          segment: 'Abandoned Cart',
          segment_label: 'Abandoned Cart',
          segment_emoji: '🛒',
          lastActive: '4/8/2024',
          totalSpent: 450,
          cartItems: ['Laptop', 'Mouse'],
          status: 'inactive',
          confidence: 0.82
        },
        {
          id: 3,
          name: 'Amit Kumar',
          email: 'amit@example.com',
          segment: 'Inactive',
          segment_label: 'Inactive',
          segment_emoji: '😴',
          lastActive: '3/15/2024',
          totalSpent: 120,
          cartItems: [],
          status: 'inactive',
          confidence: 0.76
        },
        {
          id: 4,
          name: 'Sneha Reddy',
          email: 'sneha@example.com',
          segment: 'High Value',
          segment_label: 'High Value',
          segment_emoji: '💰',
          lastActive: '4/10/2024',
          totalSpent: 3200,
          cartItems: ['MacBook Pro', 'iPad'],
          status: 'active',
          confidence: 0.92
        },
        {
          id: 5,
          name: 'Vikram Singh',
          email: 'vikram@example.com',
          segment: 'Abandoned Cart',
          segment_label: 'Abandoned Cart',
          segment_emoji: '🛒',
          lastActive: '4/7/2024',
          totalSpent: 890,
          cartItems: ['Gaming Chair', 'Keyboard'],
          status: 'active',
          confidence: 0.78
        },
        {
          id: 6,
          name: 'Anita Desai',
          email: 'anita@example.com',
          segment: 'High Value',
          segment_label: 'High Value',
          segment_emoji: '💰',
          lastActive: '4/8/2024',
          totalSpent: 1650,
          cartItems: ['Smartwatch', 'Headphones'],
          status: 'active',
          confidence: 0.85
        },
        {
          id: 7,
          name: 'Ravi Gupta',
          email: 'ravi@example.com',
          segment: 'Inactive',
          segment_label: 'Inactive',
          segment_emoji: '😴',
          lastActive: '1/15/2024',
          totalSpent: 75,
          cartItems: ['Phone Case'],
          status: 'inactive',
          confidence: 0.71
        },
        {
          id: 8,
          name: 'Kavya Nair',
          email: 'kavya@example.com',
          segment: 'High Value',
          segment_label: 'High Value',
          segment_emoji: '💰',
          lastActive: '4/9/2024',
          totalSpent: 2100,
          cartItems: ['Tablet', 'Stylus'],
          status: 'active',
          confidence: 0.88
        },
        {
          id: 9,
          name: 'Arjun Mehta',
          email: 'arjun@example.com',
          segment: 'Inactive',
          segment_label: 'Inactive',
          segment_emoji: '😴',
          lastActive: '3/25/2024',
          totalSpent: 340,
          cartItems: [],
          status: 'inactive',
          confidence: 0.73
        },
        {
          id: 10,
          name: 'Deepika Roy',
          email: 'deepika@example.com',
          segment: 'High Value',
          segment_label: 'High Value',
          segment_emoji: '💰',
          lastActive: '4/11/2024',
          totalSpent: 4500,
          cartItems: ['Camera', 'Lens'],
          status: 'active',
          confidence: 0.95
        }
      ]
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
    }
  }

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by segment
    if (selectedSegment !== 'all') {
      filtered = filtered.filter(user => user.segment === selectedSegment)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, selectedSegment])

  const segments = [
    { value: 'all', label: 'All Users', emoji: '👥' },
    { value: 'High Value', label: 'High Value', emoji: '💰' },
    { value: 'Abandoned Cart', label: 'Abandoned Cart', emoji: '🛒' },
    { value: 'Inactive', label: 'Inactive', emoji: '😴' }
  ]

  const getSegmentColor = (segment) => {
    switch (segment) {
      case 'High Value':
        return 'bg-green-100 text-green-800'
      case 'Abandoned Cart':
        return 'bg-yellow-100 text-yellow-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage and segment your user base</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Segment Filter */}
          <div className="sm:w-48">
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {segments.map((segment) => (
                <option key={segment.value} value={segment.value}>
                  {segment.emoji} {segment.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cart Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(user.segment)}`}>
                        {user.segment_emoji} {user.segment}
                      </span>
                      {user.confidence && (
                        <span className="ml-2 text-xs text-gray-500">
                          {Math.round(user.confidence * 100)}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(user.totalSpent || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.cartItems && user.cartItems.length > 0 ? (
                      <div className="max-w-xs truncate">
                        {user.cartItems.join(', ')}
                      </div>
                    ) : (
                      <span className="text-gray-400">Empty</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive || 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {segments.slice(1).map((segment) => {
          const count = users.filter(user => user.segment === segment.value).length
          return (
            <div key={segment.value} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{segment.emoji}</span>
                <div>
                  <p className="text-sm text-gray-600">{segment.label}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Users