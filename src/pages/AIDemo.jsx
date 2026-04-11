import React, { useState, useEffect } from 'react'
import { Brain, MessageSquare, Zap, Users, Sparkles, Target, Activity, Wifi } from 'lucide-react'
import AIChat from '../components/AIChat'
import LivePersonalization from '../components/LivePersonalization'
import CustomerSelector from '../components/CustomerSelector'
import { getUsers } from '../services/api'
import websocketService from '../services/websocket'

const AIDemo = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeDemo, setActiveDemo] = useState('chat')
  const [backendConnected, setBackendConnected] = useState(true)
  const [showCustomerSelector, setShowCustomerSelector] = useState(false)
  const [realtimeEvents, setRealtimeEvents] = useState([])
  const [realtimeAnalytics, setRealtimeAnalytics] = useState(null)
  const [websocketConnected, setWebsocketConnected] = useState(false)

  useEffect(() => {
    fetchUsers()
    checkBackendConnection()
    // Only initialize WebSocket for admin users or if needed
    // initializeWebSocket()
    startRealtimeUpdates()
    
    return () => {
      // websocketService.disconnect()
    }
  }, [])

  const initializeWebSocket = () => {
    // Connect to WebSocket
    websocketService.connect('http://localhost:5000')
    
    // Listen for connection status
    websocketService.on('connection_status', (data) => {
      setWebsocketConnected(data.connected)
      console.log('WebSocket connection status:', data)
    })
    
    // Listen for real-time events
    websocketService.on('live_events', (data) => {
      setRealtimeEvents(prev => [...data.events, ...prev.slice(0, 10)])
    })
    
    // Listen for analytics updates
    websocketService.on('analytics_update', (data) => {
      setRealtimeAnalytics(data)
    })
    
    // Listen for customer activity
    websocketService.on('customer_activity', (data) => {
      setRealtimeEvents(prev => [data, ...prev.slice(0, 10)])
    })
    
    // Listen for cart updates
    websocketService.on('cart_update', (data) => {
      setRealtimeEvents(prev => [data, ...prev.slice(0, 10)])
    })
    
    // Listen for message events
    websocketService.on('message_received', (data) => {
      setRealtimeEvents(prev => [data, ...prev.slice(0, 10)])
    })
  }

  useEffect(() => {
    fetchUsers()
    checkBackendConnection()
    startRealtimeUpdates()
  }, [])

  const startRealtimeUpdates = () => {
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchRealtimeEvents()
      fetchRealtimeAnalytics()
    }, 5000)

    return () => clearInterval(interval)
  }

  const fetchRealtimeEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/realtime/events?limit=5')
      const data = await response.json()
      if (data.success) {
        setRealtimeEvents(data.events)
      }
    } catch (error) {
      console.error('Failed to fetch realtime events:', error)
    }
  }

  const fetchRealtimeAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/realtime/analytics')
      const data = await response.json()
      if (data.success) {
        setRealtimeAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Failed to fetch realtime analytics:', error)
    }
  }

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/health')
      setBackendConnected(response.ok)
    } catch (error) {
      setBackendConnected(false)
    }
  }

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from API...')
      const response = await getUsers()
      console.log('Users response:', response)
      
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
        console.log('Transformed users:', transformedUsers)
        setUsers(transformedUsers)
        if (transformedUsers.length > 0) {
          setSelectedUser(transformedUsers[0])
        }
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
      console.log('Using fallback mock users:', mockUsers)
      setUsers(mockUsers)
      if (mockUsers.length > 0) {
        setSelectedUser(mockUsers[0])
      }
    }
  }

  const demoFeatures = [
    {
      id: 'chat',
      title: 'Real-Time AI Chat',
      subtitle: '2-Way Conversation System',
      icon: MessageSquare,
      color: 'from-blue-600 to-purple-600',
      description: 'AI responds contextually to customer messages with personalized offers',
      badge: 'INTERACTIVE'
    },
    {
      id: 'personalization',
      title: 'Live Personalization',
      subtitle: 'Real-Time Message Adaptation',
      icon: Zap,
      color: 'from-purple-600 to-pink-600',
      description: 'Messages change instantly based on cart value and behavior',
      badge: 'REAL-TIME'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Demo Center
          </h1>
          <div className={`px-3 py-1 text-sm font-medium rounded-full ${
            backendConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {backendConnected ? '🟢 Backend Connected' : '🟡 Demo Mode'}
          </div>
          <div className={`px-3 py-1 text-sm font-medium rounded-full ${
            websocketConnected 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {websocketConnected ? '🔵 WebSocket Live' : '⚪ WebSocket Offline'}
          </div>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience advanced AI-powered customer engagement with real-time personalization and intelligent conversations
        </p>
        {!backendConnected && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-yellow-800 text-sm">
              <strong>Demo Mode:</strong> Backend server not connected. Using fallback data and responses. 
              Start the backend server with <code className="bg-yellow-100 px-1 rounded">python backend/app.py</code> for full functionality.
            </p>
          </div>
        )}
        {!websocketConnected && backendConnected && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>WebSocket Offline:</strong> Real-time features limited. WebSocket connection failed - using polling fallback.
            </p>
          </div>
        )}
      </div>

      {/* Feature Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {demoFeatures.map((feature) => {
          const IconComponent = feature.icon
          return (
            <button
              key={feature.id}
              onClick={() => setActiveDemo(feature.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                activeDemo === feature.id
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-purple-600 mb-2">{feature.subtitle}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Real-time Data Sources */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Live Data Sources
          </h3>
          <div className="flex items-center gap-4">
            {websocketConnected && (
              <button
                onClick={() => websocketService.send('simulate_event', { type: 'customer_activity' })}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Simulate Event
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${websocketConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={`text-sm ${websocketConnected ? 'text-green-600' : 'text-gray-500'}`}>
                {websocketConnected ? 'Real-time' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-1">🛒</div>
            <div className="text-sm font-medium text-gray-900">Shopify</div>
            <div className="text-xs text-green-600">Connected</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-1">🛍️</div>
            <div className="text-sm font-medium text-gray-900">WooCommerce</div>
            <div className="text-xs text-green-600">Connected</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl mb-1">📱</div>
            <div className="text-sm font-medium text-gray-900">WhatsApp</div>
            <div className="text-xs text-green-600">Connected</div>
          </div>
          <div className="text-center p-3 bg-pink-50 rounded-lg">
            <div className="text-2xl mb-1">📸</div>
            <div className="text-sm font-medium text-gray-900">Instagram</div>
            <div className="text-xs text-green-600">Connected</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm font-medium text-gray-900">Analytics</div>
            <div className="text-xs text-green-600">Connected</div>
          </div>
        </div>

        {realtimeAnalytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-600">Active Users</div>
              <div className="text-xl font-bold text-blue-600">{realtimeAnalytics.active_users}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-600">Revenue Today</div>
              <div className="text-xl font-bold text-green-600">₹{realtimeAnalytics.revenue_today?.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-600">Conversion Rate</div>
              <div className="text-xl font-bold text-purple-600">{(realtimeAnalytics.conversion_rate * 100)?.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-600">Orders Today</div>
              <div className="text-xl font-bold text-orange-600">{realtimeAnalytics.orders_today}</div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Events */}
      {realtimeEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Wifi className="h-5 w-5 text-blue-500" />
            Live Customer Activity
          </h3>
          <div className="space-y-2">
            {realtimeEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {event.customer} {event.activity || event.action}
                  </div>
                  <div className="text-xs text-gray-500">
                    {event.source} • {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {event.value && (
                  <div className="text-sm font-medium text-green-600">
                    ₹{event.value.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Selected Customer for Demo
            </h3>
            <p className="text-sm text-gray-600">Choose from real-time customer data across platforms</p>
          </div>
          <button
            onClick={() => setShowCustomerSelector(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select Customer
          </button>
        </div>
        
        {selectedUser && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {selectedUser.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{selectedUser.name}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>{selectedUser.segment_emoji} {selectedUser.segment}</span>
                  <span>₹{selectedUser.totalSpent?.toLocaleString()}</span>
                  <span>{selectedUser.platform || 'Shopify'}</span>
                  <span className="text-green-600">● Online</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Selector Modal */}
      <CustomerSelector
        isOpen={showCustomerSelector}
        onClose={() => setShowCustomerSelector(false)}
        onSelectCustomer={(customer) => {
          setSelectedUser(customer)
          setShowCustomerSelector(false)
        }}
        selectedCustomer={selectedUser}
      />

      {/* Demo Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {activeDemo === 'chat' && (
          <>
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Real-Time AI Chat Demo
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p><strong>🎯 Try these messages:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• "This is too expensive"</li>
                    <li>• "I'm interested in this product"</li>
                    <li>• "I have a problem with my order"</li>
                    <li>• "Tell me more about this"</li>
                  </ul>
                  <p className="text-purple-600 font-medium">
                    Watch the AI respond with personalized offers based on the customer's segment and behavior!
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">AI Features Demonstrated:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Contextual response generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Sentiment analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Intent recognition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Suggested actions</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-2">
              <AIChat selectedUser={selectedUser} />
            </div>
          </>
        )}

        {activeDemo === 'personalization' && (
          <>
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Live Personalization Demo
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p><strong>🎯 Interactive Controls:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Adjust cart value slider (₹100 - ₹10,000)</li>
                    <li>• Change time on page</li>
                    <li>• Modify pages visited</li>
                    <li>• Update items viewed</li>
                  </ul>
                  <p className="text-purple-600 font-medium">
                    Watch the message change instantly as you adjust the parameters!
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">AI Features Demonstrated:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Real-time message adaptation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Behavioral scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Send time prediction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Explainable AI insights</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-2">
              <LivePersonalization selectedUser={selectedUser} />
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-2">🚀 Advanced AI Features</h3>
        <p className="text-purple-100 mb-4">
          Real-time AI conversations + Live personalization = Enhanced customer engagement
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>2-Way AI Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Live Personalization</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>Explainable AI</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIDemo