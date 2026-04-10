import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, Users, MessageSquare, DollarSign, Target, Zap, Award, Activity } from 'lucide-react'
import { getAnalytics } from '../services/api'

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    revenue: 0,
    messagesSent: 0,
    conversionRate: 0,
    totalUsers: 0,
    revenueData: [],
    campaignData: [],
    segmentInsights: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const kpis = [
    {
      name: 'Total Revenue',
      value: `$${analytics.revenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      name: 'Messages Sent',
      value: analytics.messagesSent.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      name: 'Active Users',
      value: analytics.totalUsers.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ]

  const segmentColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']

  const segmentData = Object.entries(analytics.segmentInsights || {}).map(([key, value], index) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: value.count,
    revenue: value.total_revenue,
    color: segmentColors[index % segmentColors.length]
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-slate-600 mt-1">AI-powered ecommerce engagement insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
                <Activity className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-medium text-sm">Live Data</span>
              </div>
              <button 
                onClick={fetchAnalytics}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div key={kpi.name} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${kpi.bgColor} p-3 rounded-xl`}>
                    <Icon className={`h-6 w-6 ${kpi.iconColor}`} />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    kpi.changeType === 'positive' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {kpi.change}
                  </div>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">{kpi.name}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Revenue Trend</h3>
                <p className="text-slate-600 text-sm">Last 7 days performance</p>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-medium text-sm">+12.5%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Segments */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900">User Segments</h3>
              <p className="text-slate-600 text-sm">ML-powered segmentation</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {segmentData.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <span className="text-sm font-medium text-slate-700">{segment.name}</span>
                  </div>
                  <span className="text-sm text-slate-600">{segment.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Campaign Performance</h3>
              <p className="text-slate-600 text-sm">Messages sent vs conversions by segment</p>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">AI Optimized</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.campaignData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="segment" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="messages" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-blue-100" />
              <span className="bg-blue-400 bg-opacity-30 px-2 py-1 rounded-full text-xs font-medium">
                Top Performer
              </span>
            </div>
            <h4 className="text-lg font-semibold mb-2">Best Converting Segment</h4>
            <p className="text-blue-100 text-sm mb-3">High Value users show 23% higher conversion rates</p>
            <div className="text-2xl font-bold">High Value 💰</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-emerald-100" />
              <span className="bg-emerald-400 bg-opacity-30 px-2 py-1 rounded-full text-xs font-medium">
                Growth
              </span>
            </div>
            <h4 className="text-lg font-semibold mb-2">Revenue Growth</h4>
            <p className="text-emerald-100 text-sm mb-3">Month-over-month revenue increase</p>
            <div className="text-2xl font-bold">+24.5%</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-8 w-8 text-purple-100" />
              <span className="bg-purple-400 bg-opacity-30 px-2 py-1 rounded-full text-xs font-medium">
                AI Powered
              </span>
            </div>
            <h4 className="text-lg font-semibold mb-2">Personalization Score</h4>
            <p className="text-purple-100 text-sm mb-3">AI-driven message personalization effectiveness</p>
            <div className="text-2xl font-bold">94.2%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard