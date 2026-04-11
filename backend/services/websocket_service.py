"""
WebSocket Service for Real-Time Data
Handles real-time customer data, cart updates, and live interactions
"""

import asyncio
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List
import threading
import time

class WebSocketService:
    def __init__(self):
        self.connected_clients = set()
        self.customer_data = {}
        self.real_time_events = []
        self.data_sources = {
            'shopify': {'status': 'connected', 'last_sync': datetime.now()},
            'woocommerce': {'status': 'connected', 'last_sync': datetime.now()},
            'whatsapp': {'status': 'connected', 'last_sync': datetime.now()},
            'instagram': {'status': 'connected', 'last_sync': datetime.now()},
            'google_analytics': {'status': 'connected', 'last_sync': datetime.now()}
        }
        
        # Start background data simulation
        self.start_data_simulation()
    
    def start_data_simulation(self):
        """Start background thread to simulate real-time data"""
        def simulate_data():
            while True:
                self.simulate_customer_activity()
                self.simulate_cart_updates()
                self.simulate_messaging_events()
                time.sleep(5)  # Update every 5 seconds
        
        thread = threading.Thread(target=simulate_data, daemon=True)
        thread.start()
    
    def simulate_customer_activity(self):
        """Simulate real-time customer activity"""
        customers = [
            "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Reddy", 
            "Vikram Singh", "Anita Desai", "Ravi Gupta", "Kavya Nair",
            "Arjun Mehta", "Deepika Roy"
        ]
        
        activities = [
            "viewed product page",
            "added item to cart",
            "started checkout",
            "abandoned cart",
            "completed purchase",
            "browsing category",
            "searching products",
            "reading reviews"
        ]
        
        customer = random.choice(customers)
        activity = random.choice(activities)
        
        event = {
            'type': 'customer_activity',
            'timestamp': datetime.now().isoformat(),
            'customer': customer,
            'activity': activity,
            'source': random.choice(['Shopify', 'WooCommerce']),
            'value': random.randint(500, 5000) if 'cart' in activity else None
        }
        
        self.broadcast_event(event)
    
    def simulate_cart_updates(self):
        """Simulate real-time cart updates"""
        products = [
            "Nike Air Max", "iPhone 15", "MacBook Pro", "Samsung TV",
            "Gaming Chair", "Wireless Headphones", "Smart Watch",
            "Laptop Stand", "Coffee Maker", "Bluetooth Speaker"
        ]
        
        event = {
            'type': 'cart_update',
            'timestamp': datetime.now().isoformat(),
            'customer': random.choice(["Rahul Sharma", "Priya Patel", "Sneha Reddy"]),
            'action': random.choice(['added', 'removed', 'updated']),
            'product': random.choice(products),
            'cart_value': random.randint(1000, 8000),
            'source': 'E-commerce Platform'
        }
        
        self.broadcast_event(event)
    
    def simulate_messaging_events(self):
        """Simulate real-time messaging events"""
        messages = [
            "Hi, I'm interested in this product",
            "Can you help me with my order?",
            "This seems expensive",
            "Do you have any discounts?",
            "When will my order arrive?",
            "I want to return this item"
        ]
        
        event = {
            'type': 'message_received',
            'timestamp': datetime.now().isoformat(),
            'customer': random.choice(["Rahul Sharma", "Priya Patel", "Amit Kumar"]),
            'message': random.choice(messages),
            'platform': random.choice(['WhatsApp', 'Instagram', 'Website Chat']),
            'sentiment': random.choice(['positive', 'neutral', 'negative'])
        }
        
        self.broadcast_event(event)
    
    def get_real_time_customer_data(self, customer_id):
        """Get real-time customer data with live updates"""
        base_customers = {
            "1": {
                "name": "Rahul Sharma",
                "email": "rahul@example.com",
                "segment": "High Value",
                "base_spent": 2500,
                "base_cart": ["iPhone 15", "AirPods"]
            },
            "2": {
                "name": "Priya Patel", 
                "email": "priya@example.com",
                "segment": "Abandoned Cart",
                "base_spent": 450,
                "base_cart": ["Laptop", "Mouse"]
            },
            "3": {
                "name": "Amit Kumar",
                "email": "amit@example.com", 
                "segment": "Inactive",
                "base_spent": 120,
                "base_cart": []
            }
        }
        
        if customer_id not in base_customers:
            return None
        
        customer = base_customers[customer_id].copy()
        
        # Add real-time data
        customer.update({
            'id': customer_id,
            'total_spent': customer['base_spent'] + random.randint(-100, 500),
            'cart_items': customer['base_cart'] + [f"Item_{random.randint(1,5)}"],
            'cart_value': random.randint(1000, 8000),
            'last_active': datetime.now().strftime("%H:%M"),
            'current_page': random.choice([
                '/products/nike-shoes', '/cart', '/checkout', 
                '/category/electronics', '/search?q=laptop'
            ]),
            'session_duration': random.randint(120, 600),
            'pages_visited': random.randint(3, 15),
            'platform_source': random.choice(['Shopify', 'WooCommerce']),
            'traffic_source': random.choice(['Google', 'Facebook', 'Direct', 'Email']),
            'device': random.choice(['Desktop', 'Mobile', 'Tablet']),
            'location': random.choice(['Mumbai', 'Delhi', 'Bangalore', 'Chennai']),
            'is_online': random.choice([True, False]),
            'last_message': random.choice([
                "Looking at this product",
                "Added to cart", 
                "Checking out",
                "Browsing categories"
            ]) if random.random() > 0.5 else None
        })
        
        return customer
    
    def get_live_analytics(self):
        """Get live analytics data"""
        return {
            'active_users': random.randint(45, 120),
            'cart_abandonment_rate': round(random.uniform(0.65, 0.85), 2),
            'conversion_rate': round(random.uniform(0.02, 0.08), 3),
            'avg_session_duration': random.randint(180, 420),
            'revenue_today': random.randint(15000, 45000),
            'orders_today': random.randint(25, 85),
            'top_products': [
                {'name': 'iPhone 15', 'views': random.randint(50, 200)},
                {'name': 'Nike Shoes', 'views': random.randint(30, 150)},
                {'name': 'MacBook Pro', 'views': random.randint(20, 100)}
            ],
            'traffic_sources': {
                'organic': random.randint(30, 50),
                'paid': random.randint(20, 35),
                'social': random.randint(15, 25),
                'direct': random.randint(10, 20)
            },
            'data_sources': self.data_sources,
            'last_updated': datetime.now().isoformat()
        }
    
    def broadcast_event(self, event):
        """Broadcast event to all connected clients"""
        self.real_time_events.append(event)
        
        # Keep only last 100 events
        if len(self.real_time_events) > 100:
            self.real_time_events = self.real_time_events[-100:]
        
        # In a real implementation, this would send to WebSocket clients
        print(f"📡 Broadcasting: {event['type']} - {event.get('customer', 'System')}")
    
    def get_recent_events(self, limit=20):
        """Get recent real-time events"""
        return self.real_time_events[-limit:] if self.real_time_events else []
    
    def simulate_platform_integration(self, platform, action):
        """Simulate integration with external platforms"""
        integrations = {
            'shopify': {
                'webhook_received': f"New order from Shopify: ₹{random.randint(1000, 5000)}",
                'cart_updated': f"Cart updated via Shopify API",
                'customer_created': f"New customer registered on Shopify"
            },
            'woocommerce': {
                'order_status_changed': f"Order status updated in WooCommerce",
                'product_viewed': f"Product viewed: {random.choice(['iPhone', 'Laptop', 'Shoes'])}",
                'checkout_started': f"Customer started checkout process"
            },
            'whatsapp': {
                'message_received': f"WhatsApp message: '{random.choice(['Hi', 'Help needed', 'Order status?'])}'",
                'message_sent': f"AI response sent via WhatsApp",
                'conversation_started': f"New WhatsApp conversation initiated"
            },
            'instagram': {
                'dm_received': f"Instagram DM received",
                'story_viewed': f"Customer viewed product story",
                'post_engaged': f"Customer engaged with product post"
            },
            'google_analytics': {
                'page_view': f"Page view: {random.choice(['/products', '/cart', '/checkout'])}",
                'goal_completed': f"Conversion goal completed",
                'session_started': f"New user session started"
            }
        }
        
        if platform in integrations and action in integrations[platform]:
            event = {
                'type': 'platform_integration',
                'platform': platform,
                'action': action,
                'message': integrations[platform][action],
                'timestamp': datetime.now().isoformat()
            }
            self.broadcast_event(event)
            return event
        
        return None

# Global WebSocket service instance
websocket_service = WebSocketService()