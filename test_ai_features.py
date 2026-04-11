#!/usr/bin/env python3
"""
Test script for new AI features
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_ai_chat():
    """Test AI chat functionality"""
    print("🤖 Testing AI Chat...")
    
    test_messages = [
        "This is too expensive",
        "I'm interested in this product",
        "I have a problem with my order",
        "Tell me more about this"
    ]
    
    for message in test_messages:
        try:
            response = requests.post(f"{BASE_URL}/api/chat/message", json={
                "message": message,
                "user_id": "1"
            })
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Message: '{message}'")
                print(f"   AI Response: {data['ai_response'][:100]}...")
                print(f"   Context: {data['context']['message_intent']}, {data['context']['sentiment']}")
                print(f"   Actions: {len(data['suggested_actions'])} suggested")
                print()
            else:
                print(f"❌ Failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")

def test_live_personalization():
    """Test live personalization"""
    print("⚡ Testing Live Personalization...")
    
    test_scenarios = [
        {"cart_value": 500, "behavior": {"time_on_page": 60, "pages_visited": 2}},
        {"cart_value": 2000, "behavior": {"time_on_page": 180, "pages_visited": 5}},
        {"cart_value": 8000, "behavior": {"time_on_page": 400, "pages_visited": 10}}
    ]
    
    for i, scenario in enumerate(test_scenarios, 1):
        try:
            response = requests.post(f"{BASE_URL}/api/personalization/live", json={
                "user_id": "1",
                **scenario
            })
            
            if response.status_code == 200:
                data = response.json()
                message = data['personalized_message']
                send_time = data['send_time_prediction']
                
                print(f"✅ Scenario {i}: Cart ₹{scenario['cart_value']:,}")
                print(f"   Message: {message['message'][:80]}...")
                print(f"   Discount: {message['discount']}")
                print(f"   Best Time: {send_time['best_time']} ({send_time['confidence']*100:.0f}% confidence)")
                print(f"   Reasons: {len(data['ai_explanation']['reasons'])} AI insights")
                print()
            else:
                print(f"❌ Failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")

def main():
    print("🚀 Testing Hackathon Winning AI Features")
    print("=" * 50)
    
    test_ai_chat()
    test_live_personalization()
    
    print("🎉 AI Features Test Complete!")
    print("\n📋 Next Steps:")
    print("1. Open http://localhost:5174")
    print("2. Navigate to 'AI Demo' in the sidebar")
    print("3. Experience the hackathon-winning features!")

if __name__ == "__main__":
    main()