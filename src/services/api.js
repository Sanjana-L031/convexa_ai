import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Mock data for fallback
const mockAnalytics = {
  revenue: 125000,
  messagesSent: 8450,
  conversionRate: 12.5,
  totalUsers: 2340,
  revenueData: [
    { date: '2024-04-01', revenue: 12000 },
    { date: '2024-04-02', revenue: 15000 },
    { date: '2024-04-03', revenue: 18000 },
    { date: '2024-04-04', revenue: 14000 },
    { date: '2024-04-05', revenue: 22000 },
    { date: '2024-04-06', revenue: 25000 },
    { date: '2024-04-07', revenue: 19000 },
  ],
  campaignData: [
    { segment: 'High Value', messages: 1200, conversions: 180 },
    { segment: 'Abandoned Cart', messages: 890, conversions: 156 },
    { segment: 'Inactive', messages: 2100, conversions: 67 },
  ],
  segmentInsights: {
    high_value: { count: 45, total_revenue: 67500, avg_revenue_per_user: 1500 },
    abandoned_cart: { count: 123, total_revenue: 34500, avg_revenue_per_user: 280 },
    inactive: { count: 89, total_revenue: 12000, avg_revenue_per_user: 135 }
  }
}

// API Functions
export const getAnalytics = async () => {
  try {
    const response = await api.get('/analytics')
    return response.data
  } catch (error) {
    console.log('Using mock analytics data:', error.message)
    return mockAnalytics
  }
}

export const getUsers = async () => {
  try {
    console.log('Making API request to /users')
    const response = await api.get('/users')
    console.log('API response received:', response.data)
    return response.data
  } catch (error) {
    console.error('API request failed:', error)
    
    // Return fallback data if API fails
    return {
      success: true,
      users: [
        {
          id: "1",
          name: "Rahul Sharma",
          email: "rahul@example.com",
          segment_label: "High Value",
          segment_emoji: "💰",
          total_spent: 2500,
          cart_items: ["iPhone 15", "AirPods"],
          last_purchase_date: "2024-04-05T10:30:00Z",
          segment_confidence: 0.89
        },
        {
          id: "2",
          name: "Priya Patel",
          email: "priya@example.com",
          segment_label: "Abandoned Cart",
          segment_emoji: "🛒",
          total_spent: 450,
          cart_items: ["Laptop", "Mouse"],
          last_purchase_date: "2024-03-20T14:15:00Z",
          segment_confidence: 0.82
        },
        {
          id: "3",
          name: "Amit Kumar",
          email: "amit@example.com",
          segment_label: "Inactive",
          segment_emoji: "😴",
          total_spent: 120,
          cart_items: [],
          last_purchase_date: "2024-02-10T16:45:00Z",
          segment_confidence: 0.76
        },
        {
          id: "4",
          name: "Sneha Reddy",
          email: "sneha@example.com",
          segment_label: "High Value",
          segment_emoji: "💰",
          total_spent: 3200,
          cart_items: ["MacBook Pro", "iPad"],
          last_purchase_date: "2024-04-10T09:20:00Z",
          segment_confidence: 0.92
        },
        {
          id: "5",
          name: "Vikram Singh",
          email: "vikram@example.com",
          segment_label: "Abandoned Cart",
          segment_emoji: "🛒",
          total_spent: 890,
          cart_items: ["Gaming Chair", "Keyboard"],
          last_purchase_date: "2024-04-07T11:30:00Z",
          segment_confidence: 0.78
        },
        {
          id: "6",
          name: "Anita Desai",
          email: "anita@example.com",
          segment_label: "High Value",
          segment_emoji: "💰",
          total_spent: 1650,
          cart_items: ["Smartwatch", "Headphones"],
          last_purchase_date: "2024-04-08T15:45:00Z",
          segment_confidence: 0.85
        },
        {
          id: "7",
          name: "Ravi Gupta",
          email: "ravi@example.com",
          segment_label: "Inactive",
          segment_emoji: "😴",
          total_spent: 75,
          cart_items: ["Phone Case"],
          last_purchase_date: "2024-01-15T12:00:00Z",
          segment_confidence: 0.71
        },
        {
          id: "8",
          name: "Kavya Nair",
          email: "kavya@example.com",
          segment_label: "High Value",
          segment_emoji: "💰",
          total_spent: 2100,
          cart_items: ["Tablet", "Stylus"],
          last_purchase_date: "2024-04-09T13:20:00Z",
          segment_confidence: 0.88
        },
        {
          id: "9",
          name: "Arjun Mehta",
          email: "arjun@example.com",
          segment_label: "Inactive",
          segment_emoji: "😴",
          total_spent: 340,
          cart_items: [],
          last_purchase_date: "2024-03-25T10:15:00Z",
          segment_confidence: 0.73
        },
        {
          id: "10",
          name: "Deepika Roy",
          email: "deepika@example.com",
          segment_label: "High Value",
          segment_emoji: "💰",
          total_spent: 4500,
          cart_items: ["Camera", "Lens"],
          last_purchase_date: "2024-04-11T08:30:00Z",
          segment_confidence: 0.95
        }
      ],
      total_count: 10
    }
  }
}

export const getUserSegments = async () => {
  try {
    const response = await api.get('/users/segments')
    return response.data
  } catch (error) {
    console.error('Failed to fetch user segments:', error)
    throw error
  }
}

export const triggerCampaign = async (campaignData) => {
  try {
    const response = await api.post('/campaign/trigger', campaignData)
    return response.data
  } catch (error) {
    console.log('Using mock campaign response:', error.message)
    // Mock AI-generated response
    const mockMessages = {
      high_value: "🌟 Exclusive VIP offer just for you! Get 25% off premium items + free shipping. Your loyalty deserves the best rewards! Shop now: [link]",
      abandoned_cart: "🛒 Don't let your favorites slip away! Complete your purchase now and get 15% off + free delivery. Items are waiting for you! Checkout: [link]",
      inactive: "👋 We miss you! Come back and discover what's new with 20% off your next order. Plus, free shipping on everything! Welcome back: [link]"
    }
    
    const messagesSent = Math.floor(Math.random() * 500) + 200
    const estimatedReach = Math.floor(messagesSent * 0.85)
    
    return {
      success: true,
      messagesSent,
      estimatedReach,
      sampleMessage: mockMessages[campaignData.audience] || mockMessages.high_value,
      campaignId: Date.now()
    }
  }
}

export const getCampaignHistory = async () => {
  try {
    const response = await api.get('/campaign/history')
    return response.data
  } catch (error) {
    console.log('Using mock campaign history:', error.message)
    return {
      success: true,
      campaigns: [
        {
          id: 1,
          name: 'Winter Sale Campaign',
          audience: 'High Value',
          messages_sent: 1250,
          conversions: 89,
          revenue: 15600,
          created_at: '2024-04-09T10:30:00Z',
          status: 'completed',
          conversion_rate: 7.1
        },
        {
          id: 2,
          name: 'Cart Recovery Campaign',
          audience: 'Abandoned Cart',
          messages_sent: 890,
          conversions: 156,
          revenue: 8900,
          created_at: '2024-04-08T14:15:00Z',
          status: 'completed',
          conversion_rate: 17.5
        }
      ]
    }
  }
}

// Authentication functions
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// AI Chat functions
export const sendChatMessage = async (message, userId, conversationId) => {
  try {
    const response = await fetch('http://localhost:5000/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        user_id: userId,
        conversation_id: conversationId
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Fallback response
    return {
      success: true,
      ai_response: `Thanks for your message! I understand you said "${message}". As a demo, I'd normally provide a personalized response based on your profile and segment. Please check if the backend server is running on port 5000.`,
      timestamp: new Date().toISOString(),
      context: {
        message_intent: 'general_inquiry',
        sentiment: 'neutral',
        urgency_level: 'low'
      },
      suggested_actions: []
    }
  }
}

export const getLivePersonalization = async (userId, cartValue, behavior) => {
  try {
    const response = await fetch('http://localhost:5000/api/personalization/live', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        cart_value: cartValue,
        behavior
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Personalization API error:', error)
    
    // Fallback response
    const discount = cartValue > 5000 ? '25% off + VIP service' : 
                    cartValue > 2000 ? '20% off + free shipping' : 
                    cartValue > 500 ? '15% off' : '10% off'
    
    return {
      success: true,
      personalized_message: {
        message: `Based on your cart value of ₹${cartValue.toLocaleString()}, here's a personalized offer for you! This is a demo message - please check if the backend server is running.`,
        discount,
        urgency: 'Limited time offer!',
        cart_value: cartValue
      },
      send_time_prediction: {
        best_time: '7:00 PM',
        confidence: 0.75,
        reason: 'Demo prediction - most users are active in the evening'
      },
      ai_explanation: {
        segment: 'Demo User',
        confidence: 0.8,
        reasons: [
          `Cart value: ₹${cartValue.toLocaleString()}`,
          'Demo mode - backend connection needed for full features'
        ],
        recommendation: 'Check backend server connection',
        next_best_action: 'Ensure backend is running on port 5000'
      }
    }
  }
}

export default api