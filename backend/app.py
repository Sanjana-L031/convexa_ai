from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import openai
import os
from datetime import datetime, timedelta
import random
import json
import bcrypt
import jwt
from models.db import db
from services.ml_segmentation import MLSegmentation
from services.ai_chat_service import ai_chat_service
from services.websocket_service import websocket_service

app = Flask(__name__)
app.config['SECRET_KEY'] = 'convexa-ai-secret-key-2024'
CORS(app, origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"])

# Initialize Socket.IO with proper configuration
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], 
                   async_mode='threading', logger=False, engineio_logger=False)

# Configure OpenAI (you'll need to set your API key)
# openai.api_key = os.getenv('OPENAI_API_KEY')

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
    from datetime import timezone
    
    payload = {
        'user_id': user_data.get('id'),
        'email': user_data.get('email'),
        'role': user_data.get('role', 'admin'),
        'exp': datetime.now(timezone.utc) + timedelta(hours=24),
        'iat': datetime.now(timezone.utc)
    }
    
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

# Mock admin users for authentication
mock_admin_users = [
    {
        "id": 1,
        "name": "Admin User",
        "email": "admin@convexa.ai",
        "password_hash": "$2b$12$PnK7I2.NpnEPDkIermTmiuK3ylrTrOy.lAf1xf3z2Y1I.SJlLNpmu",  # admin123
        "role": "admin"
    }
]

# Socket.IO Event Handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connection_status', {'connected': True})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_room')
def handle_join_room(data):
    room = data.get('room')
    if room:
        join_room(room)
        emit('joined_room', {'room': room})

# Customer Portal Routes
@app.route('/api/customer/login', methods=['POST'])
def customer_login():
    """Customer login endpoint"""
    try:
        data = request.json
        identifier = data.get('identifier')  # email or phone
        password = data.get('password')
        
        # Get users from database
        users = db.get_users()
        
        # Find user by email or phone
        user = None
        for u in users:
            if u.get('email') == identifier or u.get('phone') == identifier:
                user = u
                break
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        # For demo, accept any password or 'demo123'
        if password != 'demo123':
            return jsonify({'success': False, 'error': 'Invalid password'}), 401
        
        # Generate customer token
        customer_token = generate_token({
            'id': user.get('id'),
            'email': user.get('email'),
            'role': 'customer'
        })
        
        # Prepare customer data
        customer_data = {
            'id': user.get('id'),
            'name': user.get('name'),
            'email': user.get('email'),
            'phone': user.get('phone'),
            'segment': user.get('segment_label', user.get('segment')),
            'total_spent': user.get('total_spent', 0),
            'total_orders': user.get('total_orders', 0),
            'last_purchase_date': user.get('last_purchase_date')
        }
        
        return jsonify({
            'success': True,
            'customer': customer_data,
            'token': customer_token
        })
        
    except Exception as e:
        print(f"Customer login error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/register', methods=['POST'])
def customer_register():
    """Customer registration endpoint"""
    try:
        data = request.json
        # For demo, just return success
        return jsonify({
            'success': True,
            'message': 'Registration successful. Please login.'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/profile', methods=['GET'])
def get_customer_profile():
    """Get customer profile"""
    try:
        # Extract customer ID from token (simplified for demo)
        users = db.get_users()
        user = users[0] if users else None
        
        if not user:
            return jsonify({'success': False, 'error': 'Customer not found'}), 404
        
        return jsonify({
            'success': True,
            'customer': {
                'id': user.get('id'),
                'name': user.get('name'),
                'email': user.get('email'),
                'phone': user.get('phone'),
                'segment': user.get('segment_label', user.get('segment')),
                'total_spent': user.get('total_spent', 0),
                'total_orders': user.get('total_orders', 0)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/activity', methods=['GET'])
def get_customer_activity():
    """Get customer activity data"""
    try:
        users = db.get_users()
        user = users[0] if users else None
        
        activity = {
            'totalSpent': user.get('total_spent', 0) if user else 0,
            'totalOrders': user.get('total_orders', 0) if user else 0,
            'lastPurchase': user.get('last_purchase_date') if user else None,
            'favoriteCategory': 'Electronics',
            'loyaltyPoints': int((user.get('total_spent', 0) * 0.5)) if user else 0
        }
        
        return jsonify({
            'success': True,
            'activity': activity
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/cart', methods=['GET'])
def get_customer_cart():
    """Get customer cart items"""
    try:
        users = db.get_users()
        user = users[0] if users else None
        
        cart_items = []
        if user and user.get('cart_items'):
            for i, item_name in enumerate(user.get('cart_items', [])):
                cart_items.append({
                    'id': i + 1,
                    'name': item_name,
                    'price': 25000 + (i * 10000),  # Mock prices
                    'image': '📱' if 'phone' in item_name.lower() else '🎧' if 'airpods' in item_name.lower() else '💻',
                    'quantity': 1
                })
        
        return jsonify({
            'success': True,
            'items': cart_items
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/recommendations', methods=['GET'])
def get_customer_recommendations():
    """Get personalized recommendations"""
    try:
        recommendations = [
            {
                'id': 1,
                'name': 'MacBook Pro',
                'price': 199999,
                'image': '💻',
                'reason': 'Based on your recent purchases'
            },
            {
                'id': 2,
                'name': 'Apple Watch',
                'price': 41999,
                'image': '⌚',
                'reason': 'Customers like you also bought'
            },
            {
                'id': 3,
                'name': 'iPad Air',
                'price': 59999,
                'image': '📱',
                'reason': 'Perfect complement to your iPhone'
            }
        ]
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/chat', methods=['POST'])
def customer_chat():
    """Handle customer chat messages"""
    try:
        data = request.json
        message = data.get('message', '')
        
        # Generate AI response using existing chat service
        users = db.get_users()
        user = users[0] if users else None
        
        if user:
            response = ai_chat_service.generate_response(message, user)
            return jsonify({
                'success': True,
                'reply': response.get('message', 'Thank you for your message!'),
                'suggestions': response.get('suggestions', [])
            })
        else:
            return jsonify({
                'success': True,
                'reply': 'Thank you for your message! How can I help you today?',
                'suggestions': ['View offers', 'Check cart', 'Browse products']
            })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/chat/history', methods=['GET'])
def get_customer_chat_history():
    """Get customer chat history"""
    try:
        # Mock chat history for demo
        messages = [
            {
                'id': 1,
                'type': 'bot',
                'message': 'Hi there! 👋 I\'m your personal shopping assistant. How can I help you today?',
                'timestamp': datetime.now().isoformat()
            }
        ]
        
        return jsonify({
            'success': True,
            'messages': messages
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/offers', methods=['GET'])
def get_customer_offers():
    """Get personalized offers for customer"""
    try:
        # Mock offers for demo
        offers = [
            {
                'id': 1,
                'title': 'Exclusive VIP Discount',
                'description': 'Special 25% off on your next purchase',
                'discount': '25%',
                'type': 'percentage',
                'validUntil': '2024-04-20',
                'code': 'VIP25',
                'reason': 'You\'re a high-value customer',
                'priority': 'high',
                'used': False
            }
        ]
        
        return jsonify({
            'success': True,
            'offers': offers
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/customer/messages', methods=['GET'])
def get_customer_messages():
    """Get customer message history"""
    try:
        # Mock message history for demo
        messages = [
            {
                'id': 1,
                'type': 'campaign',
                'subject': 'Exclusive VIP Offer Just for You! 💎',
                'content': 'Hi there! As a valued customer, we\'re excited to offer you 25% off on your next purchase.',
                'sender': 'Convexa AI',
                'timestamp': datetime.now().isoformat(),
                'read': False,
                'platform': 'whatsapp'
            }
        ]
        
        return jsonify({
            'success': True,
            'messages': messages
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Convexa AI Backend is running'}), 200

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
        
        # Get admin user from database
        admin_user = db.get_admin_user_by_email(email)
        
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
        print(f"Login error: {e}")
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
        existing_user = db.get_admin_user_by_email(email)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        password_hash = hash_password(password)
        
        # Create user data
        user_data = {
            'name': name,
            'email': email,
            'password_hash': password_hash,
            'role': role
        }
        
        # Create user in database
        new_user = db.create_admin_user(user_data)
        if not new_user:
            return jsonify({'error': 'Failed to create user'}), 500
        
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
        print(f"Register error: {e}")
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
        "abandoned_cart": f"🛒 Hi {user_data['name']}! Your {', '.join(user_data.get('cart_items', [])[:2])} are waiting. Complete purchase with 15% off! ⏰",
        "inactive": f"👋 We miss you {user_data['name']}! Come back with 20% off your next order. Discover what's new! 🎉"
    }
    
    base_message = templates.get(user_data.get('segment'), templates['high_value'])
    
    # Add personalization based on purchase history
    total_orders = user_data.get('total_orders', 0)
    if total_orders > 3:
        base_message += f" You've saved ${total_orders * 50} with us!"
    
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
    try:
        # Get data from database
        analytics_data = db.get_analytics_data()
        users = analytics_data['users']
        campaigns = analytics_data['campaigns']
        messages = analytics_data['messages']
        
        # If database is empty, use mock data for demo
        if not users:
            users = db.get_users()  # This will return mock data
        
        # Calculate metrics from real data
        total_revenue = sum(user.get('total_spent', 0) for user in users)
        total_messages = len(messages)
        total_users = len(users)
        
        # Calculate conversion rate from messages
        delivered_messages = [m for m in messages if m.get('status') == 'delivered']
        clicked_messages = [m for m in messages if m.get('clicked_at')]
        conversion_rate = (len(clicked_messages) / max(len(delivered_messages), 1)) * 100 if delivered_messages else 8.4
        
        # Generate revenue data from recent campaigns or use mock data
        revenue_data = []
        for i in range(7):
            date = (datetime.now() - timedelta(days=6-i)).strftime('%Y-%m-%d')
            # Calculate daily revenue from campaigns created on that date
            daily_campaigns = [c for c in campaigns if c.get('created_at', '').startswith(date)]
            daily_revenue = sum(c.get('revenue', 0) for c in daily_campaigns)
            if daily_revenue == 0:
                daily_revenue = random.randint(8000, 15000)  # Fallback for demo
            revenue_data.append({"date": date, "revenue": daily_revenue})
        
        # Segment users using ML
        ml_segmentation = MLSegmentation()
        segmented_users = ml_segmentation.segment_users(users)
        
        # Campaign performance by segment
        campaign_data = []
        segment_insights = {}
        
        for segment, segment_users in segmented_users.items():
            segment_messages = [m for m in messages if any(u['id'] == m.get('user_id') for u in segment_users)]
            segment_conversions = [m for m in segment_messages if m.get('clicked_at')]
            
            # Use mock data if no real messages
            if not segment_messages:
                mock_messages = {"high_value": 1250, "abandoned_cart": 890, "inactive": 707}.get(segment, 500)
                mock_conversions = {"high_value": 89, "abandoned_cart": 156, "inactive": 45}.get(segment, 25)
                segment_messages = [{'mock': True}] * mock_messages
                segment_conversions = [{'mock': True}] * mock_conversions
            
            campaign_data.append({
                "segment": segment.replace('_', ' ').title(),
                "messages": len(segment_messages),
                "conversions": len(segment_conversions)
            })
            
            # Calculate segment insights
            segment_insights[segment] = {
                'count': len(segment_users),
                'total_revenue': sum(user.get('total_spent', 0) for user in segment_users),
                'avg_revenue_per_user': sum(user.get('total_spent', 0) for user in segment_users) / max(len(segment_users), 1)
            }
        
        # Ensure we have minimum values for demo
        if total_revenue == 0:
            total_revenue = 125000
        if total_messages == 0:
            total_messages = 2847
        if conversion_rate == 0:
            conversion_rate = 8.4
        
        return jsonify({
            "success": True,
            "revenue": total_revenue,
            "messagesSent": total_messages,
            "conversionRate": round(conversion_rate, 1),
            "totalUsers": total_users,
            "revenueData": revenue_data,
            "campaignData": campaign_data,
            "segmentInsights": segment_insights
        })
        
    except Exception as e:
        print(f"Analytics error: {e}")
        # Fallback to mock data if database fails
        return jsonify({
            "success": True,
            "revenue": 125000,
            "messagesSent": 2847,
            "conversionRate": 8.4,
            "totalUsers": 10,
            "revenueData": [
                {"date": "2024-04-05", "revenue": 12000},
                {"date": "2024-04-06", "revenue": 15000},
                {"date": "2024-04-07", "revenue": 18000},
                {"date": "2024-04-08", "revenue": 14000},
                {"date": "2024-04-09", "revenue": 22000},
                {"date": "2024-04-10", "revenue": 19000},
                {"date": "2024-04-11", "revenue": 25000}
            ],
            "campaignData": [
                {"segment": "High Value", "messages": 1250, "conversions": 89},
                {"segment": "Abandoned Cart", "messages": 890, "conversions": 156},
                {"segment": "Inactive", "messages": 707, "conversions": 45}
            ],
            "segmentInsights": {
                "high_value": {
                    "count": 5,
                    "total_revenue": 85000,
                    "avg_revenue_per_user": 17000
                },
                "abandoned_cart": {
                    "count": 3,
                    "total_revenue": 25000,
                    "avg_revenue_per_user": 8333
                },
                "inactive": {
                    "count": 2,
                    "total_revenue": 15000,
                    "avg_revenue_per_user": 7500
                }
            }
        })

@app.route('/api/campaign/trigger', methods=['POST'])
def trigger_campaign():
    """Trigger AI-powered marketing campaign"""
    try:
        data = request.json
        audience = data.get('audience')
        goal = data.get('goal')
        
        # Get users from database
        users = db.get_users()
        if not users:
            users = mock_users  # Fallback
        
        # Segment users using ML
        ml_segmentation = MLSegmentation()
        segmented_users_list = ml_segmentation.segment_users_ml(users)
        
        # Group by segment
        segmented_users = {}
        for user in segmented_users_list:
            segment = user['segment']
            if segment not in segmented_users:
                segmented_users[segment] = []
            segmented_users[segment].append(user)
        
        target_users = segmented_users.get(audience, [])
        
        if not target_users:
            return jsonify({"error": "No users found for selected audience"}), 400
        
        # Create campaign in database
        campaign_data = {
            'name': f"{audience.replace('_', ' ').title()} Campaign",
            'audience': audience,
            'goal': goal,
            'status': 'active'
        }
        
        campaign = db.create_campaign(campaign_data)
        if not campaign:
            return jsonify({"error": "Failed to create campaign"}), 500
        
        # Generate personalized messages for each user
        campaign_results = []
        for user in target_users:
            message = generate_ai_message(user, goal)
            
            # Store message in database
            message_data = {
                'campaign_id': campaign['id'],
                'user_id': user['id'],
                'message_content': message,
                'status': 'sent',
                'platform': 'whatsapp',
                'sent_at': datetime.now().isoformat()
            }
            
            db_message = db.create_message(message_data)
            if db_message:
                campaign_results.append({
                    "user_id": user['id'],
                    "name": user['name'],
                    "segment": audience,
                    "message": message,
                    "status": "sent",
                    "timestamp": datetime.now().isoformat()
                })
        
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
        
    except Exception as e:
        print(f"Campaign trigger error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/campaign/history', methods=['GET'])
def get_campaign_history():
    """Get campaign history"""
    try:
        # Get campaigns from database
        campaigns = db.get_campaigns()
        
        if not campaigns:
            # Fallback to mock data
            return get_mock_campaign_history()
        
        # Format campaigns for frontend
        formatted_campaigns = []
        for campaign in campaigns:
            # Get messages for this campaign
            messages = db.get_messages_by_campaign(campaign['id'])
            
            # Calculate metrics
            delivered_messages = [m for m in messages if m.get('status') == 'delivered']
            clicked_messages = [m for m in messages if m.get('clicked_at')]
            conversion_rate = (len(clicked_messages) / max(len(messages), 1)) * 100 if messages else 0
            
            formatted_campaigns.append({
                "id": campaign['id'],
                "name": campaign['name'],
                "audience": campaign['audience'].replace('_', ' ').title(),
                "messages_sent": len(messages),
                "conversions": len(clicked_messages),
                "revenue": campaign.get('revenue', 0),
                "created_at": campaign['created_at'],
                "status": campaign['status'],
                "conversion_rate": round(conversion_rate, 1)
            })
        
        return jsonify({
            'success': True,
            'campaigns': formatted_campaigns
        })
        
    except Exception as e:
        print(f"Campaign history error: {e}")
        return get_mock_campaign_history()

def get_mock_campaign_history():
    """Fallback mock campaign history"""
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

def get_mock_analytics():
    """Fallback mock analytics data"""
    return jsonify({
        "success": True,
        "revenue": 125000,
        "messagesSent": 8450,
        "conversionRate": 12.5,
        "totalUsers": 2340,
        "revenueData": [
            {"date": (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d'), "revenue": random.randint(10000, 25000)}
            for i in range(6, -1, -1)
        ],
        "campaignData": [
            {"segment": "High Value", "messages": 1200, "conversions": 180},
            {"segment": "Abandoned Cart", "messages": 890, "conversions": 156},
            {"segment": "Inactive", "messages": 2100, "conversions": 67}
        ],
        "segmentInsights": {
            "high_value": {"count": 45, "total_revenue": 67500, "avg_revenue_per_user": 1500},
            "abandoned_cart": {"count": 123, "total_revenue": 34500, "avg_revenue_per_user": 280},
            "inactive": {"count": 89, "total_revenue": 12000, "avg_revenue_per_user": 135}
        }
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get user list with segments"""
    try:
        # Get users from database
        users = db.get_users()
        
        if not users:
            # Fallback to mock data
            users = mock_users
        
        # Apply ML segmentation
        ml_segmentation = MLSegmentation()
        segmented_users_list = ml_segmentation.segment_users_ml(users)
        
        return jsonify({
            'success': True,
            'users': segmented_users_list,
            'total_count': len(segmented_users_list)
        })
        
    except Exception as e:
        print(f"Users error: {e}")
        # Fallback to mock data
        return get_mock_users()

def get_mock_users():
    """Fallback mock users data"""
    mock_users_data = [
        {
            "id": 1, "name": "Rahul Sharma", "email": "rahul@example.com",
            "segment": "high_value", "total_spent": 2500, "segment_label": "High Value", 
            "segment_emoji": "💰", "segment_confidence": 0.89
        },
        {
            "id": 2, "name": "Priya Patel", "email": "priya@example.com",
            "segment": "abandoned_cart", "total_spent": 450, "segment_label": "Abandoned Cart",
            "segment_emoji": "🛒", "segment_confidence": 0.82
        },
        {
            "id": 3, "name": "Amit Kumar", "email": "amit@example.com",
            "segment": "inactive", "total_spent": 120, "segment_label": "Inactive",
            "segment_emoji": "😴", "segment_confidence": 0.76
        }
    ]
    
    return jsonify({
        'success': True,
        'users': mock_users_data,
        'total_count': len(mock_users_data)
    })

@app.route("/")
def home():
    return "Convexa AI Backend is running! 🚀"

# Real-Time WebSocket Endpoints
@app.route('/api/realtime/customer/<customer_id>', methods=['GET'])
def get_realtime_customer(customer_id):
    """Get real-time customer data"""
    try:
        customer_data = websocket_service.get_real_time_customer_data(customer_id)
        if not customer_data:
            return jsonify({'error': 'Customer not found'}), 404
        
        return jsonify({
            'success': True,
            'customer': customer_data,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Real-time customer error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/realtime/analytics', methods=['GET'])
def get_realtime_analytics():
    """Get real-time analytics data"""
    try:
        analytics = websocket_service.get_live_analytics()
        return jsonify({
            'success': True,
            'analytics': analytics
        })
    except Exception as e:
        print(f"Real-time analytics error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/realtime/events', methods=['GET'])
def get_realtime_events():
    """Get recent real-time events"""
    try:
        limit = request.args.get('limit', 20, type=int)
        events = websocket_service.get_recent_events(limit)
        
        return jsonify({
            'success': True,
            'events': events,
            'count': len(events)
        })
    except Exception as e:
        print(f"Real-time events error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/realtime/simulate/<platform>/<action>', methods=['POST'])
def simulate_platform_event(platform, action):
    """Simulate platform integration event"""
    try:
        event = websocket_service.simulate_platform_integration(platform, action)
        if event:
            return jsonify({
                'success': True,
                'event': event
            })
        else:
            return jsonify({'error': 'Invalid platform or action'}), 400
    except Exception as e:
        print(f"Platform simulation error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/integrations/status', methods=['GET'])
def get_integration_status():
    """Get status of all platform integrations"""
    try:
        return jsonify({
            'success': True,
            'integrations': {
                'ecommerce': {
                    'shopify': {'status': 'connected', 'last_sync': datetime.now().isoformat()},
                    'woocommerce': {'status': 'connected', 'last_sync': datetime.now().isoformat()}
                },
                'messaging': {
                    'whatsapp': {'status': 'connected', 'last_sync': datetime.now().isoformat()},
                    'instagram': {'status': 'connected', 'last_sync': datetime.now().isoformat()}
                },
                'analytics': {
                    'google_analytics': {'status': 'connected', 'last_sync': datetime.now().isoformat()}
                }
            }
        })
    except Exception as e:
        print(f"Integration status error: {e}")
        return jsonify({'error': str(e)}), 500

# Real-Time AI Chat Endpoints
@app.route('/api/chat/message', methods=['POST'])
def chat_message():
    """Handle real-time AI chat messages"""
    try:
        data = request.json
        user_message = data.get('message')
        user_id = data.get('user_id')
        conversation_id = data.get('conversation_id', f"conv_{user_id}_{datetime.now().timestamp()}")
        
        if not user_message or not user_id:
            return jsonify({'error': 'Message and user_id required'}), 400
        
        # Get user data for context
        users = db.get_users()
        user_data = next((u for u in users if str(u.get('id')) == str(user_id)), None)
        
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        # Get AI response
        ai_response = ai_chat_service.get_ai_response(
            user_message, 
            user_data, 
            conversation_id
        )
        
        return jsonify({
            'success': True,
            'conversation_id': conversation_id,
            'ai_response': ai_response['response'],
            'timestamp': ai_response['timestamp'],
            'context': ai_response['context'],
            'suggested_actions': ai_response['suggested_actions']
        })
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/history/<conversation_id>', methods=['GET'])
def get_chat_history(conversation_id):
    """Get conversation history"""
    try:
        history = ai_chat_service.get_conversation_history(conversation_id)
        return jsonify({
            'success': True,
            'conversation_id': conversation_id,
            'history': history
        })
    except Exception as e:
        print(f"Chat history error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/personalization/live', methods=['POST'])
def live_personalization():
    """Real-time message personalization based on live behavior"""
    try:
        data = request.json
        user_id = data.get('user_id')
        cart_value = data.get('cart_value', 0)
        behavior_data = data.get('behavior', {})
        tone = behavior_data.get('tone', 'casual')  # Extract tone from behavior data
        
        # Get user data
        users = db.get_users()
        user_data = next((u for u in users if str(u.get('id')) == str(user_id)), None)
        
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate live personalized message
        message = generate_live_personalized_message(user_data, cart_value, behavior_data, tone)
        
        # Get send time prediction
        send_time_prediction = ai_chat_service.get_best_send_time(user_data)
        
        # Get explainable AI insights
        ai_explanation = get_ai_explanation(user_data, cart_value, behavior_data)
        
        return jsonify({
            'success': True,
            'personalized_message': message,
            'send_time_prediction': send_time_prediction,
            'ai_explanation': ai_explanation,
            'user_segment': user_data.get('segment_label', 'Unknown'),
            'confidence': user_data.get('segment_confidence', 0)
        })
        
    except Exception as e:
        print(f"Live personalization error: {e}")
        return jsonify({'error': str(e)}), 500

def generate_live_personalized_message(user_data, cart_value, behavior_data, tone='casual'):
    """Generate message based on real-time behavior and tone"""
    name = user_data.get('name', 'there')
    segment = user_data.get('segment', 'unknown')
    
    # Cart value-based personalization with tone variations
    if cart_value < 500:
        if tone == 'formal':
            base_message = f"Dear {name}, we noticed you're exploring our collection. May we suggest completing your selection?"
            urgency = "Limited time offer available"
            discount = "10% discount"
        else:
            base_message = f"Hey {name}! 👀 I see you're browsing. How about adding something special to your cart?"
            urgency = "Limited time offer!"
            discount = "10% off"
    elif cart_value < 2000:
        if tone == 'formal':
            base_message = f"Dear {name}, thank you for your excellent selections. Would you like to proceed with your order?"
            urgency = "Complimentary shipping included"
            discount = "15% discount"
        else:
            base_message = f"Hi {name}! 🛒 Great choices in your cart! Ready to complete your order?"
            urgency = "Free shipping included!"
            discount = "15% off"
    elif cart_value < 5000:
        if tone == 'formal':
            base_message = f"Dear {name}, we appreciate your discerning taste. Your selection reflects exceptional quality."
            urgency = "VIP service activated"
            discount = "20% discount with express delivery"
        else:
            base_message = f"Hello {name}! 💎 Excellent taste! Your cart looks amazing."
            urgency = "VIP treatment activated!"
            discount = "20% off + free express delivery"
    else:
        if tone == 'formal':
            base_message = f"Dear {name}, thank you for choosing our premium collection. You deserve our finest service."
            urgency = "Exclusive platinum membership benefits"
            discount = "25% discount with personal shopping assistance"
        else:
            base_message = f"Greetings {name}! 🌟 Premium selection detected! You deserve the best."
            urgency = "Exclusive platinum benefits!"
            discount = "25% off + personal shopping assistant"
    
    # Behavior-based additions with tone consideration
    time_on_page = behavior_data.get('time_on_page', 0)
    if time_on_page > 300:  # 5 minutes
        if tone == 'formal':
            base_message += f" We appreciate your careful consideration. {discount} to assist with your decision."
        else:
            base_message += f" I noticed you're taking your time - that's smart! {discount} to help you decide."
    
    pages_visited = behavior_data.get('pages_visited', 0)
    if pages_visited > 5:
        if tone == 'formal':
            base_message += f" Your thorough exploration of {pages_visited} pages demonstrates excellent judgment."
        else:
            base_message += f" You've explored {pages_visited} pages - you know quality when you see it!"
    
    return {
        'message': base_message,
        'urgency': urgency,
        'discount': discount,
        'cart_value': cart_value,
        'personalization_factors': {
            'cart_value_tier': get_cart_tier(cart_value),
            'behavior_score': calculate_behavior_score(behavior_data),
            'segment_influence': segment
        }
    }

def get_cart_tier(cart_value):
    """Get cart value tier"""
    if cart_value < 500:
        return 'Browser'
    elif cart_value < 2000:
        return 'Interested'
    elif cart_value < 5000:
        return 'Committed'
    else:
        return 'Premium'

def calculate_behavior_score(behavior_data):
    """Calculate behavior engagement score"""
    score = 0
    score += min(behavior_data.get('time_on_page', 0) / 60, 10)  # Max 10 points for time
    score += min(behavior_data.get('pages_visited', 0), 10)  # Max 10 points for pages
    score += behavior_data.get('items_viewed', 0) * 2  # 2 points per item
    return min(score, 100)

def get_ai_explanation(user_data, cart_value, behavior_data):
    """Generate explainable AI insights"""
    segment = user_data.get('segment_label', 'Unknown')
    total_spent = user_data.get('total_spent', 0)
    
    reasons = []
    
    # Segment reasoning
    if segment == 'High Value':
        reasons.append(f"💰 High Value Customer: Total spent ₹{total_spent:,}")
        reasons.append(f"🎯 VIP Treatment: {user_data.get('total_orders', 0)} previous orders")
    elif segment == 'Abandoned Cart':
        reasons.append(f"🛒 Cart Abandoner: {len(user_data.get('cart_items', []))} items waiting")
        reasons.append(f"⏰ Recovery Opportunity: Last purchase {user_data.get('last_purchase_date', 'N/A')}")
    elif segment == 'Inactive':
        reasons.append(f"😴 Inactive User: Low recent engagement")
        reasons.append(f"🎯 Re-engagement Target: Needs motivation")
    
    # Behavior reasoning
    if cart_value > 1000:
        reasons.append(f"💎 High Intent: Cart value ₹{cart_value:,}")
    
    behavior_score = calculate_behavior_score(behavior_data)
    if behavior_score > 50:
        reasons.append(f"🔥 High Engagement: {behavior_score}/100 activity score")
    
    return {
        'segment': segment,
        'confidence': user_data.get('segment_confidence', 0),
        'reasons': reasons,
        'recommendation': get_recommendation(segment, cart_value, behavior_score),
        'next_best_action': get_next_best_action(segment, cart_value)
    }

def get_recommendation(segment, cart_value, behavior_score):
    """Get AI recommendation"""
    if segment == 'High Value' and cart_value > 2000:
        return "Offer premium service and exclusive access"
    elif segment == 'Abandoned Cart':
        return "Send immediate cart recovery with discount"
    elif behavior_score > 70:
        return "User is highly engaged - perfect time for upsell"
    else:
        return "Build engagement with personalized content"

def get_next_best_action(segment, cart_value):
    """Get next best action recommendation"""
    if cart_value > 5000:
        return "Assign personal shopping assistant"
    elif segment == 'High Value':
        return "Invite to VIP program"
    elif segment == 'Abandoned Cart':
        return "Send cart recovery email"
    else:
        return "Show personalized recommendations"

# Socket.IO Event Handlers
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('🔌 Client connected')
    emit('connection_status', {'status': 'connected', 'timestamp': datetime.now().isoformat()})
    
    # Send initial data
    try:
        analytics = websocket_service.get_live_analytics()
        emit('analytics_update', analytics)
        
        recent_events = websocket_service.get_recent_events(5)
        emit('recent_events', {'events': recent_events})
    except Exception as e:
        print(f"Error sending initial data: {e}")

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('🔌 Client disconnected')

@socketio.on('subscribe_customer')
def handle_subscribe_customer(data):
    """Subscribe to specific customer updates"""
    customer_id = data.get('customer_id')
    if customer_id:
        print(f'📡 Subscribing to customer {customer_id}')
        # In a real implementation, you'd join a room for this customer
        emit('subscription_confirmed', {'customer_id': customer_id})

@socketio.on('simulate_event')
def handle_simulate_event(data):
    """Simulate a real-time event"""
    event_type = data.get('type')
    if event_type == 'customer_activity':
        websocket_service.simulate_customer_activity()
    elif event_type == 'cart_update':
        websocket_service.simulate_cart_updates()
    elif event_type == 'message':
        websocket_service.simulate_messaging_events()
    
    emit('event_simulated', {'type': event_type, 'timestamp': datetime.now().isoformat()})

# Background task to broadcast real-time updates
def background_broadcast():
    """Background task to send real-time updates to all clients"""
    import threading
    import time
    
    def broadcast_updates():
        while True:
            try:
                # Get latest analytics
                analytics = websocket_service.get_live_analytics()
                socketio.emit('analytics_update', analytics)
                
                # Get recent events
                recent_events = websocket_service.get_recent_events(3)
                if recent_events:
                    socketio.emit('live_events', {'events': recent_events})
                
                time.sleep(10)  # Broadcast every 10 seconds
            except Exception as e:
                print(f"Background broadcast error: {e}")
                time.sleep(10)
    
    thread = threading.Thread(target=broadcast_updates, daemon=True)
    thread.start()

if __name__ == '__main__':
    # Start background broadcasting
    background_broadcast()
    
    # Run the app with Socket.IO
    socketio.run(app, debug=True, port=5000, allow_unsafe_werkzeug=True)
