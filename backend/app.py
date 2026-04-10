from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from datetime import datetime, timedelta
import random
import json
import bcrypt
import jwt

app = Flask(__name__)
CORS(app)

# Configure OpenAI (you'll need to set your API key)
# openai.api_key = os.getenv('OPENAI_API_KEY')

# Mock admin users for authentication
mock_admin_users = [
    {
        "id": 1,
        "name": "Admin User",
        "email": "admin@convexa.ai",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrmu.Iq",  # admin123
        "role": "admin"
    }
]

# JWT Configuration
JWT_SECRET_KEY = "convexa-ai-secret-key-2024"
JWT_ALGORITHM = "HS256"

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_token(user_data):
    """Generate JWT token"""
    payload = {
        'user_id': user_data['id'],
        'email': user_data['email'],
        'role': user_data.get('role', 'admin'),
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

# Authentication Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    """Admin login"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find admin user
        admin_user = None
        for user in mock_admin_users:
            if user['email'] == email:
                admin_user = user
                break
        
        if not admin_user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not verify_password(password, admin_user['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate token
        token = generate_token(admin_user)
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': admin_user['id'],
                'email': admin_user['email'],
                'name': admin_user['name'],
                'role': admin_user['role']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register new admin user"""
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'admin')
        
        if not all([name, email, password]):
            return jsonify({'error': 'Name, email and password required'}), 400
        
        # Check if user already exists
        for user in mock_admin_users:
            if user['email'] == email:
                return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        password_hash = hash_password(password)
        
        # Create user
        new_user = {
            'id': len(mock_admin_users) + 1,
            'name': name,
            'email': email,
            'password_hash': password_hash,
            'role': role
        }
        
        mock_admin_users.append(new_user)
        
        # Generate token
        token = generate_token(new_user)
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': new_user['id'],
                'email': new_user['email'],
                'name': new_user['name'],
                'role': new_user['role']
            }
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    segment_insights = {}
    
    for segment, users in segments.items():
        campaign_data.append({
            "segment": segment.replace('_', ' ').title(),
            "messages": len(users) * 50,
            "conversions": len(users) * random.randint(5, 15)
        })
        
        # Calculate segment insights
        segment_insights[segment] = {
            'count': len(users),
            'total_revenue': sum(user['total_spent'] for user in users),
            'avg_revenue_per_user': sum(user['total_spent'] for user in users) / max(len(users), 1)
        }
    
    return jsonify({
        "success": True,
        "revenue": total_revenue,
        "messagesSent": total_messages,
        "conversionRate": conversion_rate,
        "totalUsers": total_users,
        "revenueData": revenue_data,
        "campaignData": campaign_data,
        "segmentInsights": segment_insights
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
            "messages_sent": 1250,
            "conversions": 89,
            "revenue": 15600,
            "created_at": "2024-04-09T10:30:00Z",
            "status": "completed",
            "conversion_rate": 7.1
        },
        {
            "id": 2,
            "name": "Cart Recovery Campaign", 
            "audience": "Abandoned Cart",
            "messages_sent": 890,
            "conversions": 156,
            "revenue": 8900,
            "created_at": "2024-04-08T14:15:00Z", 
            "status": "completed",
            "conversion_rate": 17.5
        },
        {
            "id": 3,
            "name": "Re-engagement Campaign",
            "audience": "Inactive",
            "messages_sent": 2100,
            "conversions": 67,
            "revenue": 3400,
            "created_at": "2024-04-07T16:45:00Z",
            "status": "completed",
            "conversion_rate": 3.2
        }
    ]
    
    return jsonify({
        'success': True,
        'campaigns': history
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get user list with segments"""
    # Apply ML-like segmentation
    segmented_users = []
    for user in mock_users:
        user_copy = user.copy()
        
        # Add segment labels and emojis
        segment_mapping = {
            'high_value': {'label': 'High Value', 'emoji': '💰'},
            'abandoned_cart': {'label': 'Abandoned Cart', 'emoji': '🛒'},
            'inactive': {'label': 'Inactive', 'emoji': '😴'}
        }
        
        segment_info = segment_mapping.get(user['segment'], {'label': 'Customer', 'emoji': '👤'})
        user_copy['segment_label'] = segment_info['label']
        user_copy['segment_emoji'] = segment_info['emoji']
        user_copy['segment_confidence'] = round(random.uniform(0.7, 0.95), 2)
        
        segmented_users.append(user_copy)
    
    return jsonify({
        'success': True,
        'users': segmented_users,
        'total_count': len(segmented_users)
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route("/")
def home():
    return "Convexa AI Backend is running! 🚀"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
