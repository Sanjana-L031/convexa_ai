import React, { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Eye, TrendingUp, Package, Star } from 'lucide-react'

const CustomerActivity = ({ user }) => {
  const [activity, setActivity] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Mock data based on user
      setActivity({
        totalSpent: user?.total_spent || 2500,
        totalOrders: user?.total_orders || 5,
        lastPurchase: user?.last_purchase_date || '2024-04-05',
        favoriteCategory: 'Electronics',
        loyaltyPoints: Math.floor((user?.total_spent || 0) * 0.5)
      })
      
      // Mock cart items based on user data
      const userCartItems = user?.cart_items || []
      setCartItems(userCartItems.map((item, index) => ({
        id: index + 1,
        name: item,
        price: 25000 + (index * 10000),
        image: item.toLowerCase().includes('phone') ? '📱' : 
               item.toLowerCase().includes('airpods') ? '🎧' : 
               item.toLowerCase().includes('macbook') ? '💻' : '📦',
        quantity: 1
      })))
      
      setRecommendations([
        { id: 1, name: 'MacBook Pro', price: 199999, image: '💻', reason: 'Based on your recent purchases' },
        { id: 2, name: 'Apple Watch', price: 41999, image: '⌚', reason: 'Customers like you also bought' },
        { id: 3, name: 'iPad Air', price: 59999, image: '📱', reason: 'Perfect complement to your iPhone' }
      ])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's your shopping activity and personalized recommendations</p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">₹{activity?.totalSpent?.toLocaleString()}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Spent</p>
            <p className="text-xs text-gray-500 mt-1">Lifetime value</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{activity?.totalOrders}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{activity?.loyaltyPoints}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Loyalty Points</p>
            <p className="text-xs text-gray-500 mt-1">Redeem for rewards</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Heart className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-lg font-bold text-gray-900">{activity?.favoriteCategory}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Favorite Category</p>
            <p className="text-xs text-gray-500 mt-1">Most purchased</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Cart ({cartItems.length} items)
          </h2>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Checkout
          </button>
        </div>

        {cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{item.image}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700">Remove</button>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Your cart is empty</p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 mt-4">
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Eye className="mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{item.image}</div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-3">{item.reason}</p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 w-full">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomerActivity