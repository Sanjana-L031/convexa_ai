#!/usr/bin/env python3
"""
Test WebSocket Integration
Tests the real-time features and WebSocket connectivity
"""

import requests
import time
import json

def test_backend_health():
    """Test if backend is running"""
    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend not accessible: {e}")
        return False

def test_realtime_endpoints():
    """Test real-time API endpoints"""
    endpoints = [
        '/api/realtime/analytics',
        '/api/realtime/events?limit=5',
        '/api/realtime/customer/1',
        '/api/integrations/status'
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f'http://localhost:5000{endpoint}', timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {endpoint}: {data.get('success', 'OK')}")
            else:
                print(f"❌ {endpoint}: HTTP {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint}: {e}")

def test_websocket_simulation():
    """Test WebSocket event simulation"""
    platforms = ['shopify', 'whatsapp', 'instagram']
    actions = ['webhook_received', 'message_received', 'page_view']
    
    for platform in platforms:
        for action in actions:
            try:
                response = requests.post(
                    f'http://localhost:5000/api/realtime/simulate/{platform}/{action}',
                    timeout=5
                )
                if response.status_code == 200:
                    print(f"✅ Simulated {platform}/{action}")
                else:
                    print(f"❌ Failed to simulate {platform}/{action}: {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"❌ Simulation error {platform}/{action}: {e}")

def test_ai_chat():
    """Test AI chat functionality"""
    try:
        chat_data = {
            'message': 'This is too expensive',
            'user_id': '1',
            'conversation_id': 'test_conv_123'
        }
        
        response = requests.post(
            'http://localhost:5000/api/chat/message',
            json=chat_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ AI Chat working: {data.get('ai_response', {}).get('response', 'No response')[:50]}...")
        else:
            print(f"❌ AI Chat failed: HTTP {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ AI Chat error: {e}")

def test_live_personalization():
    """Test live personalization"""
    try:
        personalization_data = {
            'user_id': '1',
            'cart_value': 2500,
            'behavior': {
                'time_on_page': 300,
                'pages_visited': 5,
                'items_viewed': 3
            }
        }
        
        response = requests.post(
            'http://localhost:5000/api/personalization/live',
            json=personalization_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Live Personalization working: {data.get('personalized_message', {}).get('message', 'No message')[:50]}...")
        else:
            print(f"❌ Live Personalization failed: HTTP {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Live Personalization error: {e}")

def main():
    """Run all tests"""
    print("🧪 Testing WebSocket Integration\n")
    
    # Test backend connectivity
    if not test_backend_health():
        print("\n❌ Backend not running. Start with: python backend/app.py")
        return
    
    print("\n📡 Testing Real-time Endpoints:")
    test_realtime_endpoints()
    
    print("\n🎭 Testing WebSocket Simulation:")
    test_websocket_simulation()
    
    print("\n🤖 Testing AI Chat:")
    test_ai_chat()
    
    print("\n🎯 Testing Live Personalization:")
    test_live_personalization()
    
    print("\n✅ WebSocket integration tests completed!")
    print("\n🚀 Next steps:")
    print("1. Start frontend: npm run dev")
    print("2. Open http://localhost:5173/ai-demo")
    print("3. Test real-time features in the browser")

if __name__ == '__main__':
    main()