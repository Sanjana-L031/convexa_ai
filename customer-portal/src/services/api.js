import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('customerToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Customer Authentication
export const customerLogin = async (credentials) => {
  try {
    const response = await api.post('/api/customer/login', credentials)
    if (response.data.success) {
      localStorage.setItem('customerToken', response.data.token)
      localStorage.setItem('customerData', JSON.stringify(response.data.customer))
    }
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' }
  }
}

export const customerRegister = async (userData) => {
  try {
    const response = await api.post('/api/customer/register', userData)
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' }
  }
}

// Customer Profile
export const getCustomerProfile = async () => {
  try {
    const response = await api.get('/api/customer/profile')
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch profile' }
  }
}

export const updateCustomerProfile = async (profileData) => {
  try {
    const response = await api.put('/api/customer/profile', profileData)
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update profile' }
  }
}

// Customer Activity
export const getCustomerActivity = async () => {
  try {
    const response = await api.get('/api/customer/activity')
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch activity' }
  }
}

export const getCartItems = async () => {
  try {
    const response = await api.get('/api/customer/cart')
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch cart' }
  }
}

export const getRecommendations = async () => {
  try {
    const response = await api.get('/api/customer/recommendations')
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch recommendations' }
  }
}

// Customer Chat
export const sendChatMessage = async (message) => {
  try {
    const response = await api.post('/api/customer/chat', { message })
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to send message' }
  }
}

export const getChatHistory = async () => {
  try {
    const response = await api.get('/api/customer/chat/history')
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch chat history' }
  }
}

// Personalized Offers
export const getPersonalizedOffers = async () => {
  try {
    const response = await api.get('/api/customer/offers')
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch offers' }
  }
}

// Message History
export const getMessageHistory = async () => {
  try {
    const response = await api.get('/api/customer/messages')
    return response.data
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch messages' }
  }
}

export default api