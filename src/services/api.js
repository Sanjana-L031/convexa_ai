import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock data for demo purposes
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
  ]
}

// API Functions
export const getAnalytics = async () => {
  try {
    const response = await api.get('/analytics')
    return response.data
  } catch (error) {
    console.log('Using mock analytics data')
    return mockAnalytics
  }
}

export const triggerCampaign = async (campaignData) => {
  try {
    const response = await api.post('/campaign/trigger', campaignData)
    return response.data
  } catch (error) {
    console.log('Using mock campaign response')
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
    console.log('Using mock campaign history')
    return []
  }
}

export default api