import React, { useState } from 'react'
import { Zap, Users, Target, MessageSquare, CheckCircle } from 'lucide-react'
import { triggerCampaign } from '../services/api'

const Campaign = () => {
  const [selectedAudience, setSelectedAudience] = useState('')
  const [campaignGoal, setCampaignGoal] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [campaignResult, setCampaignResult] = useState(null)
  const [messagePreview, setMessagePreview] = useState('')

  const audiences = [
    { id: 'high_value', name: 'High Value Users 💰', description: 'Users with high purchase history' },
    { id: 'abandoned_cart', name: 'Abandoned Cart Users 🛒', description: 'Users who left items in cart' },
    { id: 'inactive', name: 'Inactive Users 😴', description: 'Users who haven\'t engaged recently' }
  ]

  const handleRunCampaign = async () => {
    if (!selectedAudience || !campaignGoal) {
      alert('Please select audience and enter campaign goal')
      return
    }

    setIsRunning(true)
    try {
      const result = await triggerCampaign({
        audience: selectedAudience,
        goal: campaignGoal
      })
      setCampaignResult(result)
      setMessagePreview(result.sampleMessage)
    } catch (error) {
      console.error('Campaign failed:', error)
      alert('Campaign failed. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campaign Builder</h1>
        <p className="text-gray-600">Create AI-powered personalized marketing campaigns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campaign Setup */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Campaign Setup
          </h2>

          {/* Audience Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Target Audience
            </label>
            <div className="space-y-3">
              {audiences.map((audience) => (
                <div
                  key={audience.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAudience === audience.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAudience(audience.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedAudience === audience.id}
                      onChange={() => setSelectedAudience(audience.id)}
                      className="mr-3"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{audience.name}</h3>
                      <p className="text-sm text-gray-600">{audience.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Goal */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Goal
            </label>
            <textarea
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              placeholder="e.g., Increase sales for winter collection, Re-engage inactive users with special offers..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Run Campaign Button */}
          <button
            onClick={handleRunCampaign}
            disabled={isRunning || !selectedAudience || !campaignGoal}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Running Campaign...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Run AI Campaign
              </>
            )}
          </button>
        </div>

        {/* Message Preview & Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Campaign Preview
          </h2>

          {messagePreview && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">AI Generated Message Sample:</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-800">{messagePreview}</p>
              </div>
            </div>
          )}

          {campaignResult && (
            <div className="space-y-4">
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span className="font-medium">Campaign Sent Successfully!</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Messages Sent</p>
                  <p className="text-2xl font-bold text-blue-900">{campaignResult.messagesSent}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Estimated Reach</p>
                  <p className="text-2xl font-bold text-green-900">{campaignResult.estimatedReach}</p>
                </div>
              </div>

              {/* Mock WhatsApp Preview */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">WhatsApp Delivery Status:</h3>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">📱 Mock WhatsApp Integration</span>
                    <span className="text-green-600 font-medium">Delivered ✅</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Messages delivered to {campaignResult.messagesSent} users via WhatsApp Business API
                  </p>
                </div>
              </div>
            </div>
          )}

          {!messagePreview && !campaignResult && (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Configure your campaign to see AI-generated message preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Campaign