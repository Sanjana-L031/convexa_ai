import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from datetime import datetime, timedelta
import json

class MLSegmentation:
    def __init__(self):
        self.scaler = StandardScaler()
        self.kmeans = KMeans(n_clusters=3, random_state=42)
        self.classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        
    def prepare_features(self, users_data):
        """Prepare features for ML segmentation"""
        df = pd.DataFrame(users_data)
        
        # Calculate derived features
        features = []
        for user in users_data:
            # Basic features
            total_spent = user.get('total_spent', 0)
            total_orders = user.get('total_orders', 0)
            cart_items_count = len(user.get('cart_items', []))
            
            # Behavioral features
            last_purchase_str = user.get('last_purchase_date')
            if last_purchase_str:
                last_purchase = datetime.fromisoformat(last_purchase_str.replace('Z', '+00:00'))
                days_since_purchase = (datetime.now() - last_purchase).days
            else:
                days_since_purchase = 365  # Default for new users
            
            # Engagement features
            avg_order_value = total_spent / max(total_orders, 1)
            purchase_frequency = total_orders / max(days_since_purchase, 1) * 30  # Orders per month
            
            # Cart abandonment
            cart_abandonment_rate = user.get('cart_abandonment_count', 0) / max(total_orders + user.get('cart_abandonment_count', 0), 1)
            
            # Session data
            avg_session_duration = user.get('avg_session_duration', 0)
            pages_per_session = user.get('pages_per_session', 0)
            
            features.append([
                total_spent,
                total_orders,
                avg_order_value,
                days_since_purchase,
                purchase_frequency,
                cart_items_count,
                cart_abandonment_rate,
                avg_session_duration,
                pages_per_session
            ])
        
        return np.array(features)
    
    def segment_users_ml(self, users_data):
        """Segment users using machine learning"""
        if not users_data:
            return []
        
        # Prepare features
        features = self.prepare_features(users_data)
        
        # Scale features
        features_scaled = self.scaler.fit_transform(features)
        
        # Perform clustering
        clusters = self.kmeans.fit_predict(features_scaled)
        
        # Analyze clusters and assign meaningful labels
        segmented_users = []
        for i, user in enumerate(users_data):
            cluster = clusters[i]
            
            # Determine segment based on cluster characteristics
            total_spent = user.get('total_spent', 0)
            total_orders = user.get('total_orders', 0)
            cart_items = len(user.get('cart_items', []))
            days_since_purchase = self._calculate_days_since_purchase(user.get('last_purchase_date'))
            
            # Rule-based segment assignment with ML cluster influence
            if total_spent > 1000 and total_orders > 3:
                segment = 'high_value'
                segment_label = 'High Value'
                segment_emoji = '💰'
            elif cart_items > 0 and days_since_purchase < 7:
                segment = 'abandoned_cart'
                segment_label = 'Abandoned Cart'
                segment_emoji = '🛒'
            elif days_since_purchase > 30:
                segment = 'inactive'
                segment_label = 'Inactive'
                segment_emoji = '😴'
            else:
                segment = 'potential'
                segment_label = 'Potential'
                segment_emoji = '🌟'
            
            user_copy = user.copy()
            user_copy['segment'] = segment
            user_copy['segment_label'] = segment_label
            user_copy['segment_emoji'] = segment_emoji
            user_copy['ml_cluster'] = int(cluster)
            user_copy['segment_confidence'] = self._calculate_confidence(features[i], cluster)
            
            segmented_users.append(user_copy)
        
        return segmented_users
    
    def _calculate_days_since_purchase(self, last_purchase_str):
        """Calculate days since last purchase"""
        if not last_purchase_str:
            return 365
        
        try:
            last_purchase = datetime.fromisoformat(last_purchase_str.replace('Z', '+00:00'))
            return (datetime.now() - last_purchase).days
        except:
            return 365
    
    def _calculate_confidence(self, features, cluster):
        """Calculate confidence score for segment assignment"""
        # Simple confidence based on distance to cluster center
        if hasattr(self.kmeans, 'cluster_centers_'):
            center = self.kmeans.cluster_centers_[cluster]
            distance = np.linalg.norm(features - center)
            # Convert distance to confidence (0-1 scale)
            confidence = max(0, 1 - (distance / 10))  # Normalize by expected max distance
            return round(confidence, 2)
        return 0.8  # Default confidence
    
    def get_segment_insights(self, segmented_users):
        """Get insights about user segments"""
        segments = {}
        
        for user in segmented_users:
            segment = user['segment']
            if segment not in segments:
                segments[segment] = {
                    'count': 0,
                    'total_revenue': 0,
                    'avg_order_value': 0,
                    'total_orders': 0
                }
            
            segments[segment]['count'] += 1
            segments[segment]['total_revenue'] += user.get('total_spent', 0)
            segments[segment]['total_orders'] += user.get('total_orders', 0)
        
        # Calculate averages
        for segment_data in segments.values():
            if segment_data['count'] > 0:
                segment_data['avg_revenue_per_user'] = segment_data['total_revenue'] / segment_data['count']
                segment_data['avg_order_value'] = segment_data['total_revenue'] / max(segment_data['total_orders'], 1)
        
        return segments
    
    def predict_churn_risk(self, user_data):
        """Predict churn risk for a user"""
        days_since_purchase = self._calculate_days_since_purchase(user_data.get('last_purchase_date'))
        total_orders = user_data.get('total_orders', 0)
        avg_session_duration = user_data.get('avg_session_duration', 0)
        
        # Simple churn risk calculation
        risk_score = 0
        
        if days_since_purchase > 60:
            risk_score += 0.4
        elif days_since_purchase > 30:
            risk_score += 0.2
        
        if total_orders < 2:
            risk_score += 0.3
        
        if avg_session_duration < 120:  # Less than 2 minutes
            risk_score += 0.2
        
        if user_data.get('cart_abandonment_count', 0) > 2:
            risk_score += 0.1
        
        return min(risk_score, 1.0)

# Initialize ML segmentation service
ml_segmentation = MLSegmentation()