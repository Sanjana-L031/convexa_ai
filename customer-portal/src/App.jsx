import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CustomerLayout from './components/CustomerLayout'
import CustomerLogin from './components/CustomerLogin'
import CustomerActivity from './pages/CustomerActivity'
import CustomerChat from './pages/CustomerChat'
import PersonalizedOffers from './pages/PersonalizedOffers'
import MessageHistory from './pages/MessageHistory'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if customer is already logged in
    const token = localStorage.getItem('customerToken')
    const customerData = localStorage.getItem('customerData')
    
    if (token && customerData) {
      try {
        setCustomer(JSON.parse(customerData))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing customer data:', error)
        localStorage.removeItem('customerToken')
        localStorage.removeItem('customerData')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (customerData, token) => {
    setCustomer(customerData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('customerToken')
    localStorage.removeItem('customerData')
    setCustomer(null)
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Convexa Customer Portal...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <CustomerLogin onLogin={handleLogin} />
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CustomerLayout customer={customer} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<CustomerActivity customer={customer} />} />
          <Route path="/chat" element={<CustomerChat customer={customer} />} />
          <Route path="/offers" element={<PersonalizedOffers customer={customer} />} />
          <Route path="/messages" element={<MessageHistory customer={customer} />} />
        </Routes>
      </CustomerLayout>
    </Router>
  )
}

export default App