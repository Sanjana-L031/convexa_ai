#!/usr/bin/env python3
"""
Complete system test for Convexa AI
Tests backend endpoints and verifies data flow
"""

import requests
import json
import sys

def test_backend_health():
    """Test backend health endpoint"""
    try:
        response = requests.get('http://localhost:5000/health')
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend health check error: {e}")
        return False

def test_admin_login():
    """Test admin login"""
    try:
        login_data = {
            "email": "admin@convexa.ai",
            "password": "admin123"
        }
        response = requests.post('http://localhost:5000/api/auth/login', json=login_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('token'):
                print("✅ Admin login successful")
                return data.get('token')
            else:
                print(f"❌ Admin login failed: {data}")
                return None
        else:
            print(f"❌ Admin login failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Admin login error: {e}")
        return None

def test_customer_login():
    """Test customer login"""
    try:
        login_data = {
            "identifier": "rahul@example.com",
            "password": "demo123"
        }
        response = requests.post('http://localhost:5000/api/customer/login', json=login_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('token'):
                print("✅ Customer login successful")
                return data.get('token')
            else:
                print(f"❌ Customer login failed: {data}")
                return None
        else:
            print(f"❌ Customer login failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Customer login error: {e}")
        return None

def test_analytics():
    """Test analytics endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/analytics')
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                revenue = data.get('revenue', 0)
                messages = data.get('messagesSent', 0)
                users = data.get('totalUsers', 0)
                conversion_rate = data.get('conversionRate', 0)
                
                print(f"✅ Analytics endpoint working:")
                print(f"   Revenue: ${revenue:,}")
                print(f"   Messages Sent: {messages:,}")
                print(f"   Total Users: {users}")
                print(f"   Conversion Rate: {conversion_rate}%")
                
                # Check if we have chart data
                revenue_data = data.get('revenueData', [])
                campaign_data = data.get('campaignData', [])
                segment_insights = data.get('segmentInsights', {})
                
                if revenue_data and campaign_data and segment_insights:
                    print("✅ Chart data available")
                    return True
                else:
                    print("❌ Missing chart data")
                    return False
            else:
                print(f"❌ Analytics failed: {data}")
                return False
        else:
            print(f"❌ Analytics failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Analytics error: {e}")
        return False

def test_users():
    """Test users endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/users')
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                users = data.get('users', [])
                print(f"✅ Users endpoint working: {len(users)} users found")
                return True
            else:
                print(f"❌ Users failed: {data}")
                return False
        else:
            print(f"❌ Users failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Users error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Convexa AI System Tests\n")
    
    tests_passed = 0
    total_tests = 5
    
    # Test backend health
    if test_backend_health():
        tests_passed += 1
    
    # Test admin login
    if test_admin_login():
        tests_passed += 1
    
    # Test customer login
    if test_customer_login():
        tests_passed += 1
    
    # Test analytics
    if test_analytics():
        tests_passed += 1
    
    # Test users
    if test_users():
        tests_passed += 1
    
    print(f"\n📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! System is working correctly.")
        print("\n🌐 Access the application at:")
        print("   Frontend: http://localhost:5175")
        print("   Backend:  http://localhost:5000")
        print("\n👤 Demo Credentials:")
        print("   Admin: admin@convexa.ai / admin123")
        print("   Customer: rahul@example.com / demo123")
        return True
    else:
        print("❌ Some tests failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)