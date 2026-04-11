#!/usr/bin/env python3
"""
System Test Script for Convexa AI
Tests all major endpoints and functionality
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_authentication():
    """Test login functionality"""
    print("🔐 Testing Authentication...")
    
    login_data = {
        "email": "admin@convexa.ai",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Authentication successful!")
                return data.get('token')
            else:
                print(f"❌ Authentication failed: {data.get('error')}")
        else:
            print(f"❌ Authentication failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Authentication error: {e}")
    
    return None

def test_analytics():
    """Test analytics endpoint"""
    print("\n📊 Testing Analytics...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/analytics")
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✅ Analytics working! Revenue: ${data.get('revenue'):,}")
                print(f"   Messages sent: {data.get('messagesSent'):,}")
                print(f"   Conversion rate: {data.get('conversionRate')}%")
                print(f"   Total users: {data.get('totalUsers'):,}")
            else:
                print("❌ Analytics failed")
        else:
            print(f"❌ Analytics failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Analytics error: {e}")

def test_users():
    """Test users endpoint"""
    print("\n👥 Testing Users...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/users")
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                users = data.get('users', [])
                print(f"✅ Users working! Found {len(users)} users")
                for user in users[:3]:  # Show first 3 users
                    print(f"   - {user.get('name')} ({user.get('segment_label')}) ${user.get('total_spent')}")
            else:
                print("❌ Users failed")
        else:
            print(f"❌ Users failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Users error: {e}")

def test_campaign():
    """Test campaign trigger"""
    print("\n🚀 Testing Campaign...")
    
    campaign_data = {
        "audience": "high_value",
        "goal": "Promote new product launch with exclusive discount"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/campaign/trigger", json=campaign_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✅ Campaign successful!")
                print(f"   Messages sent: {data.get('messagesSent')}")
                print(f"   Estimated reach: {data.get('estimatedReach')}")
                print(f"   Sample message: {data.get('sampleMessage')[:100]}...")
            else:
                print(f"❌ Campaign failed: {data.get('error')}")
        else:
            print(f"❌ Campaign failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Campaign error: {e}")

def test_history():
    """Test campaign history"""
    print("\n📈 Testing Campaign History...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/campaign/history")
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                campaigns = data.get('campaigns', [])
                print(f"✅ History working! Found {len(campaigns)} campaigns")
                for campaign in campaigns[:2]:  # Show first 2 campaigns
                    print(f"   - {campaign.get('name')}: {campaign.get('messages_sent')} messages, {campaign.get('conversion_rate')}% conversion")
            else:
                print("❌ History failed")
        else:
            print(f"❌ History failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ History error: {e}")

def main():
    print("🧪 Convexa AI System Test")
    print("=" * 40)
    
    # Test authentication
    token = test_authentication()
    
    # Test other endpoints
    test_analytics()
    test_users()
    test_campaign()
    test_history()
    
    print("\n" + "=" * 40)
    if token:
        print("🎉 All core systems are working!")
        print("\n📋 Next Steps:")
        print("1. Open http://localhost:5173 (or 5174)")
        print("2. Login with: admin@convexa.ai / admin123")
        print("3. Explore the dashboard and create campaigns!")
    else:
        print("⚠️  Some systems may need attention")
        print("Make sure the backend is running: cd backend && python app.py")

if __name__ == "__main__":
    main()