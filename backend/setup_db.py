#!/usr/bin/env python3
"""
Database setup script for Convexa AI
This script initializes the Supabase database with sample data
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client
import bcrypt
from datetime import datetime, timedelta
import json

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
    sys.exit(1)

print(f"🔗 Connecting to Supabase: {SUPABASE_URL}")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Connected to Supabase successfully!")
except Exception as e:
    print(f"❌ Failed to connect to Supabase: {e}")
    sys.exit(1)

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def setup_admin_users():
    """Setup admin users"""
    print("\n📝 Setting up admin users...")
    
    admin_data = {
        'name': 'Admin User',
        'email': 'admin@convexa.ai',
        'password_hash': hash_password('admin123'),
        'role': 'admin'
    }
    
    try:
        # Check if admin already exists
        existing = supabase.table('admin_users').select('*').eq('email', admin_data['email']).execute()
        
        if existing.data:
            print(f"✅ Admin user {admin_data['email']} already exists")
        else:
            result = supabase.table('admin_users').insert(admin_data).execute()
            print(f"✅ Created admin user: {admin_data['email']}")
            
    except Exception as e:
        print(f"❌ Error setting up admin users: {e}")

def setup_sample_users():
    """Setup sample ecommerce users"""
    print("\n👥 Setting up sample users...")
    
    sample_users = [
        {
            'name': 'Rahul Sharma',
            'email': 'rahul@example.com',
            'phone': '+91-9876543210',
            'total_spent': 2500.00,
            'total_orders': 5,
            'cart_items': json.dumps(["iPhone 15", "AirPods"]),
            'last_purchase_date': (datetime.now() - timedelta(days=6)).isoformat(),
            'cart_abandonment_count': 1,
            'avg_session_duration': 450,
            'pages_per_session': 8.5
        },
        {
            'name': 'Priya Patel',
            'email': 'priya@example.com',
            'phone': '+91-9876543211',
            'total_spent': 450.00,
            'total_orders': 2,
            'cart_items': json.dumps(["Laptop", "Mouse"]),
            'last_purchase_date': (datetime.now() - timedelta(days=22)).isoformat(),
            'cart_abandonment_count': 3,
            'avg_session_duration': 320,
            'pages_per_session': 5.2
        },
        {
            'name': 'Amit Kumar',
            'email': 'amit@example.com',
            'phone': '+91-9876543212',
            'total_spent': 120.00,
            'total_orders': 1,
            'cart_items': json.dumps([]),
            'last_purchase_date': (datetime.now() - timedelta(days=60)).isoformat(),
            'cart_abandonment_count': 0,
            'avg_session_duration': 180,
            'pages_per_session': 3.1
        },
        {
            'name': 'Sneha Reddy',
            'email': 'sneha@example.com',
            'phone': '+91-9876543213',
            'total_spent': 3200.00,
            'total_orders': 8,
            'cart_items': json.dumps(["MacBook Pro"]),
            'last_purchase_date': (datetime.now() - timedelta(days=1)).isoformat(),
            'cart_abandonment_count': 2,
            'avg_session_duration': 520,
            'pages_per_session': 12.3
        },
        {
            'name': 'Vikram Singh',
            'email': 'vikram@example.com',
            'phone': '+91-9876543214',
            'total_spent': 890.00,
            'total_orders': 3,
            'cart_items': json.dumps(["Gaming Chair", "Keyboard"]),
            'last_purchase_date': (datetime.now() - timedelta(days=4)).isoformat(),
            'cart_abandonment_count': 4,
            'avg_session_duration': 380,
            'pages_per_session': 7.8
        }
    ]
    
    try:
        for user_data in sample_users:
            # Check if user already exists
            existing = supabase.table('users').select('*').eq('email', user_data['email']).execute()
            
            if existing.data:
                print(f"✅ User {user_data['email']} already exists")
            else:
                result = supabase.table('users').insert(user_data).execute()
                print(f"✅ Created user: {user_data['name']}")
                
    except Exception as e:
        print(f"❌ Error setting up sample users: {e}")

def test_database_connection():
    """Test database operations"""
    print("\n🧪 Testing database operations...")
    
    try:
        # Test admin users table
        admin_users = supabase.table('admin_users').select('*').execute()
        print(f"✅ Admin users table: {len(admin_users.data)} records")
        
        # Test users table
        users = supabase.table('users').select('*').execute()
        print(f"✅ Users table: {len(users.data)} records")
        
        # Test campaigns table
        campaigns = supabase.table('campaigns').select('*').execute()
        print(f"✅ Campaigns table: {len(campaigns.data)} records")
        
        # Test messages table
        messages = supabase.table('messages').select('*').execute()
        print(f"✅ Messages table: {len(messages.data)} records")
        
        print("✅ All database operations successful!")
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")

if __name__ == "__main__":
    print("🚀 Convexa AI Database Setup")
    print("=" * 40)
    
    # Setup database
    setup_admin_users()
    setup_sample_users()
    
    # Test connection
    test_database_connection()
    
    print("\n🎉 Database setup completed!")
    print("\n📋 Login credentials:")
    print("   Email: admin@convexa.ai")
    print("   Password: admin123")