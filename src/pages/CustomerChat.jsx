import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'

const CustomerChat = ({ user }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        message: `Hi ${user?.name}! 👋 I'm your personal shopping assistant. How can I help you today?`,
        timestamp: new Date().toISOString(),
        suggestions: ['View my cart', 'Show offers', 'Track orders']
      }
    ])
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: generateBotResponse(messageToSend, user),
        timestamp: new Date().toISOString(),
        suggestions: generateSuggestions(messageToSend)
      }
      setMessages(prev => [...prev, botMessage])
      setTyping(false)
      setLoading(false)
    }, 1500)
  }

  const generateBotResponse = (userMessage, user) => {
    const message = userMessage.toLowerCase()
    const name = user?.name || 'there'
    
    if (message.includes('expensive') || message.includes('price') || message.includes('cost')) {
      return `I understand price is important, ${name}! As a valued ${user?.segment || 'customer'}, I can offer you a special 20% discount on your current cart. Would you like me to apply it? 💎`
    }
    
    if (message.includes('cart')) {
      const cartItems = user?.cart_items || []
      if (cartItems.length > 0) {
        return `You have ${cartItems.length} items in your cart: ${cartItems.join(', ')}. Ready to checkout or need help with anything else? 🛒`
      } else {
        return `Your cart is currently empty, ${name}. Would you like me to show you some personalized recommendations based on your preferences? ✨`
      }
    }
    
    if (message.includes('offer') || message.includes('deal') || message.includes('discount')) {
      return `Great news, ${name}! I have some exclusive offers for you as a ${user?.segment || 'valued customer'}. You can save up to 25% on electronics. Should I show you the details? 🎁`
    }
    
    if (message.includes('help') || message.includes('support')) {
      return `I'm here to help, ${name}! I can assist you with product recommendations, order tracking, exclusive offers, or any questions about your account. What would you like to know? 😊`
    }
    
    if (message.includes('recommend') || message.includes('suggest')) {
      return `Based on your shopping history, I'd recommend checking out our latest electronics collection. You seem to love premium tech products! Should I show you some exclusive deals? ⚡`
    }
    
    if (message.includes('order') || message.includes('delivery') || message.includes('track')) {
      return `I can help you track your orders, ${name}! Your recent purchases are doing great. Is there a specific order you'd like me to check? 📦`
    }
    
    return `Thanks for your message, ${name}! I'm analyzing your preferences to give you the best personalized response. As a ${user?.segment || 'valued customer'}, you deserve the best service. How can I assist you today? 🌟`
  }

  const generateSuggestions = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('expensive') || message.includes('price')) {
      return ['Apply discount', 'Show cheaper options', 'View payment plans']
    }
    
    if (message.includes('cart')) {
      return ['Checkout now', 'Add more items', 'Apply coupon']
    }
    
    if (message.includes('offer')) {
      return ['Show all offers', 'Apply best deal', 'Save for later']
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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col" style={{ height: '800px' }}>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg lg:max-w-xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-end space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className={`px-5 py-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-base leading-relaxed">{message.message}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-100 transition-colors font-medium"
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
              <div className="flex items-end space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="bg-gray-100 px-5 py-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-5 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !newMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
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