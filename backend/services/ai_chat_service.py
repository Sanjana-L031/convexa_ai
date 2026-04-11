"""
Real-Time AI Chat Service for Convexa AI
Handles 2-way conversations with customers
"""

import openai
import os
from datetime import datetime
import json
import random

class AIChatService:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        # Mock conversation context for demo
        self.conversation_contexts = {}
        
    def get_ai_response(self, user_message, user_data, conversation_id=None):
        """Generate AI response based on user message and context"""
        
        # Create conversation context
        context = self._build_context(user_data, user_message)
        
        # For demo purposes, use smart rule-based responses
        # In production, this would use OpenAI API
        response = self._generate_smart_response(user_message, user_data, context)
        
        # Store conversation
        if conversation_id:
            self._store_conversation(conversation_id, user_message, response, user_data)
        
        return {
            'response': response,
            'timestamp': datetime.now().isoformat(),
            'context': context,
            'suggested_actions': self._get_suggested_actions(user_message, user_data)
        }
    
    def _build_context(self, user_data, user_message):
        """Build conversation context"""
        return {
            'user_segment': user_data.get('segment', 'unknown'),
            'total_spent': user_data.get('total_spent', 0),
            'cart_items': user_data.get('cart_items', []),
            'last_purchase': user_data.get('last_purchase_date'),
            'message_intent': self._analyze_intent(user_message),
            'urgency_level': self._calculate_urgency(user_message),
            'sentiment': self._analyze_sentiment(user_message)
        }
    
    def _generate_smart_response(self, user_message, user_data, context):
        """Generate contextual AI response"""
        message_lower = user_message.lower()
        user_name = user_data.get('name', 'there')
        segment = context['user_segment']
        total_spent = context['total_spent']
        
        # Price objection responses
        if any(word in message_lower for word in ['expensive', 'costly', 'price', 'cheap', 'afford']):
            if segment == 'high_value' or total_spent > 1000:
                return f"Hi {user_name}! I understand price is important. As a valued customer, I can offer you an exclusive 20% discount right now. Plus, you'll earn double loyalty points! 💎"
            else:
                return f"Hey {user_name}! I hear you on the price. How about 15% off today? We also have a payment plan option that might work better for you! 💳"
        
        # Interest/browsing responses
        elif any(word in message_lower for word in ['interested', 'looking', 'want', 'need', 'show']):
            cart_items = context.get('cart_items', [])
            if cart_items:
                return f"Perfect timing {user_name}! I see you have {', '.join(cart_items[:2])} in your cart. I can get you 10% off if you complete your order in the next hour! ⏰"
            else:
                return f"Great to hear {user_name}! Based on your preferences, I think you'd love our premium collection. Want me to show you our top picks? ✨"
        
        # Complaint/issue responses
        elif any(word in message_lower for word in ['problem', 'issue', 'wrong', 'bad', 'disappointed']):
            return f"I'm really sorry to hear that {user_name}. Let me make this right immediately. I'm escalating this to our priority support team and adding a 25% credit to your account. 🛠️"
        
        # Positive responses
        elif any(word in message_lower for word in ['good', 'great', 'love', 'awesome', 'perfect']):
            return f"So happy to hear that {user_name}! 🎉 Since you're loving the experience, would you like early access to our new arrivals? I can set that up for you right now!"
        
        # Question responses
        elif '?' in user_message:
            return f"Great question {user_name}! Let me get you the exact information you need. Based on your purchase history, I think you'll find this helpful... 🤔"
        
        # Default personalized response
        else:
            if segment == 'high_value':
                return f"Thanks for reaching out {user_name}! As one of our VIP customers, you always get priority support. How can I make your day better? 🌟"
            elif segment == 'abandoned_cart':
                return f"Hi {user_name}! I noticed you left some items in your cart. No worries - I've saved them for you! Want to complete your order with a special discount? 🛒"
            else:
                return f"Hello {user_name}! Thanks for your message. I'm here to help make your shopping experience amazing. What can I do for you today? 😊"
    
    def _analyze_intent(self, message):
        """Analyze user message intent"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['buy', 'purchase', 'order', 'checkout']):
            return 'purchase_intent'
        elif any(word in message_lower for word in ['expensive', 'price', 'cost', 'cheap']):
            return 'price_concern'
        elif any(word in message_lower for word in ['help', 'support', 'problem', 'issue']):
            return 'support_needed'
        elif any(word in message_lower for word in ['info', 'details', 'tell', 'about']):
            return 'information_seeking'
        else:
            return 'general_inquiry'
    
    def _analyze_sentiment(self, message):
        """Simple sentiment analysis"""
        positive_words = ['good', 'great', 'love', 'awesome', 'perfect', 'amazing', 'excellent']
        negative_words = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'angry', 'frustrated']
        
        message_lower = message.lower()
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    def _calculate_urgency(self, message):
        """Calculate message urgency level"""
        urgent_words = ['urgent', 'asap', 'immediately', 'now', 'quick', 'fast', 'emergency']
        message_lower = message.lower()
        
        urgency_score = sum(1 for word in urgent_words if word in message_lower)
        
        if urgency_score > 0:
            return 'high'
        elif '!' in message or message.isupper():
            return 'medium'
        else:
            return 'low'
    
    def _get_suggested_actions(self, user_message, user_data):
        """Get suggested actions for the conversation"""
        actions = []
        message_lower = user_message.lower()
        
        if 'expensive' in message_lower:
            actions.append({
                'type': 'discount',
                'label': 'Apply 15% Discount',
                'action': 'apply_discount',
                'value': 15
            })
        
        if any(word in message_lower for word in ['interested', 'want', 'need']):
            actions.append({
                'type': 'recommendation',
                'label': 'Send Product Recommendations',
                'action': 'send_recommendations'
            })
        
        if user_data.get('cart_items'):
            actions.append({
                'type': 'cart_recovery',
                'label': 'Send Cart Recovery',
                'action': 'recover_cart'
            })
        
        return actions
    
    def _store_conversation(self, conversation_id, user_message, ai_response, user_data):
        """Store conversation for analytics"""
        if conversation_id not in self.conversation_contexts:
            self.conversation_contexts[conversation_id] = []
        
        self.conversation_contexts[conversation_id].append({
            'timestamp': datetime.now().isoformat(),
            'user_message': user_message,
            'ai_response': ai_response,
            'user_data': user_data
        })
    
    def get_conversation_history(self, conversation_id):
        """Get conversation history"""
        return self.conversation_contexts.get(conversation_id, [])
    
    def get_best_send_time(self, user_data):
        """Predict best time to send message"""
        # Mock AI prediction based on user behavior
        segment = user_data.get('segment', 'unknown')
        total_spent = user_data.get('total_spent', 0)
        
        # Smart time prediction based on segment
        if segment == 'high_value':
            return {
                'best_time': '8:30 PM',
                'confidence': 0.89,
                'reason': 'High-value customers typically check messages after work',
                'timezone': 'IST',
                'day_preference': 'Weekdays'
            }
        elif segment == 'abandoned_cart':
            return {
                'best_time': '2:00 PM',
                'confidence': 0.76,
                'reason': 'Cart abandoners respond well to lunch-time reminders',
                'timezone': 'IST',
                'day_preference': 'Weekends'
            }
        else:
            return {
                'best_time': '7:00 PM',
                'confidence': 0.65,
                'reason': 'General users are most active in early evening',
                'timezone': 'IST',
                'day_preference': 'Any day'
            }

# Initialize AI chat service
ai_chat_service = AIChatService()