import React, { useState, useEffect } from 'react'
import { Zap, Clock, Target, Brain, TrendingUp, Eye } from 'lucide-react'
import { getLivePersonalization } from '../services/api'

const LivePersonalization = ({ selectedUser }) => {
  const [cartValue, setCartValue] = useState(1000)
  const [tone, setTone] = useState('casual')
  const [behaviorData, setBehaviorData] = useState({
    time_on_page: 180,
    pages_visited: 3,
    items_viewed: 2
  })
  const [personalizationResult, setPersonalizationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedUser) {
      generateLivePersonalization()
    }
  }, [cartValue, tone, behaviorData, selectedUser])

  const generateLivePersonalization = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      const data = await getLivePersonalization(selectedUser.id, cartValue, { ...behaviorData, tone })
      if (data.success) {
        setPersonalizationResult(data)
      }
    } catch (error) {
      console.error('Live personalization error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBehavior = (key, value) => {
    setBehaviorData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getCartTier = (value) => {
    if (value < 500) return { tier: 'Browser', color: 'text-gray-600', bg: 'bg-gray-100' }
    if (value < 2000) return { tier: 'Interested', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (value < 5000) return { tier: 'Committed', color: 'text-purple-600', bg: 'bg-purple-100' }
    return { tier: 'Premium', color: 'text-gold-600', bg: 'bg-yellow-100' }
  }

  const getBehaviorScore = () => {
    const score = Math.min(
      (behaviorData.time_on_page / 60) * 10 +
      behaviorData.pages_visited * 2 +
      behaviorData.items_viewed * 5,
      100
    )
    return Math.round(score)
  }

  if (!selectedUser) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Select a user to see live personalization</p>
      </div>
    )
  }

  const cartTier = getCartTier(cartValue)
  const behaviorScore = getBehaviorScore()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Live Personalization Engine</h3>
          <p className="text-sm text-gray-600">Real-time message adaptation for {selectedUser.name}</p>
        </div>
      </div>

      {/* Live Controls */}
      <div className="space-y-6">
        {/* Cart Value Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Cart Value</label>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cartTier.bg} ${cartTier.color}`}>
                {cartTier.tier}
              </span>
              <span className="text-lg font-bold text-gray-900">₹{cartValue.toLocaleString()}</span>
            </div>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={cartValue}
            onChange={(e) => setCartValue(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹100</span>
            <span>₹10,000</span>
          </div>
        </div>

        {/* Tone Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Message Tone</label>
          <div className="flex gap-3">
            <button
              onClick={() => setTone('casual')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                tone === 'casual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              😊 Casual
            </button>
            <button
              onClick={() => setTone('formal')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                tone === 'formal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎩 Formal
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {tone === 'casual' 
              ? 'Friendly, conversational messaging style' 
              : 'Professional, business-appropriate tone'
            }
          </p>
        </div>

        {/* Behavior Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Time on Page</label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <input
                type="range"
                min="30"
                max="600"
                step="30"
                value={behaviorData.time_on_page}
                onChange={(e) => updateBehavior('time_on_page', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">{Math.round(behaviorData.time_on_page / 60)}m</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Pages Visited</label>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-400" />
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={behaviorData.pages_visited}
                onChange={(e) => updateBehavior('pages_visited', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">{behaviorData.pages_visited}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Items Viewed</label>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={behaviorData.items_viewed}
                onChange={(e) => updateBehavior('items_viewed', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">{behaviorData.items_viewed}</span>
            </div>
          </div>
        </div>

        {/* Behavior Score */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Engagement Score</span>
            <span className="text-2xl font-bold text-purple-600">{behaviorScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${behaviorScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Live Personalization Result */}
      {personalizationResult && (
        <div className="mt-6 space-y-4">
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Live Personalized Message
            </h4>
            
            {isLoading ? (
              <div className="animate-pulse bg-gray-100 rounded-lg p-4 h-20"></div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-800 font-medium">
                  {personalizationResult.personalized_message.message}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {personalizationResult.personalized_message.urgency}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {personalizationResult.personalized_message.discount}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Send Time Prediction */}
          {personalizationResult.send_time_prediction && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                Best Send Time Prediction
              </h5>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-yellow-700">
                    {personalizationResult.send_time_prediction.best_time}
                  </p>
                  <p className="text-sm text-gray-600">
                    {personalizationResult.send_time_prediction.reason}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-lg font-bold text-yellow-700">
                    {Math.round(personalizationResult.send_time_prediction.confidence * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Explanation */}
          {personalizationResult.ai_explanation && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                Why This User? (Explainable AI)
              </h5>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Segment:</span>
                  <span className="font-medium text-purple-700">
                    {personalizationResult.ai_explanation.segment}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-gray-600">Reasons:</span>
                  <ul className="space-y-1">
                    {personalizationResult.ai_explanation.reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2 border-t border-purple-200">
                  <p className="text-sm text-gray-600">
                    <strong>Recommendation:</strong> {personalizationResult.ai_explanation.recommendation}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Next Action:</strong> {personalizationResult.ai_explanation.next_best_action}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}

export default LivePersonalization