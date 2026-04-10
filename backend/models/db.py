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
            print(f"Error fetching users: {e}")
            return []
    
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
            print(f"Error creating campaign: {e}")
            return None
    
    def get_campaigns(self):
        """Get all campaigns"""
        try:
            response = self.supabase.table('campaigns').select('*').order('created_at', desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching campaigns: {e}")
            return []
    
    # Message Management
    def create_message(self, message_data):
        """Create a new message record"""
        try:
            response = self.supabase.table('messages').insert(message_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating message: {e}")
            return None
    
    def get_messages_by_campaign(self, campaign_id):
        """Get messages for a specific campaign"""
        try:
            response = self.supabase.table('messages').select('*').eq('campaign_id', campaign_id).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching messages: {e}")
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
            print(f"Error fetching admin user: {e}")
            return None

# Initialize database instance
db = Database()