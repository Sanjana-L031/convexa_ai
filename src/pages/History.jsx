import React, { useState, useEffect } from 'react'
import { History as HistoryIcon, MessageSquare, Users, Calendar, TrendingUp, RefreshCw, Activity } from 'lucide-react'
import { getCampaignHistory } from '../services/api'

const History = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaignHistory()
  }, [])

  const fetchCampaignHistory = async () => {
    try {
      setLoading(true)
      const data = await getCampaignHistory()
      if (data.success) {
        setCampaigns(data.campaigns)
      }
    } catch (error) {
      console.error('Failed to fetch campaign history:', error)
      // Mock data for demo
      setCampaigns([
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
        },
        {
          id: 3,
          name: 'Re-engagement Campaign',
          audience: 'Inactive',
          messages_sent: 2100,
          conversions: 67,
          revenue: 3400,
          created_at: '2024-04-07T16:45:00Z',
          status: 'completed',
          conversion_rate: 3.2
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getAudienceEmoji = (audience) => {
    switch (audience) {
      case 'High Value':
        return '💰'
      case 'Abandoned Cart':
        return '🛒'
      case 'Inactive':
        return '😴'
      default:
        return '👥'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'running':
        return 'bg-blue-100 text-blue-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading campaign history...</p>
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
                Campaign History
              </h1>
              <p className="text-slate-600 mt-1">Track performance of your past marketing campaigns</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium text-sm">Campaign Analytics</span>
              </div>
              <button 
                onClick={fetchCampaignHistory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Total
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Messages</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {campaigns.reduce((sum, campaign) => sum + (campaign.messages_sent || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-50 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                Success
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Conversions</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {campaigns.reduce((sum, campaign) => sum + (campaign.conversions || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                Average
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Avg Conversion Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {campaigns.length > 0 ? (campaigns.reduce((sum, campaign) => sum + (campaign.conversion_rate || 0), 0) / campaigns.length).toFixed(1) : 0}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-50 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                Revenue
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                ${campaigns.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Campaign History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recent Campaigns</h2>
                <p className="text-slate-600 text-sm mt-1">Detailed performance metrics for all campaigns</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-full">
                <HistoryIcon className="h-4 w-4 text-slate-600" />
                <span className="text-slate-700 font-medium text-sm">{campaigns.length} Campaigns</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Audience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Messages Sent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{getAudienceEmoji(campaign.audience)}</span>
                        <span className="text-sm font-medium text-slate-900">{campaign.audience}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-900">
                      {campaign.messages_sent?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-900">
                      {campaign.conversions?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-900">
                      ${campaign.revenue?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        campaign.conversion_rate > 10 
                          ? 'bg-emerald-100 text-emerald-700'
                          : campaign.conversion_rate > 5
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {campaign.conversion_rate}%
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm text-slate-600">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-16">
              <HistoryIcon className="mx-auto h-16 w-16 text-slate-300 mb-6" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No campaign history available</h3>
              <p className="text-slate-600">Start creating campaigns to see their performance here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History