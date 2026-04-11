import React, { useState, useEffect } from 'react'
import { Gift, Percent, Clock, Star, Zap } from 'lucide-react'

const CustomerOffers = ({ user }) => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      // Mock offers based on user segment
      const userSegment = user?.segment || 'High Value'
      const mockOffers = [
        {
          id: 1,
          title: `Exclusive ${userSegment} Discount`,
          description: 'Special discount just for you',
          discount: userSegment === 'High Value' ? '25%' : userSegment === 'Abandoned Cart' ? '20%' : '15%',
          type: 'percentage',
          validUntil: '2024-04-20',
          category: 'Electronics',
          minAmount: userSegment === 'High Value' ? 10000 : 5000,
          code: userSegment === 'High Value' ? 'VIP25' : userSegment === 'Abandoned Cart' ? 'CART20' : 'SAVE15',
          reason: `You're a ${userSegment.toLowerCase()} customer`,
          priority: userSegment === 'High Value' ? 'high' : 'medium',
          used: false
        },
        {
          id: 2,
          title: 'Cart Recovery Bonus',
          description: 'Complete your purchase and get extra savings',
          discount: '50%',
          type: 'product',
          validUntil: '2024-04-15',
          category: 'Accessories',
          code: 'CART50',
          reason: 'Items waiting in your cart',
          priority: 'urgent',
          used: false
        },
        {
          id: 3,
          title: 'Free Premium Shipping',
          description: 'Get free express delivery on orders above ₹5,000',
          discount: 'Free Shipping',
          type: 'shipping',
          validUntil: '2024-04-25',
          code: 'FREESHIP',
          reason: 'Based on your purchase history',
          priority: 'medium',
          used: false
        },
        {
          id: 4,
          title: 'Loyalty Reward',
          description: `Redeem ${Math.floor((user?.total_spent || 0) * 0.5)} points for instant discount`,
          discount: `₹${Math.floor((user?.total_spent || 0) * 0.2)}`,
          type: 'points',
          validUntil: '2024-05-01',
          code: 'LOYALTY500',
          reason: 'You have enough loyalty points',
          priority: 'medium',
          used: false
        }
      ]
      
      setOffers(mockOffers)
    } catch (error) {
      console.error('Failed to fetch offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'from-purple-500 to-pink-500'
      case 'urgent':
        return 'from-red-500 to-orange-500'
      case 'medium':
        return 'from-blue-500 to-cyan-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <Star className="h-4 w-4" />
      case 'urgent':
        return <Zap className="h-4 w-4" />
      case 'medium':
        return <Gift className="h-4 w-4" />
      default:
        return <Percent className="h-4 w-4" />
    }
  }

  const getDaysLeft = (validUntil) => {
    const today = new Date()
    const expiry = new Date(validUntil)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleUseOffer = (offerId) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId ? { ...offer, used: true } : offer
    ))
    alert('Offer applied successfully!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const activeOffers = offers.filter(offer => !offer.used)
  const usedOffers = offers.filter(offer => offer.used)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Personalized Offers</h1>
        <p className="text-gray-600 mt-1">Exclusive deals curated just for you, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{activeOffers.length}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Active Offers</p>
            <p className="text-xs text-gray-500 mt-1">Ready to use</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Percent className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {Math.max(...offers.map(o => parseInt(o.discount) || 0))}%
            </span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Best Discount</p>
            <p className="text-xs text-gray-500 mt-1">Maximum savings</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{usedOffers.length}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Used Offers</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
        </div>
      </div>

      {/* Active Offers */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Offers</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeOffers.map((offer) => {
            const daysLeft = getDaysLeft(offer.validUntil)
            return (
              <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
                {/* Priority Badge */}
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${getPriorityColor(offer.priority)} text-white px-3 py-1 rounded-bl-xl flex items-center space-x-1`}>
                  {getPriorityIcon(offer.priority)}
                  <span className="text-xs font-medium capitalize">{offer.priority}</span>
                </div>

                <div className="pt-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{offer.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{offer.discount}</div>
                      <div className="text-xs text-gray-500">OFF</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Code:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{offer.code}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Valid until:</span>
                      <span className="font-medium">{new Date(offer.validUntil).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Time left:</span>
                      <span className={`font-medium flex items-center ${daysLeft <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {daysLeft} days
                      </span>
                    </div>

                    {offer.minAmount && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Min amount:</span>
                        <span className="font-medium">₹{offer.minAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Why this offer?</strong> {offer.reason}
                      </p>
                    </div>

                    <button
                      onClick={() => handleUseOffer(offer.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 w-full"
                    >
                      Use This Offer
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Used Offers */}
      {usedOffers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recently Used</h2>
          <div className="space-y-4">
            {usedOffers.map((offer) => (
              <div key={offer.id} className="bg-gray-50 rounded-xl p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{offer.title}</h3>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-600">{offer.discount}</div>
                    <div className="text-xs text-gray-500">USED</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerOffers