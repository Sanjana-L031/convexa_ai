from datetime import datetime, timedelta
import json

class MLSegmentation:
    def __init__(self):
        # Simple rule-based ML simulation
        self.segment_weights = {
            'total_spent': 0.3,
            'total_orders': 0.2,
            'days_since_purchase': 0.25,
            'cart_items': 0.15,
            'session_engagement': 0.1
        }
        
    def prepare_features(self, users_data):
        """Prepare features for ML segmentation"""
        features = []
        for user in users_data:
            # Basic features
            total_spent = user.get('total_spent', 0)
            total_orders = user.get('total_orders', 0)
            cart_items_count = len(user.get('cart_items', []))
            
            # Behavioral features
            last_purchase_str = user.get('last_purchase_date')
            if last_purchase_str:
                try:
                    last_purchase = datetime.fromisoformat(last_purchase_str.replace('Z', '+00:00'))
                    days_since_purchase = (datetime.now() - last_purchase).days
                except:
                    days_since_purchase = 365
            else:
                days_since_purchase = 365
            
            # Engagement features
            avg_order_value = total_spent / max(total_orders, 1)
            purchase_frequency = total_orders / max(days_since_purchase, 1) * 30
            
            # Cart abandonment
            cart_abandonment_rate = user.get('cart_abandonment_count', 0) / max(total_orders + user.get('cart_abandonment_count', 0), 1)
            
            # Session data
            avg_session_duration = user.get('avg_session_duration', 0)
            pages_per_session = user.get('pages_per_session', 0)
            
            features.append({
                'user_id': user.get('id'),
                'total_spent': total_spent,
                'total_orders': total_orders,
                'avg_order_value': avg_order_value,
                'days_since_purchase': days_since_purchase,
                'purchase_frequency': purchase_frequency,
                'cart_items_count': cart_items_count,
                'cart_abandonment_rate': cart_abandonment_rate,
                'avg_session_duration': avg_session_duration,
                'pages_per_session': pages_per_session
            })
        
        return features
    
    def segment_users_ml(self, users_data):
        """Segment users using rule-based ML approach"""
        if not users_data:
            return []
        
        # Prepare features
        features = self.prepare_features(users_data)
        
        # Apply ML-like segmentation rules
        segmented_users = []
        for i, user in enumerate(users_data):
            feature = features[i]
            
            # Calculate ML score for each segment
            high_value_score = self._calculate_high_value_score(feature)
            abandoned_cart_score = self._calculate_abandoned_cart_score(feature)
            inactive_score = self._calculate_inactive_score(feature)
            
            # Determine segment based on highest score
            scores = {
                'high_value': high_value_score,
                'abandoned_cart': abandoned_cart_score,
                'inactive': inactive_score
            }
            
            predicted_segment = max(scores, key=scores.get)
            confidence = scores[predicted_segment]
            
            # Map segments to labels
            segment_mapping = {
                'high_value': {'label': 'High Value', 'emoji': '💰'},
                'abandoned_cart': {'label': 'Abandoned Cart', 'emoji': '🛒'},
                'inactive': {'label': 'Inactive', 'emoji': '😴'}
            }
            
            user_copy = user.copy()
            user_copy['segment'] = predicted_segment
            user_copy['segment_label'] = segment_mapping[predicted_segment]['label']
            user_copy['segment_emoji'] = segment_mapping[predicted_segment]['emoji']
            user_copy['ml_cluster'] = hash(predicted_segment) % 3  # Simulate cluster
            user_copy['segment_confidence'] = round(confidence, 2)
            
            segmented_users.append(user_copy)
        
        return segmented_users
    
    def _calculate_high_value_score(self, feature):
        """Calculate high value segment score"""
        score = 0
        
        # High spending
        if feature['total_spent'] > 1000:
            score += 0.4
        elif feature['total_spent'] > 500:
            score += 0.2
        
        # Frequent orders
        if feature['total_orders'] > 5:
            score += 0.3
        elif feature['total_orders'] > 2:
            score += 0.15
        
        # Recent activity
        if feature['days_since_purchase'] < 30:
            score += 0.2
        elif feature['days_since_purchase'] < 60:
            score += 0.1
        
        # High engagement
        if feature['avg_session_duration'] > 300:
            score += 0.1
        
        return min(score, 1.0)
    
    def _calculate_abandoned_cart_score(self, feature):
        """Calculate abandoned cart segment score"""
        score = 0
        
        # Has items in cart
        if feature['cart_items_count'] > 0:
            score += 0.5
        
        # High abandonment rate
        if feature['cart_abandonment_rate'] > 0.3:
            score += 0.3
        
        # Recent but not too recent activity
        if 1 < feature['days_since_purchase'] < 14:
            score += 0.2
        
        return min(score, 1.0)
    
    def _calculate_inactive_score(self, feature):
        """Calculate inactive segment score"""
        score = 0
        
        # Long time since purchase
        if feature['days_since_purchase'] > 60:
            score += 0.4
        elif feature['days_since_purchase'] > 30:
            score += 0.2
        
        # Low engagement
        if feature['avg_session_duration'] < 120:
            score += 0.2
        
        # Few orders
        if feature['total_orders'] < 2:
            score += 0.2
        
        # Low spending
        if feature['total_spent'] < 200:
            score += 0.2
        
        return min(score, 1.0)
    
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
        
        if avg_session_duration < 120:
            risk_score += 0.2
        
        if user_data.get('cart_abandonment_count', 0) > 2:
            risk_score += 0.1
        
        return min(risk_score, 1.0)
    
    def _calculate_days_since_purchase(self, last_purchase_str):
        """Calculate days since last purchase"""
        if not last_purchase_str:
            return 365
        
        try:
            last_purchase = datetime.fromisoformat(last_purchase_str.replace('Z', '+00:00'))
            return (datetime.now() - last_purchase).days
        except:
            return 365

# Initialize ML segmentation service
ml_segmentation = MLSegmentation()