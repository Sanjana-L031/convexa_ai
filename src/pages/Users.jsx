import React, { useState, useEffect } from 'react'
import { Users as UsersIcon, Search, Filter } from 'lucide-react'
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
        setUsers(response.users)
        setFilteredUsers(response.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      // Fallback to mock data
      const mockUsers = [
        {
          id: 1,
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          segment: 'high_value',
          segment_label: 'High Value',
          segment_emoji: '💰',
          lastActive: '2024-04-09',
          totalSpent: 2500,
          cartItems: ['iPhone 15', 'AirPods'],
          status: 'active'
        },
        {
          id: 2,
          name: 'Priya Patel',
          email: 'priya@example.com',
          segment: 'abandoned_cart',
          segment_label: 'Abandoned Cart',
          segment_emoji: '🛒',
          lastActive: '2024-04-08',
          totalSpent: 450,
          cartItems: ['Laptop', 'Mouse'],
          status: 'inactive'
        },
        {
          id: 3,
          name: 'Amit Kumar',
          email: 'amit@example.com',
          segment: 'inactive',
          segment_label: 'Inactive',
          segment_emoji: '😴',
          lastActive: '2024-03-15',
          totalSpent: 120,
          cartItems: [],
          status: 'inactive'
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(user.segment)}`}>
                      {user.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${user.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.cartItems.length > 0 ? (
                      <div className="max-w-xs truncate">
                        {user.cartItems.join(', ')}
                      </div>
                    ) : (
                      <span className="text-gray-400">Empty</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
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