import React, { useState, useEffect } from 'react'
import { X, Users, Search, ShoppingCart, Clock, DollarSign } from 'lucide-react'
import { getUsers } from '../services/api'

const CustomerSelector = ({ isOpen, onClose, onSelectCustomer, selectedCustomer }) => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm, selectedSegment])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await getUsers()
      if (response.success) {
        const transformedCustomers = response.users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          segment: user.segment_label || user.segment,
          segment_emoji: user.segment_emoji,
          totalSpent: user.total_spent || 0,
          cartItems: user.cart_items || [],
          cartValue: (user.cart_items || []).length * 1500, // Mock cart value
          lastActive: user.last_purchase_date ? new Date(user.last_purchase_date).toLocaleTimeString() : '22:00',
          confidence: user.segment_confidence || 0.8,
          platform: getRandomPlatform(),
          source: getRandomSource()
        }))
        setCustomers(transformedCustomers)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRandomPlatform = () => {
    const platforms = ['Shopify', 'WooCommerce', 'WhatsApp', 'Instagram']
    return platforms[Math.floor(Math.random() * platforms.length)]
  }

  const getRandomSource = () => {
    const sources = ['E-commerce', 'Social Media', 'Google Analytics', 'Direct']
    return sources[Math.floor(Math.random() * sources.length)]
  }

  const filterCustomers = () => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSegment !== 'all') {
      filtered = filtered.filter(customer => customer.segment === selectedSegment)
    }

    setFilteredCustomers(filtered)
  }

  const segments = [
    { value: 'all', label: 'All Customers', emoji: '👥', count: customers.length },
    { value: 'High Value', label: 'High Value', emoji: '💰', count: customers.filter(c => c.segment === 'High Value').length },
    { value: 'Abandoned Cart', label: 'Abandoned Cart', emoji: '🛒', count: customers.filter(c => c.segment === 'Abandoned Cart').length },
    { value: 'Inactive', label: 'Inactive', emoji: '😴', count: customers.filter(c => c.segment === 'Inactive').length }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Select Customer for Demo</h2>
              <p className="text-sm text-gray-600">Choose from real-time customer data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Data Sources Info */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Live Data Sources:</span>
            </div>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">🛒 Shopify</span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">📱 WhatsApp</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">📊 Analytics</span>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search customers..."
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
                    {segment.emoji} {segment.label} ({segment.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading customers...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedCustomer?.id === customer.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{customer.name}</h3>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{customer.source}</div>
                      <div className="text-xs text-blue-600">{customer.platform}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.segment === 'High Value' ? 'bg-green-100 text-green-800' :
                        customer.segment === 'Abandoned Cart' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.segment_emoji} {customer.segment}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(customer.confidence * 100)}% confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span>₹{customer.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-600" />
                        <span>{customer.lastActive}</span>
                      </div>
                    </div>

                    {customer.cartItems.length > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <ShoppingCart className="h-3 w-3 text-orange-600" />
                        <span>{customer.cartItems.length} items (₹{customer.cartValue.toLocaleString()})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No customers found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredCustomers.length} customers • Real-time data from multiple sources
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              disabled={!selectedCustomer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Select Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSelector