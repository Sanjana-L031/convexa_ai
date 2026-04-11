#!/usr/bin/env python3
"""
Test AI Demo functionality
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_users_endpoint():
    """Test users endpoint for AI Demo"""
    print("👥 Testing Users Endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/users")
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                users = data.get('users', [])
                print(f"✅ Users endpoint working: {len(users)} users found")
                
                # Show first few users
                for i, user in enumerate(users[:5], 1):
                    print(f"   {i}. {user.get('name')} - {user.get('segment_label')} (₹{user.get('total_spent', 0):,})")
                
                if len(users) > 5:
                    print(f"   ... and {len(users) - 5} more users")
                
                return users
            else:
                print("❌ Users endpoint returned error")
                return []
        else:
            print(f"❌ Users endpoint failed: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Users endpoint error: {e}")
        return []

def test_ai_chat_with_multiple_users():
    """Test AI chat with different users"""
    print("\n🤖 Testing AI Chat with Multiple Users...")
    
    users = test_users_endpoint()
    if not users:
        print("❌ No users available for testing")
        return
    
    test_messages = ["This is too expensive", "I'm interested"]
    
    for i, user in enumerate(users[:3], 1):  # Test with first 3 users
        print(f"\n--- Testing with User {i}: {user.get('name')} ---")
        
        for message in test_messages:
            try:
                response = requests.post(f"{BASE_URL}/api/chat/message", json={
                    "message": message,
                    "user_id": user.get('id')
                })
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ Message: '{message}'")
                    print(f"   AI Response: {data.get('ai_response', '')[:60]}...")
                    print(f"   Actions: {len(data.get('suggested_actions', []))}")
                else:
                    print(f"❌ Chat failed for {user.get('name')}")
                    
            except Exception as e:
                print(f"❌ Chat error for {user.get('name')}: {e}")

def test_live_personalization_with_users():
    """Test live personalization with different users"""
    print("\n⚡ Testing Live Personalization...")
    
    users = test_users_endpoint()
    if not users:
        return
    
    cart_values = [500, 2000, 5000]
    
    for user in users[:2]:  # Test with first 2 users
        print(f"\n--- Testing with {user.get('name')} ---")
        
        for cart_value in cart_values:
            try:
                response = requests.post(f"{BASE_URL}/api/personalization/live", json={
                    "user_id": user.get('id'),
                    "cart_value": cart_value,
                    "behavior": {"time_on_page": 180, "pages_visited": 4}
                })
                
                if response.status_code == 200:
                    data = response.json()
                    message = data.get('personalized_message', {})
                    print(f"✅ Cart ₹{cart_value:,}: {message.get('discount', 'N/A')}")
                else:
                    print(f"❌ Personalization failed for cart ₹{cart_value:,}")
                    
            except Exception as e:
                print(f"❌ Personalization error: {e}")

def main():
    print("🧪 AI Demo Functionality Test")
    print("=" * 40)
    
    test_users_endpoint()
    test_ai_chat_with_multiple_users()
    test_live_personalization_with_users()
    
    print("\n" + "=" * 40)
    print("🎉 AI Demo Test Complete!")
    print("\n📋 Next Steps:")
    print("1. Open http://localhost:5174")
    print("2. Login with admin@convexa.ai / admin123")
    print("3. Navigate to 'AI Demo' in sidebar")
    print("4. Select different users and test features")

if __name__ == "__main__":
    main()