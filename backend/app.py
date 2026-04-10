from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from datetime import datetime, timedelta
import random
import json

app = Flask(__name__)
CORS(app)

# Configure OpenAI (you'll need to set your API key)
# openai.api_key = os.getenv('OPENAI_API_KEY')

# Mock database - in production, use Supabase
mock_users = [
    {
        "id": 1,
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "segment": "high_value",
        "cart_items": ["iPhone 15", "AirPods"],
        "behavior": {"purchases": 5, "avg_order": 500, "last_purchase": "2024-04-05"},
        "total_spent": 2500
    },
    {
        "id": 2,
        "name": "Priya Patel", 
        "email": "priya@example.com",
        "segment": "abandoned_cart",
        "cart_items": ["Laptop", "Mouse"],
        "behavior": {"purchases": 2, "avg_order": 225, "last_purchase": "2024-03-20"},
        "total_spent": 450
    },
    {
        "id": 3,
        "name": "Amit Kumar",
        "email": "amit@example.com", 
        "segment": "inactive",
        "cart_items": [],
        "behavior": {"purchases": 1, "avg_order": 120, "last_purchase": "2024-02-10"},
        "total_spent": 120
    }
]

mock_campaigns = []

def generate_ai_message(user_data, campaign_goal):
    """Generate personalized message using AI logic"""
    
    # Mock AI message generation (replace with actual OpenAI call)
    templates = {
        "high_value": f"🌟 Hi {user_data['name']}! As our VIP customer, enjoy exclusive 25% off premium items. Your loyalty means everything! 💎",
        "abandoned_cart": f"🛒 Hi {user_data['name']}! Your {', '.join(user_data['cart_items'][:2])} are waiting. Complete purchase with 15% off! ⏰",
        "inactive": f"👋 We miss you {user_data['name']}! Come back with 20% off your next order. Discover what's new! 🎉"
    }
    
    base_message = templates.get(user_data['segment'], templates['high_value'])
    
    # Add personalization based on behavior
    if user_data['behavior']['purchases'] > 3:
        base_message += f" You've saved ${user_data['behavior']['purchases'] * 50} with us!"
    
    return base_message

def segment_users():
    """ML logic for user segmentation"""
    segmented = {"high_value": [], "abandoned_cart": [], "inactive": []}
    
    for user in mock_users:
        if user['total_spent'] > 1000:
            user['segment'] = 'high_value'
            segmented['high_value'].append(user)
        elif len(user['cart_items']) > 0:
            user['segment'] = 'abandoned_cart' 
            segmented['abandoned_cart'].append(user)
        else:
            user['segment'] = 'inactive'
            segmented['inactive'].append(user)
    
    return segmented

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics dashboard data"""
    
    # Calculate metrics from mock data
    total_revenue = sum(user['total_spent'] for user in mock_users)
    total_messages = len(mock_campaigns) * 100  # Mock calculation
    conversion_rate = 12.5  # Mock rate
    total_users = len(mock_users)
    
    # Generate mock time series data
    revenue_data = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=6-i)).strftime('%Y-%m-%d')
        revenue = random.randint(10000, 25000)
        revenue_data.append({"date": date, "revenue": revenue})
    
    # Campaign performance by segment
    segments = segment_users()
    campaign_data = []
    for segment, users in segments.items():
        campaign_data.append({
            "segment": segment.replace('_', ' ').title(),
            "messages": len(users) * 50,
            "conversions": len(users) * random.randint(5, 15)
        })
    
    return jsonify({
        "revenue": total_revenue,
        "messagesSent": total_messages,
        "conversionRate": conversion_rate,
        "totalUsers": total_users,
        "revenueData": revenue_data,
        "campaignData": campaign_data
    })

@app.route('/api/campaign/trigger', methods=['POST'])
def trigger_campaign():
    """Trigger AI-powered marketing campaign"""
    
    data = request.json
    audience = data.get('audience')
    goal = data.get('goal')
    
    # Get users for selected audience
    segments = segment_users()
    target_users = segments.get(audience, [])
    
    if not target_users:
        return jsonify({"error": "No users found for selected audience"}), 400
    
    # Generate personalized messages for each user
    campaign_results = []
    for user in target_users:
        message = generate_ai_message(user, goal)
        
        # Store campaign result (mock database)
        campaign_result = {
            "user_id": user['id'],
            "name": user['name'],
            "segment": audience,
            "message": message,
            "status": "sent",
            "timestamp": datetime.now().isoformat()
        }
        campaign_results.append(campaign_result)
    
    # Store campaign
    campaign = {
        "id": len(mock_campaigns) + 1,
        "audience": audience,
        "goal": goal,
        "results": campaign_results,
        "timestamp": datetime.now().isoformat(),
        "messages_sent": len(campaign_results)
    }
    mock_campaigns.append(campaign)
    
    # Mock WhatsApp delivery simulation
    messages_sent = len(campaign_results)
    estimated_reach = int(messages_sent * 0.85)  # 85% delivery rate
    
    # Return sample message for preview
    sample_message = campaign_results[0]['message'] if campaign_results else "No message generated"
    
    return jsonify({
        "success": True,
        "messagesSent": messages_sent,
        "estimatedReach": estimated_reach,
        "sampleMessage": sample_message,
        "campaignId": campaign['id']
    })

@app.route('/api/campaign/history', methods=['GET'])
def get_campaign_history():
    """Get campaign history"""
    
    # Mock campaign history
    history = [
        {
            "id": 1,
            "name": "Winter Sale Campaign",
            "audience": "High Value",
            "messagesSent": 1250,
            "conversions": 89,
            "revenue": 15600,
            "date": "2024-04-09",
            "status": "completed",
            "conversionRate": 7.1
        },
        {
            "id": 2,
            "name": "Cart Recovery Campaign", 
            "audience": "Abandoned Cart",
            "messagesSent": 890,
            "conversions": 156,
            "revenue": 8900,
            "date": "2024-04-08", 
            "status": "completed",
            "conversionRate": 17.5
        }
    ]
    
    return jsonify(history)

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get user list with segments"""
    return jsonify(mock_users)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)