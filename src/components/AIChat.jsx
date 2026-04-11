import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, Bot, User, Zap, Clock, Target } from 'lucide-react'
import { sendChatMessage } from '../services/api'

const AIChat = ({ selectedUser, onClose }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [suggestedActions, setSuggestedActions] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (selectedUser) {
      // Initialize conversation with welcome message
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        message: `Hi! I'm your AI assistant. I can help ${selectedUser.name} with personalized offers and support. Try typing something like "This is too expensive" to see the magic! ✨`,
        timestamp: new Date().toISOString(),
        context: {
          user_segment: selectedUser.segment,
          sentiment: 'neutral'
        }
      }
      setMessages([welcomeMessage])
      setConversationId(`conv_${selectedUser.id}_${Date.now()}`)
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedUser) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const data = await sendChatMessage(inputMessage, selectedUser.id, conversationId)

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          message: data.ai_response,
          timestamp: data.timestamp,
          context: data.context,
          suggestedActions: data.suggested_actions
        }

        setTimeout(() => {
          setMessages(prev => [...prev, aiMessage])
          setSuggestedActions(data.suggested_actions || [])
          setIsTyping(false)
        }, 1000) // Simulate typing delay
      }
    } catch (error) {
      console.error('Chat error:', error)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const applySuggestedAction = async (action) => {
    const actionMessage = {
      id: Date.now(),
      type: 'system',
      message: `✅ Applied: ${action.label}`,
      timestamp: new Date().toISOString(),
      action: action
    }
    setMessages(prev => [...prev, actionMessage])
    setSuggestedActions([])
  }

  const getMessageIcon = (type, context) => {
    if (type === 'ai') {
      return <Bot className="h-6 w-6 text-blue-600" />
    } else if (type === 'system') {
      return <Zap className="h-6 w-6 text-green-600" />
    } else {
      return <User className="h-6 w-6 text-gray-600" />
    }
  }

  const getContextBadge = (context) => {
    if (!context) return null

    const { sentiment, urgency_level, message_intent } = context

    return (
      <div className="flex gap-1 mt-1">
        {sentiment && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            sentiment === 'positive' ? 'bg-green-100 text-green-700' :
            sentiment === 'negative' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {sentiment}
          </span>
        )}
        {urgency_level === 'high' && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
            🚨 Urgent
          </span>
        )}
        {message_intent && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {message_intent.replace('_', ' ')}
          </span>
        )}
      </div>
    )
  }

  if (!selectedUser) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Select a user to start AI conversation</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-600">Chatting with {selectedUser.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            selectedUser.segment === 'High Value' ? 'bg-green-100 text-green-800' :
            selectedUser.segment === 'Abandoned Cart' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {selectedUser.segment_emoji} {selectedUser.segment}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className="flex-shrink-0">
              {getMessageIcon(message.type, message.context)}
            </div>
            <div className={`flex-1 max-w-sm ${message.type === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'system'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.message}</p>
              </div>
              {getContextBadge(message.context)}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <Bot className="h-6 w-6 text-blue-600" />
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      {suggestedActions.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Suggested Actions:</p>
          <div className="flex gap-2 flex-wrap">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => applySuggestedAction(action)}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          💡 Try: "Too expensive", "I'm interested", "Tell me more", "I have a problem"
        </div>
      </div>
    </div>
  )
}

export default AIChat