from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from datetime import datetime, timedelta
import random
import json
from dotenv import load_dotenv

# Import our services
from models.db import db
from services.ml_segmentation import ml_segmentation
from services.auth_service import auth_service

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

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
        if not auth_service.verify_password(password, admin_user['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate token
        token = auth_service.generate_token(admin_user)
        
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
        existing_user = db.get_admin_user_by_email(email)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        password_hash = auth_service.hash_password(password)
        
        # Create user
        user_data = {
            'name': name,
            'email': email,
            'password_hash': password_hash,
            'role': role,
            'created_at': datetime.now().isoformat()
        }
        
        new_user = db.create_admin_user(user_data)
        
        if new_user:
            # Generate token
            token = auth_service.generate_token(new_user)
            
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
        else:
            return jsonify({'error': 'Failed to create user'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User Management Routes
@app.route('/api/users', methods=['GET'])
@auth_service.token_required
def get_users(current_user):
    """Get all users with ML segmentation"""
    try:
        # Get users from database
        users = db.get_users()
        
        if not users:
            # Create sample users if none exist
            sample_users = create_sample_users()
            users = sample_users
        
        # Apply ML segmentation
        segmented_users = ml_segmentation.segment_users_ml(users)
        
        # Update segments in database
        for user in segmented_users:
            db.update_user_segment(user['id'], user['segment'])
        
        return jsonify({
            'success': True,
            'users': segmented_users,
            'total_count': len(segmented_users)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/segments', methods=['GET'])
@auth_service.token_required
def get_user_segments(current_user):
    """Get user segment insights"""
    try:
        users = db.get_users()
        segmented_users = ml_segmentation.segment_users_ml(users)
        insights = ml_segmentation.get_segment_insights(segmented_users)
        
        return jsonify({
            'success': True,
            'segments': insights
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Campaign Management Routes
@app.route('/api/campaign/trigger', methods=['POST'])
@auth_service.token_required
def trigger_campaign(current_user):
    """Trigger AI-powered marketing campaign"""
    try:
        data = request.json
        audience = data.get('audience')
        goal = data.get('goal')
        
        if not audience or not goal:
            return jsonify({'error': 'Audience and goal required'}), 400
        
        # Get users from database
        users = db.get_users()
        segmented_users = ml_segmentation.segment_users_ml(users)
        
        # Filter users by audience
        target_users = [user for user in segmented_users if user['segment'] == audience]
        
        if not target_users:
            return jsonify({'error': 'No users found for selected audience'}), 400
        
        # Create campaign record
        campaign_data = {
            'name': f"{audience.replace('_', ' ').title()} Campaign",
            'audience': audience,
            'goal': goal,
            'status': 'running',
            'created_by': current_user['user_id'],
            'created_at': datetime.now().isoformat()
        }
        
        campaign = db.create_campaign(campaign_data)
        
        if not campaign:
            return jsonify({'error': 'Failed to create campaign'}), 500
        
        # Generate personalized messages
        campaign_results = []
        for user in target_users:
            message = generate_ai_message(user, goal)
            
            # Create message record
            message_data = {
                'campaign_id': campaign['id'],
                'user_id': user['id'],
                'message_content': message,
                'status': 'sent',
                'platform': 'whatsapp',
                'sent_at': datetime.now().isoformat()
            }
            
            message_record = db.create_message(message_data)
            campaign_results.append(message_record)
        
        # Update campaign with results
        messages_sent = len(campaign_results)
        estimated_reach = int(messages_sent * 0.85)
        
        return jsonify({
            'success': True,
            'campaign_id': campaign['id'],
            'messagesSent': messages_sent,
            'estimatedReach': estimated_reach,
            'sampleMessage': campaign_results[0]['message_content'] if campaign_results else "No message generated",
            'targetUsers': len(target_users)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/campaign/history', methods=['GET'])
@auth_service.token_required
def get_campaign_history(current_user):
    """Get campaign history from database"""
    try:
        campaigns = db.get_campaigns()
        
        # Enhance with message statistics
        enhanced_campaigns = []
        for campaign in campaigns:
            messages = db.get_messages_by_campaign(campaign['id'])
            
            campaign_enhanced = campaign.copy()
            campaign_enhanced['messages_sent'] = len(messages)
            campaign_enhanced['conversion_rate'] = random.uniform(5, 20)  # Mock conversion rate
            campaign_enhanced['revenue'] = random.randint(1000, 50000)  # Mock revenue
            
            enhanced_campaigns.append(campaign_enhanced)
        
        return jsonify({
            'success': True,
            'campaigns': enhanced_campaigns
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Analytics Routes
@app.route('/api/analytics', methods=['GET'])
@auth_service.token_required
def get_analytics(current_user):
    """Get comprehensive analytics from database"""
    try:
        analytics_data = db.get_analytics_data()
        users = analytics_data['users']
        campaigns = analytics_data['campaigns']
        messages = analytics_data['messages']
        
        # Calculate metrics
        total_revenue = sum(user.get('total_spent', 0) for user in users)
        total_messages = len(messages)
        total_users = len(users)
        
        # Calculate conversion rate (mock for now)
        conversion_rate = 12.5 if total_messages > 0 else 0
        
        # Generate time series data
        revenue_data = generate_revenue_time_series()
        
        # Campaign performance by segment
        segmented_users = ml_segmentation.segment_users_ml(users)
        segment_insights = ml_segmentation.get_segment_insights(segmented_users)
        
        campaign_data = []
        for segment, data in segment_insights.items():
            campaign_data.append({
                'segment': segment.replace('_', ' ').title(),
                'messages': data['count'] * 10,  # Mock messages per segment
                'conversions': int(data['count'] * random.uniform(0.1, 0.3))
            })
        
        return jsonify({
            'success': True,
            'revenue': total_revenue,
            'messagesSent': total_messages,
            'conversionRate': conversion_rate,
            'totalUsers': total_users,
            'revenueData': revenue_data,
            'campaignData': campaign_data,
            'segmentInsights': segment_insights
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Utility Functions
def generate_ai_message(user_data, campaign_goal):
    """Generate personalized message using OpenAI"""
    try:
        # Prepare context for AI
        user_context = f"""
        User Profile:
        - Name: {user_data.get('name', 'Valued Customer')}
        - Segment: {user_data.get('segment_label', 'Customer')}
        - Total Spent: ${user_data.get('total_spent', 0)}
        - Cart Items: {', '.join(user_data.get('cart_items', []))}
        - Last Purchase: {user_data.get('last_purchase_date', 'N/A')}
        
        Campaign Goal: {campaign_goal}
        """
        
        # Use OpenAI to generate personalized message
        if openai.api_key and openai.api_key.startswith('sk-'):
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Create a personalized WhatsApp marketing message for this user:\n{user_context}\n\nMessage:",
                max_tokens=150,
                temperature=0.7
            )
            return response.choices[0].text.strip()
        else:
            # Fallback to template-based messages
            return generate_template_message(user_data, campaign_goal)
            
    except Exception as e:
        print(f"AI generation failed: {e}")
        return generate_template_message(user_data, campaign_goal)

def generate_template_message(user_data, campaign_goal):
    """Generate template-based personalized message"""
    name = user_data.get('name', 'Valued Customer')
    segment = user_data.get('segment', 'customer')
    
    templates = {
        'high_value': f"🌟 Hi {name}! As our VIP customer, enjoy exclusive 25% off premium items. Your loyalty deserves the best rewards! 💎",
        'abandoned_cart': f"🛒 Hi {name}! Your items are waiting. Complete your purchase now with 15% off + free delivery! ⏰",
        'inactive': f"👋 We miss you {name}! Come back and discover what's new with 20% off your next order. Welcome back! 🎉",
        'potential': f"🌟 Hi {name}! Discover amazing deals just for you. Get 10% off your first purchase! ✨"
    }
    
    base_message = templates.get(segment, templates['potential'])
    
    # Add campaign goal context
    if 'sale' in campaign_goal.lower():
        base_message += f" {campaign_goal} - Limited time offer!"
    
    return base_message

def generate_revenue_time_series():
    """Generate mock revenue time series data"""
    revenue_data = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=6-i)).strftime('%Y-%m-%d')
        revenue = random.randint(10000, 35000)
        revenue_data.append({"date": date, "revenue": revenue})
    return revenue_data

def create_sample_users():
    """Create sample users if database is empty"""
    sample_users = [
        {
            'id': 1,
            'name': 'Rahul Sharma',
            'email': 'rahul@example.com',
            'phone': '+91-9876543210',
            'total_spent': 2500,
            'total_orders': 5,
            'cart_items': ['iPhone 15', 'AirPods'],
            'last_purchase_date': '2024-04-05T10:30:00Z',
            'cart_abandonment_count': 1,
            'avg_session_duration': 450,
            'pages_per_session': 8,
            'created_at': '2024-01-15T09:00:00Z'
        },
        {
            'id': 2,
            'name': 'Priya Patel',
            'email': 'priya@example.com',
            'phone': '+91-9876543211',
            'total_spent': 450,
            'total_orders': 2,
            'cart_items': ['Laptop', 'Mouse'],
            'last_purchase_date': '2024-03-20T14:15:00Z',
            'cart_abandonment_count': 3,
            'avg_session_duration': 320,
            'pages_per_session': 5,
            'created_at': '2024-02-10T11:30:00Z'
        },
        {
            'id': 3,
            'name': 'Amit Kumar',
            'email': 'amit@example.com',
            'phone': '+91-9876543212',
            'total_spent': 120,
            'total_orders': 1,
            'cart_items': [],
            'last_purchase_date': '2024-02-10T16:45:00Z',
            'cart_abandonment_count': 0,
            'avg_session_duration': 180,
            'pages_per_session': 3,
            'created_at': '2024-01-05T08:20:00Z'
        }
    ]
    
    # Insert sample users into database
    for user_data in sample_users:
        db.create_user(user_data)
    
    return sample_users

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "features": ["supabase", "ml_segmentation", "auth", "ai_messaging"]
    })

@app.route("/")
def home():
    return "Convexa AI Enhanced Backend is running! 🚀✨"

if __name__ == '__main__':
    app.run(debug=True, port=5000)