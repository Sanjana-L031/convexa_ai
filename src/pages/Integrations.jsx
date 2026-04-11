import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Settings, ExternalLink, Zap, Shield, TrendingUp } from 'lucide-react'

const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'E-commerce platform integration for customer data and order tracking',
      icon: '🛒',
      status: 'connected',
      lastSync: '2 minutes ago',
      metrics: {
        customers: '2,847',
        orders: '1,234',
        revenue: '₹4,56,789'
      },
      features: ['Customer Data', 'Order Tracking', 'Product Catalog', 'Abandoned Cart Recovery']
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Direct messaging platform for customer engagement and support',
      icon: '📱',
      status: 'connected',
      lastSync: '5 minutes ago',
      metrics: {
        messages: '15,678',
        conversations: '3,456',
        response_rate: '94.2%'
      },
      features: ['2-Way Messaging', 'Rich Media', 'Templates', 'Broadcast Lists']
    },
    {
      id: 'instagram',
      name: 'Instagram Business',
      description: 'Social media integration for customer insights and engagement',
      icon: '📸',
      status: 'connected',
      lastSync: '1 hour ago',
      metrics: {
        followers: '12,456',
        engagement: '8.7%',
        reach: '45,678'
      },
      features: ['DM Integration', 'Story Mentions', 'Comment Tracking', 'Influencer Analytics']
    },
    {
      id: 'google_analytics',
      name: 'Google Analytics',
      description: 'Web analytics for customer behavior and conversion tracking',
      icon: '📊',
      status: 'connected',
      lastSync: '10 minutes ago',
      metrics: {
        sessions: '8,945',
        bounce_rate: '32.1%',
        conversion: '4.8%'
      },
      features: ['Behavior Tracking', 'Conversion Funnels', 'Audience Insights', 'Goal Tracking']
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      description: 'WordPress e-commerce plugin for online store management',
      icon: '🛍️',
      status: 'pending',
      lastSync: 'Not connected',
      metrics: {
        customers: '0',
        orders: '0',
        revenue: '₹0'
      },
      features: ['Product Management', 'Order Processing', 'Customer Data', 'Payment Tracking']
    },
    {
      id: 'facebook',
      name: 'Facebook Business',
      description: 'Social media platform for advertising and customer engagement',
      icon: '👥',
      status: 'disconnected',
      lastSync: 'Never',
      metrics: {
        reach: '0',
        engagement: '0%',
        ads_spent: '₹0'
      },
      features: ['Ad Management', 'Page Insights', 'Messenger Integration', 'Audience Building']
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-emerald-600 bg-emerald-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'disconnected':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-slate-600 bg-slate-50'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      case 'disconnected':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length
  const totalIntegrations = integrations.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Integrations
              </h1>
              <p className="text-slate-600 mt-1">Connect your favorite platforms and tools</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-medium text-sm">
                  {connectedIntegrations}/{totalIntegrations} Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{connectedIntegrations}</span>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Active Integrations</p>
              <p className="text-xs text-slate-500 mt-1">Real-time data sync enabled</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-50 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">99.9%</span>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Uptime</p>
              <p className="text-xs text-slate-500 mt-1">Last 30 days reliability</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">2.3M</span>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Data Points</p>
              <p className="text-xs text-slate-500 mt-1">Synced this month</p>
            </div>
          </div>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{integration.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{integration.name}</h3>
                    <p className="text-sm text-slate-600">{integration.description}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                  {getStatusIcon(integration.status)}
                  <span className="capitalize">{integration.status}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {Object.entries(integration.metrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-bold text-slate-900">{value}</div>
                    <div className="text-xs text-slate-600 capitalize">{key.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Features:</p>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature, index) => (
                    <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Last sync: {integration.lastSync}
                </div>
                <div className="flex items-center space-x-2">
                  {integration.status === 'connected' && (
                    <button className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 text-xs">
                      <Settings className="h-3 w-3" />
                      <span>Configure</span>
                    </button>
                  )}
                  {integration.status !== 'connected' && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium">
                      Connect
                    </button>
                  )}
                  <button className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 text-xs">
                    <ExternalLink className="h-3 w-3" />
                    <span>Docs</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Benefits */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Why Connect Your Platforms?</h2>
            <p className="text-blue-100 mb-6">
              Integrations enable Convexa AI to provide personalized experiences across all customer touchpoints
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2">Better Targeting</h3>
                <p className="text-sm text-blue-100">
                  Unified customer data enables precise audience segmentation
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold mb-2">Smarter AI</h3>
                <p className="text-sm text-blue-100">
                  More data sources mean more intelligent personalization
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold mb-2">Higher ROI</h3>
                <p className="text-sm text-blue-100">
                  Cross-platform insights drive better campaign performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Integrations