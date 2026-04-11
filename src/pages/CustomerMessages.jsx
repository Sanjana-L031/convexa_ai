import React, { useState, useEffect } from 'react'
import { MessageSquare, Clock, CheckCircle, Eye, Filter } from 'lucide-react'

const CustomerMessages = ({ user }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, campaigns, offers

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      // Mock messages based on user data
      const mockMessages = [
        {
          id: 1,
          type: 'campaign',
          subject: `Exclusive ${user?.segment || 'VIP'} Offer Just for You! 💎`,
          content: `Hi ${user?.name}! As a valued ${user?.segment?.toLowerCase() || 'customer'}, we're excited to offer you special discounts on your favorite products. Your excellent taste deserves the best deals!`,
          sender: 'Convexa AI',
          timestamp: '2024-04-11T10:30:00Z',
          read: false,
          platform: 'whatsapp',
          campaign_name: `${user?.segment || 'VIP'} Customer Campaign`
        },
        {
          id: 2,
          type: 'offer',
          subject: 'Your Cart is Waiting! Complete Your Purchase 🛒',
          content: user?.cart_items?.length > 0 
            ? `Don't miss out on your ${user.cart_items.join(' and ')}! Complete your purchase now and get free express delivery.`
            : 'You have items waiting in your cart. Complete your purchase now and get free express delivery.',
          sender: 'Convexa AI',
          timestamp: '2024-04-10T15:45:00Z',
          read: true,
          platform: 'whatsapp',
          offer_code: 'CART50'
        },
        {
          id: 3,
          type: 'notification',
          subject: `Welcome to Convexa, ${user?.name}! 🎉`,
          content: `Thank you for joining Convexa! We're excited to provide you with personalized shopping experiences and exclusive deals tailored to your preferences.`,
          sender: 'Convexa Team',
          timestamp: '2024-04-09T09:15:00Z',
          read: true,
          platform: 'email'
        },
        {
          id: 4,
          type: 'campaign',
          subject: 'Flash Sale Alert! ⚡ 30% Off Electronics',
          content: 'Limited time offer! Get 30% off on all electronics including premium brands. Perfect for tech enthusiasts like you. Sale ends in 24 hours!',
          sender: 'Convexa AI',
          timestamp: '2024-04-08T18:20:00Z',
          read: true,
          platform: 'whatsapp',
          campaign_name: 'Flash Sale Campaign'
        },
        {
          id: 5,
          type: 'offer',
          subject: 'Loyalty Reward Available! 🌟',
          content: `You've earned ${Math.floor((user?.total_spent || 0) * 0.5)} loyalty points! Redeem them now for ₹${Math.floor((user?.total_spent || 0) * 0.2)} instant discount on your next purchase.`,
          sender: 'Convexa AI',
          timestamp: '2024-04-07T12:00:00Z',
          read: true,
          platform: 'app',
          offer_code: 'LOYALTY500'
        }
      ]
      
      setMessages(mockMessages)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ))
  }

  const getFilteredMessages = () => {
    switch (filter) {
      case 'unread':
        return messages.filter(msg => !msg.read)
      case 'campaigns':
        return messages.filter(msg => msg.type === 'campaign')
      case 'offers':
        return messages.filter(msg => msg.type === 'offer')
      default:
        return messages
    }
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case 'campaign':
        return '📢'
      case 'offer':
        return '🎁'
      case 'notification':
        return '🔔'
      default:
        return '💬'
    }
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'whatsapp':
        return '📱'
      case 'email':
        return '📧'
      case 'app':
        return '📲'
      default:
        return '💬'
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredMessages = getFilteredMessages()
  const unreadCount = messages.filter(msg => !msg.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Message History</h1>
        <p className="text-gray-600 mt-1">All your personalized messages and offers in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{messages.length}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Messages</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <Eye className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{unreadCount}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Unread</p>
            <p className="text-xs text-gray-500 mt-1">Needs attention</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {messages.filter(msg => msg.type === 'offer').length}
            </span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Offers Received</p>
            <p className="text-xs text-gray-500 mt-1">Personalized deals</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {messages.filter(msg => msg.type === 'campaign').length}
            </span>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Campaigns</p>
            <p className="text-xs text-gray-500 mt-1">Marketing messages</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Messages' },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'campaigns', label: 'Campaigns' },
              { key: 'offers', label: 'Offers' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
              !message.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => !message.read && markAsRead(message.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  {getMessageIcon(message.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-lg font-semibold ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.subject}
                    </h3>
                    {!message.read && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">New</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{getPlatformIcon(message.platform)}</span>
                    <span>{formatTime(message.timestamp)}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">{message.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>From: {message.sender}</span>
                    {message.campaign_name && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                        {message.campaign_name}
                      </span>
                    )}
                    {message.offer_code && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        Code: {message.offer_code}
                      </span>
                    )}
                  </div>
                  
                  {!message.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(message.id)
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No messages found for the selected filter</p>
        </div>
      )}
    </div>
  )
}

export default CustomerMessages