import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { sendChatMessage, getChatHistory } from '../services/api'

const CustomerChat = ({ customer }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChatHistory = async () => {
    try {
      const response = await getChatHistory()
      if (response.success) {
        setMessages(response.messages)
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error)
      // Mock chat history for demo
      setMessages([
        {
          id: 1,
          type: 'bot',
          message: `Hi ${customer?.name}! 👋 I'm your personal shopping assistant. How can I help you today?`,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          type: 'user',
          message: 'I\'m looking for a new phone',
          timestamp: new Date(Date.now() - 3500000).toISOString()
        },
        {
          id: 3,
          type: 'bot',
          message: 'Great choice! Based on your previous purchases, I\'d recommend the iPhone 15 Pro. It\'s currently in your cart! Would you like to see some accessories that go perfectly with it?',
          timestamp: new Date(Date.now() - 3400000).toISOString(),
          suggestions: ['Show accessories', 'Compare phones', 'Check deals']
        }
      ])
    }
  }

  const handleSendMessage = async (messageText = null) => {
    const messageToSend = messageText || newMessage.trim()
    if (!messageToSend) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: messageToSend,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setLoading(true)
    setTyping(true)

    try {
      const response = await sendChatMessage(messageToSend)
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: response.reply || generateBotResponse(messageToSend, customer),
          timestamp: new Date().toISOString(),
          suggestions: response.suggestions || generateSuggestions(messageToSend)
        }
        setMessages(prev => [...prev, botMessage])
        setTyping(false)
      }, 1500)
    } catch (error) {
      console.error('Failed to send message:', error)
      // Fallback bot response
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: generateBotResponse(messageToSend, customer),
          timestamp: new Date().toISOString(),
          suggestions: generateSuggestions(messageToSend)
        }
        setMessages(prev => [...prev, botMessage])
        setTyping(false)
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  const generateBotResponse = (userMessage, customer) => {
    const message = userMessage.toLowerCase()
    const name = customer?.name || 'there'
    
    if (message.includes('expensive') || message.includes('price') || message.includes('cost')) {
      return `I understand price is important, ${name}! As a valued customer, I can offer you a special 20% discount on your current cart. Would you like me to apply it? 💎`
    }
    
    if (message.includes('help') || message.includes('support')) {
      return `I'm here to help, ${name}! I can assist you with product recommendations, order tracking, or any questions about your account. What would you like to know? 😊`
    }
    
    if (message.includes('recommend') || message.includes('suggest')) {
      return `Based on your shopping history, I'd recommend checking out our latest electronics collection. You seem to love premium tech products! Should I show you some exclusive deals? ⚡`
    }
    
    if (message.includes('order') || message.includes('delivery')) {
      return `Your recent orders are doing great! I can track any shipments or help you with returns. Is there a specific order you'd like me to check? 📦`
    }
    
    return `Thanks for your message, ${name}! I'm analyzing your preferences to give you the best personalized response. Meanwhile, would you like to see your exclusive offers or check your cart? 🛒`
  }

  const generateSuggestions = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('expensive') || message.includes('price')) {
      return ['Apply discount', 'Show cheaper options', 'View payment plans']
    }
    
    if (message.includes('help')) {
      return ['Track order', 'Return policy', 'Contact support']
    }
    
    if (message.includes('recommend')) {
      return ['Show deals', 'View wishlist', 'Browse categories']
    }
    
    return ['View cart', 'Check offers', 'Browse products']
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Shopping Assistant</h1>
            <p className="text-gray-600">Get personalized help and recommendations</p>
          </div>
          <div className="ml-auto flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 text-sm font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-end space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs hover:bg-blue-100 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !newMessage.trim()}
              className="btn-primary px-4"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerChat