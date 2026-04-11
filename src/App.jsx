import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import Campaign from './pages/Campaign'
import Users from './pages/Users'
import History from './pages/History'
import AIDemo from './pages/AIDemo'
import Integrations from './pages/Integrations'
import CustomerActivity from './pages/CustomerActivity'
import CustomerChat from './pages/CustomerChat'
import CustomerOffers from './pages/CustomerOffers'
import CustomerMessages from './pages/CustomerMessages'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null) // 'admin' or 'customer'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const customerToken = localStorage.getItem('customerToken')
    const userData = localStorage.getItem('user')
    const customerData = localStorage.getItem('customerData')
    const storedUserType = localStorage.getItem('userType')
    
    if (token && userData && storedUserType === 'admin') {
      try {
        setUser(JSON.parse(userData))
        setUserType('admin')
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing admin data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userType')
      }
    } else if (customerToken && customerData && storedUserType === 'customer') {
      try {
        setUser(JSON.parse(customerData))
        setUserType('customer')
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing customer data:', error)
        localStorage.removeItem('customerToken')
        localStorage.removeItem('customerData')
        localStorage.removeItem('userType')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData, token, type) => {
    setUser(userData)
    setUserType(type)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('customerToken')
    localStorage.removeItem('customerData')
    localStorage.removeItem('userType')
    setUser(null)
    setUserType(null)
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading Convexa AI...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  // Customer Portal Routes
  if (userType === 'customer') {
    return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout user={user} onLogout={handleLogout} userType={userType}>
          <Routes>
            <Route path="/" element={<CustomerActivity user={user} />} />
            <Route path="/chat" element={<CustomerChat user={user} />} />
            <Route path="/offers" element={<CustomerOffers user={user} />} />
            <Route path="/messages" element={<CustomerMessages user={user} />} />
          </Routes>
        </Layout>
      </Router>
    )
  }

  // Admin Dashboard Routes
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout user={user} onLogout={handleLogout} userType={userType}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/users" element={<Users />} />
          <Route path="/history" element={<History />} />
          <Route path="/ai-demo" element={<AIDemo />} />
          <Route path="/integrations" element={<Integrations />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App