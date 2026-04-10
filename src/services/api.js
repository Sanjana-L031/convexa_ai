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
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
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

export default api