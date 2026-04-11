import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, MessageSquare, Activity, Gift, History, LogOut, User } from 'lucide-react'

const CustomerLayout = ({ children, customer, onLogout }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Activity', href: '/', icon: Activity },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Offers', href: '/offers', icon: Gift },
    { name: 'Messages', href: '/messages', icon: History },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Convexa
                </h1>
                <p className="text-xs text-gray-500">Customer Portal</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 mt-6 px-3">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Customer Profile */}
          <div className="p-4 border-t border-gray-200 bg-white mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{customer?.name}</p>
                  <p className="text-xs text-gray-500">{customer?.segment || 'Customer'}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default CustomerLayout