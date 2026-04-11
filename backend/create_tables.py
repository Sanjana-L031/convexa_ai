#!/usr/bin/env python3
"""
Script to create database tables in Supabase
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

def create_tables():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"🔗 Connecting to Supabase: {SUPABASE_URL}")
        
        # Read the SQL file
        with open('../database_setup.sql', 'r') as f:
            sql_content = f.read()
        
        # Split SQL into individual statements
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
        
        print("🚀 Creating database tables...")
        
        for i, statement in enumerate(statements):
            if statement and not statement.startswith('--'):
                try:
                    # Execute each statement
                    result = supabase.rpc('exec_sql', {'sql': statement + ';'}).execute()
                    print(f"✅ Statement {i+1}/{len(statements)} executed successfully")
                except Exception as e:
                    print(f"⚠️  Statement {i+1} failed (might already exist): {str(e)[:100]}...")
                    continue
        
        print("🎉 Database setup completed!")
        
        # Test connection by fetching users
        try:
            users = supabase.table('users').select('*').limit(1).execute()
            print(f"✅ Database connection test successful! Found {len(users.data)} users")
        except Exception as e:
            print(f"❌ Database test failed: {e}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_tables()