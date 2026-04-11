import React, { useState } from 'react'
import { Mail, Phone, Lock, User, ShoppingBag } from 'lucide-react'
import { customerLogin, customerRegister } from '../services/api'

const CustomerLogin = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let response
      if (isLogin) {
        // Login with email or phone
        const credentials = {
          identifier: formData.email || formData.phone,
          password: formData.password
        }
        response = await customerLogin(credentials)
      } else {
        // Register new customer
        response = await customerRegister(formData)
      }

      if (response.success) {
        onLogin(response.customer, response.token)
      } else {
        alert(response.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert(error.error || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Quick login for demo
  const quickLogin = async (userEmail) => {
    setLoading(true)
    try {
      const response = await customerLogin({
        identifier: userEmail,
        password: 'demo123'
      })
      if (response.success) {
        onLogin(response.customer, response.token)
      }
    } catch (error) {
      console.error('Quick login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome to Convexa
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required={isLogin}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {/* Demo Quick Login */}
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">Quick Demo Login:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => quickLogin('rahul@example.com')}
                  disabled={loading}
                  className="btn-secondary text-xs py-2"
                >
                  Rahul (High Value)
                </button>
                <button
                  onClick={() => quickLogin('priya@example.com')}
                  disabled={loading}
                  className="btn-secondary text-xs py-2"
                >
                  Priya (Abandoned Cart)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerLogin