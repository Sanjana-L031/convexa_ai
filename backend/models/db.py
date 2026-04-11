from supabase import create_client, Client
import os
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Database:
    def __init__(self):
        self.supabase = supabase
    
    # User Management
    def get_users(self):
        """Get all users from database"""
        try:
            response = self.supabase.table('users').select('*').execute()
            return response.data
        except Exception as e:
            print(f"Database error fetching users: {e}")
            # Fallback to mock users for demo
            return [
                {
                    "id": "1",
                    "name": "Rahul Sharma",
                    "email": "rahul@example.com",
                    "total_spent": 2500,
                    "total_orders": 5,
                    "cart_items": ["iPhone 15", "AirPods"],
                    "last_purchase_date": "2024-04-05T10:30:00Z",
                    "cart_abandonment_count": 1,
                    "avg_session_duration": 450,
                    "pages_per_session": 8.5
                },
                {
                    "id": "2",
                    "name": "Priya Patel",
                    "email": "priya@example.com",
                    "total_spent": 450,
                    "total_orders": 2,
                    "cart_items": ["Laptop", "Mouse"],
                    "last_purchase_date": "2024-03-20T14:15:00Z",
                    "cart_abandonment_count": 3,
                    "avg_session_duration": 320,
                    "pages_per_session": 5.2
                },
                {
                    "id": "3",
                    "name": "Amit Kumar",
                    "email": "amit@example.com",
                    "total_spent": 120,
                    "total_orders": 1,
                    "cart_items": [],
                    "last_purchase_date": "2024-02-10T16:45:00Z",
                    "cart_abandonment_count": 0,
                    "avg_session_duration": 180,
                    "pages_per_session": 3.1
                },
                {
                    "id": "4",
                    "name": "Sneha Reddy",
                    "email": "sneha@example.com",
                    "total_spent": 3200,
                    "total_orders": 8,
                    "cart_items": ["MacBook Pro", "iPad"],
                    "last_purchase_date": "2024-04-10T09:20:00Z",
                    "cart_abandonment_count": 2,
                    "avg_session_duration": 520,
                    "pages_per_session": 12.3
                },
                {
                    "id": "5",
                    "name": "Vikram Singh",
                    "email": "vikram@example.com",
                    "total_spent": 890,
                    "total_orders": 3,
                    "cart_items": ["Gaming Chair", "Keyboard"],
                    "last_purchase_date": "2024-04-07T11:30:00Z",
                    "cart_abandonment_count": 4,
                    "avg_session_duration": 380,
                    "pages_per_session": 7.8
                },
                {
                    "id": "6",
                    "name": "Anita Desai",
                    "email": "anita@example.com",
                    "total_spent": 1650,
                    "total_orders": 6,
                    "cart_items": ["Smartwatch", "Headphones"],
                    "last_purchase_date": "2024-04-08T15:45:00Z",
                    "cart_abandonment_count": 1,
                    "avg_session_duration": 410,
                    "pages_per_session": 9.2
                },
                {
                    "id": "7",
                    "name": "Ravi Gupta",
                    "email": "ravi@example.com",
                    "total_spent": 75,
                    "total_orders": 1,
                    "cart_items": ["Phone Case"],
                    "last_purchase_date": "2024-01-15T12:00:00Z",
                    "cart_abandonment_count": 5,
                    "avg_session_duration": 120,
                    "pages_per_session": 2.5
                },
                {
                    "id": "8",
                    "name": "Kavya Nair",
                    "email": "kavya@example.com",
                    "total_spent": 2100,
                    "total_orders": 7,
                    "cart_items": ["Tablet", "Stylus"],
                    "last_purchase_date": "2024-04-09T13:20:00Z",
                    "cart_abandonment_count": 2,
                    "avg_session_duration": 480,
                    "pages_per_session": 10.1
                },
                {
                    "id": "9",
                    "name": "Arjun Mehta",
                    "email": "arjun@example.com",
                    "total_spent": 340,
                    "total_orders": 2,
                    "cart_items": [],
                    "last_purchase_date": "2024-03-25T10:15:00Z",
                    "cart_abandonment_count": 3,
                    "avg_session_duration": 250,
                    "pages_per_session": 4.3
                },
                {
                    "id": "10",
                    "name": "Deepika Roy",
                    "email": "deepika@example.com",
                    "total_spent": 4500,
                    "total_orders": 12,
                    "cart_items": ["Camera", "Lens"],
                    "last_purchase_date": "2024-04-11T08:30:00Z",
                    "cart_abandonment_count": 1,
                    "avg_session_duration": 600,
                    "pages_per_session": 15.7
                }
            ]
    
    def create_user(self, user_data):
        """Create a new user"""
        try:
            response = self.supabase.table('users').insert(user_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    def update_user_segment(self, user_id, segment):
        """Update user segment"""
        try:
            response = self.supabase.table('users').update({
                'segment': segment,
                'updated_at': datetime.now().isoformat()
            }).eq('id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating user segment: {e}")
            return None
    
    # Campaign Management
    def create_campaign(self, campaign_data):
        """Create a new campaign"""
        try:
            response = self.supabase.table('campaigns').insert(campaign_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Database error creating campaign: {e}")
            # Return mock campaign for demo
            return {
                "id": f"mock-{datetime.now().timestamp()}",
                **campaign_data,
                "created_at": datetime.now().isoformat()
            }
    
    def get_campaigns(self):
        """Get all campaigns"""
        try:
            response = self.supabase.table('campaigns').select('*').order('created_at', desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Database error fetching campaigns: {e}")
            return []
    
    # Message Management
    def create_message(self, message_data):
        """Create a new message record"""
        try:
            response = self.supabase.table('messages').insert(message_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Database error creating message: {e}")
            # Return mock message for demo
            return {
                "id": f"mock-{datetime.now().timestamp()}",
                **message_data,
                "created_at": datetime.now().isoformat()
            }
    
    def get_messages_by_campaign(self, campaign_id):
        """Get messages for a specific campaign"""
        try:
            response = self.supabase.table('messages').select('*').eq('campaign_id', campaign_id).execute()
            return response.data
        except Exception as e:
            print(f"Database error fetching messages: {e}")
            return []
    
    # Analytics
    def get_analytics_data(self):
        """Get analytics data from database"""
        try:
            # Get user stats
            users_response = self.supabase.table('users').select('*').execute()
            users = users_response.data
            
            # Get campaign stats
            campaigns_response = self.supabase.table('campaigns').select('*').execute()
            campaigns = campaigns_response.data
            
            # Get message stats
            messages_response = self.supabase.table('messages').select('*').execute()
            messages = messages_response.data
            
            return {
                'users': users,
                'campaigns': campaigns,
                'messages': messages
            }
        except Exception as e:
            print(f"Error fetching analytics: {e}")
            return {'users': [], 'campaigns': [], 'messages': []}
    
    # Authentication
    def create_admin_user(self, user_data):
        """Create admin user"""
        try:
            response = self.supabase.table('admin_users').insert(user_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating admin user: {e}")
            return None
    
    def get_admin_user_by_email(self, email):
        """Get admin user by email"""
        try:
            response = self.supabase.table('admin_users').select('*').eq('email', email).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Database error fetching admin user: {e}")
            # Fallback to mock admin user for demo
            if email == "admin@convexa.ai":
                return {
                    "id": "1",
                    "name": "Admin User",
                    "email": "admin@convexa.ai",
                    "password_hash": "$2b$12$PnK7I2.NpnEPDkIermTmiuK3ylrTrOy.lAf1xf3z2Y1I.SJlLNpmu",  # admin123
                    "role": "admin"
                }
            return None

# Initialize database instance
db = Database()