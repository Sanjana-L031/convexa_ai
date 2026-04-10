-- Convexa AI Database Setup for Supabase
-- Run these commands in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for ecommerce customers
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    total_spent DECIMAL(10,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    cart_items JSONB DEFAULT '[]',
    last_purchase_date TIMESTAMP WITH TIME ZONE,
    cart_abandonment_count INTEGER DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0, -- in seconds
    pages_per_session DECIMAL(5,2) DEFAULT 0,
    segment VARCHAR(50),
    segment_confidence DECIMAL(3,2) DEFAULT 0,
    ml_cluster INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    audience VARCHAR(100) NOT NULL,
    goal TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    created_by UUID REFERENCES admin_users(id),
    messages_sent INTEGER DEFAULT 0,
    estimated_reach INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    platform VARCHAR(50) DEFAULT 'whatsapp',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_interactions table for tracking engagement
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'page_view', 'add_to_cart', 'purchase', etc.
    interaction_data JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_segment ON users(segment);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);

-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (name, email, password_hash, role) 
VALUES (
    'Admin User', 
    'admin@convexa.ai', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrmu.Iq', -- bcrypt hash for 'admin123'
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample users with realistic ecommerce data
INSERT INTO users (name, email, phone, total_spent, total_orders, cart_items, last_purchase_date, cart_abandonment_count, avg_session_duration, pages_per_session) VALUES
('Rahul Sharma', 'rahul@example.com', '+91-9876543210', 2500.00, 5, '["iPhone 15", "AirPods"]', '2024-04-05T10:30:00Z', 1, 450, 8.5),
('Priya Patel', 'priya@example.com', '+91-9876543211', 450.00, 2, '["Laptop", "Mouse"]', '2024-03-20T14:15:00Z', 3, 320, 5.2),
('Amit Kumar', 'amit@example.com', '+91-9876543212', 120.00, 1, '[]', '2024-02-10T16:45:00Z', 0, 180, 3.1),
('Sneha Reddy', 'sneha@example.com', '+91-9876543213', 3200.00, 8, '["MacBook Pro"]', '2024-04-10T09:20:00Z', 2, 520, 12.3),
('Vikram Singh', 'vikram@example.com', '+91-9876543214', 890.00, 3, '["Gaming Chair", "Keyboard"]', '2024-04-07T11:30:00Z', 4, 380, 7.8),
('Anita Desai', 'anita@example.com', '+91-9876543215', 1650.00, 6, '["Smartwatch", "Headphones"]', '2024-04-08T15:45:00Z', 1, 410, 9.2),
('Ravi Gupta', 'ravi@example.com', '+91-9876543216', 75.00, 1, '["Phone Case"]', '2024-01-15T12:00:00Z', 5, 120, 2.5),
('Kavya Nair', 'kavya@example.com', '+91-9876543217', 2100.00, 7, '["Tablet", "Stylus"]', '2024-04-09T13:20:00Z', 2, 480, 10.1),
('Arjun Mehta', 'arjun@example.com', '+91-9876543218', 340.00, 2, '[]', '2024-03-25T10:15:00Z', 3, 250, 4.3),
('Deepika Roy', 'deepika@example.com', '+91-9876543219', 4500.00, 12, '["Camera", "Lens"]', '2024-04-11T08:30:00Z', 1, 600, 15.7)
ON CONFLICT (email) DO NOTHING;

-- Insert sample user interactions
INSERT INTO user_interactions (user_id, interaction_type, interaction_data, session_id) 
SELECT 
    u.id,
    'page_view',
    '{"page": "/products", "duration": 120}',
    'session_' || generate_random_uuid()
FROM users u
LIMIT 5;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Allow service role to access all data
CREATE POLICY "Service role can access all admin_users" ON admin_users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all users" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all campaigns" ON campaigns FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all messages" ON messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all user_interactions" ON user_interactions FOR ALL USING (auth.role() = 'service_role');

-- Create views for analytics
CREATE OR REPLACE VIEW campaign_analytics AS
SELECT 
    c.id,
    c.name,
    c.audience,
    c.status,
    COUNT(m.id) as messages_sent,
    COUNT(CASE WHEN m.status = 'delivered' THEN 1 END) as messages_delivered,
    COUNT(CASE WHEN m.read_at IS NOT NULL THEN 1 END) as messages_read,
    COUNT(CASE WHEN m.clicked_at IS NOT NULL THEN 1 END) as messages_clicked,
    ROUND(
        (COUNT(CASE WHEN m.clicked_at IS NOT NULL THEN 1 END)::DECIMAL / NULLIF(COUNT(m.id), 0)) * 100, 
        2
    ) as click_rate,
    c.created_at
FROM campaigns c
LEFT JOIN messages m ON c.id = m.campaign_id
GROUP BY c.id, c.name, c.audience, c.status, c.created_at;

CREATE OR REPLACE VIEW user_segment_analytics AS
SELECT 
    segment,
    COUNT(*) as user_count,
    SUM(total_spent) as total_revenue,
    AVG(total_spent) as avg_revenue_per_user,
    SUM(total_orders) as total_orders,
    AVG(total_orders) as avg_orders_per_user,
    AVG(avg_session_duration) as avg_session_duration,
    AVG(pages_per_session) as avg_pages_per_session
FROM users 
WHERE segment IS NOT NULL
GROUP BY segment;

-- Grant permissions to authenticated users
GRANT SELECT ON campaign_analytics TO authenticated;
GRANT SELECT ON user_segment_analytics TO authenticated;

COMMIT;