# Convexa AI - Advanced Marketing Personalization Platform

🚀 **AI-powered marketing personalization engine with real-time WebSocket integration and advanced customer engagement features**

## 🎯 **QUICK START - Application is Ready!**

### **Option 1: One-Click Start (Recommended)**
```bash
# Double-click start-app.bat or run:
start-app.bat
```

### **Option 2: Manual Start**
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend  
npm run dev
```

### **Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Login**: admin@convexa.ai / admin123

---

## 🌟 **Latest Features - Real-Time WebSocket Integration**

### 🔌 **Live WebSocket Connection**
- **Real-time customer activity feed** - See purchases, cart updates, and interactions as they happen
- **WebSocket-powered analytics** - Live metrics updating every 10 seconds
- **Multi-platform data integration** - Shopify, WooCommerce, WhatsApp, Instagram, Google Analytics
- **Connection status indicators** - Visual feedback for backend and WebSocket connectivity

### 📡 **Real-Time Data Sources**
- **E-commerce Platforms**: Shopify 🛒, WooCommerce 🛍️
- **Messaging Platforms**: WhatsApp 📱, Instagram 📸  
- **Analytics Tools**: Google Analytics 📊
- **Live customer selector** - Choose from real-time customer data across platforms

### 🎯 **Customer Selector Modal**
- **Search and filter customers** by segments and platforms
- **Real-time customer data** with live activity status
- **Platform source indicators** (Shopify, WhatsApp, etc.)
- **Confidence scores** for ML segmentation

## 🤖 **Advanced AI Features**

### 💬 **Real-Time AI Chat Assistant**
- **2-way intelligent conversations** with customers
- **Contextual responses** based on user segment and behavior
- **Sentiment analysis** and intent recognition
- **Suggested actions** for immediate follow-up
- **Live typing indicators** and conversation history

**Demo Flow:**
1. Customer: "This is too expensive"
2. AI: "Hi Rahul! As a valued customer, I can offer you 20% off right now! 💎"
3. System suggests: Apply discount, Send cart recovery

### ⚡ **Live Personalization Engine**
- **Instant message adaptation** based on cart value and behavior
- **Interactive controls** to see real-time changes
- **Smart send-time prediction** with AI confidence scores
- **Explainable AI insights** showing reasoning behind decisions

**Demo Flow:**
- Cart ₹1,000 → "Check this out 👀"
- Cart ₹10,000 → "Premium offer just for you 💎"
- **Message changes instantly** as you adjust parameters!

### 🧠 **Explainable AI**
- **"Why This User?"** reasoning display
- **Segment confidence scores** with ML explanations
- **Next best action** recommendations
- **Behavioral scoring** with real-time updates

## 🌟 Core Features

### 1. AI Personalization Engine
- **Input**: User name, cart items, behavior data
- **Output**: Smart, personalized marketing messages
- **AI Magic**: OpenAI-powered message generation

### 2. Campaign Builder
- Select target audience (High Value 💰, Abandoned Cart 🛒, Inactive 😴)
- Write campaign goals
- One-click campaign execution

### 3. Mock WhatsApp Integration
- Simulated message delivery
- Real-time delivery status
- "Delivered ✅" confirmation

### 4. User Segmentation (ML Logic)
- **High Value Users 💰**: Users with high purchase history
- **Abandoned Cart Users 🛒**: Users with items left in cart
- **Inactive Users 😴**: Users who haven't engaged recently

### 5. Analytics Dashboard
- Revenue tracking 📈
- Messages sent 📩
- Conversion rates 💸
- Interactive charts (Recharts)

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
Backend (Flask)
    ↓
AI Engine (OpenAI)
    ↓
Database (Supabase/Mock)
    ↓
Messaging (Mock WhatsApp)
```

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- Recharts for analytics
- Lucide React for icons
- React Router for navigation
- **Socket.IO Client** for real-time WebSocket connections
- **Axios** with fallback handling

**Backend:**
- Python Flask
- **Flask-SocketIO** for WebSocket support
- OpenAI API integration
- Flask-CORS for cross-origin requests
- Supabase for database (configurable)
- **Real-time data simulation** services

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Sanjana-L031/convexa_ai.git
cd convexa_ai
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies (including Flask-SocketIO)
pip install -r requirements.txt

# Start Flask server with WebSocket support
python app.py
```

### 4. WebSocket Testing
```bash
# Test WebSocket integration
python test_websocket_integration.py
```

### 4. Environment Configuration
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Add your API keys:
# OPENAI_API_KEY=your_key_here
# SUPABASE_URL=your_url_here
# SUPABASE_KEY=your_key_here
```

## 📱 UI Screens

### 1. Dashboard
- KPIs (Revenue, Users, Campaigns)
- Interactive charts
- Real-time analytics

### 2. Campaign Page
- Audience selection
- Campaign goal input
- AI message preview
- One-click execution

### 3. Users Page
- User segmentation table
- Search and filter functionality
- Segment statistics

### 4. AI Demo Center ⭐ **NEW**
- **Customer Selector Modal**: Choose from real-time customer data
- **Real-Time AI Chat**: Test 2-way conversations
  - Try: "This is too expensive", "I'm interested", "Tell me more"
- **Live Personalization**: Adjust sliders to see message changes
  - Cart value, time on page, pages visited
- **WebSocket Status**: Live connection indicators
- **Real-time Activity Feed**: See customer actions as they happen

## 🔥 What Makes This Winning

### AI WOW Factor
- **Personalized Messages**: AI generates unique messages per user
- **Smart Targeting**: ML-based user segmentation
- **Real-time Generation**: Instant message creation

### Business Value
- **Increased Conversions**: Smart targeting improves conversion rates
- **Automated Personalization**: Scale 1:1 marketing
- **Data-Driven Insights**: Analytics-powered decisions

### Clean UI
- **Professional Design**: Looks like real SaaS product
- **Intuitive Navigation**: Easy-to-use interface
- **Responsive Layout**: Works on all devices

### End-to-End Flow
```
Click → AI Generation → Send → Store → Analytics
```

## 🔧 API Endpoints

### Authentication
```bash
POST /api/auth/login
POST /api/auth/register
```

### Real-Time WebSocket APIs ⭐ **NEW**
```bash
GET /api/realtime/analytics        # Live analytics data
GET /api/realtime/events          # Recent customer events
GET /api/realtime/customer/:id    # Real-time customer data
POST /api/realtime/simulate/:platform/:action  # Simulate events
GET /api/integrations/status      # Platform integration status
```

### WebSocket Events
```javascript
// Client to Server
socket.emit('subscribe_customer', { customer_id: '123' })
socket.emit('simulate_event', { type: 'customer_activity' })

// Server to Client  
socket.on('analytics_update', (data) => { ... })
socket.on('live_events', (data) => { ... })
socket.on('customer_activity', (data) => { ... })
```

### Live Personalization
```bash
POST /api/personalization/live  # Real-time message adaptation
```

### Campaign Management
```bash
POST /api/campaign/trigger
GET /api/campaign/history
```

### Analytics & Users
```bash
GET /api/analytics
GET /api/users
```

## 🎯 **Enhanced Demo Flow**

1. **Dashboard**: View real-time analytics with WebSocket updates
2. **AI Demo Center**: 
   - Click "Select Customer" to open real-time customer selector
   - Choose from live customer data across platforms
   - Test AI chat with contextual responses
   - Use live personalization sliders
   - Watch real-time activity feed
3. **Campaign**: Select segments → AI generates messages → Track performance
4. **WebSocket Features**: See live customer activity, real-time analytics updates

### 🔌 **WebSocket Demo Steps**
1. Open AI Demo page
2. Check WebSocket connection status (🔵 WebSocket Live)
3. Click "Simulate Event" to generate real-time activity
4. Watch live customer activity feed update
5. See real-time analytics refresh automatically

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
# Push to your preferred platform
# Set environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Hackathon Ready

This project is designed to impress at hackathons with:
- ✅ Complete end-to-end functionality
- ✅ AI integration that actually works
- ✅ Professional UI/UX
- ✅ Real business value
- ✅ Scalable architecture
- ✅ Demo-ready features

## 🔐 Demo Credentials

**Admin Login:**
- Email: `admin@convexa.ai`
- Password: `admin123`

## 🎯 **Demo Flow**

1. **Login** with demo credentials
2. **Navigate to "AI Demo"** in sidebar
3. **Try Real-Time AI Chat:**
   - Type: "This is too expensive"
   - Watch AI respond with personalized offers
4. **Experience Live Personalization:**
   - Move cart value slider (₹100 → ₹10,000)
   - See message change instantly!
5. **View Explainable AI:**
   - See "Why This User?" reasoning
   - Check ML confidence scores

## 🔄 Current Status

### ✅ Fully Working Features
- **Authentication System**: JWT-based login/register
- **Premium Dashboard**: Real-time analytics with charts
- **AI Chat Assistant**: 2-way conversations with 10 demo users
- **Live Personalization**: Real-time message adaptation
- **User Segmentation**: ML-based customer categorization (10 users)
- **Campaign Builder**: AI-powered message generation
- **Campaign History**: Performance tracking and analytics
- **Database Integration**: Supabase with fallback mock data
- **Responsive UI**: Professional gradient-based design
- **⭐ WebSocket Integration**: Real-time customer activity and analytics
- **⭐ Customer Selector Modal**: Choose from live customer data
- **⭐ Multi-Platform Data Sources**: Shopify, WhatsApp, Instagram, etc.
- **⭐ Real-Time Activity Feed**: Live customer interactions

### 🚀 Ready to Demo
1. Start backend: `cd backend && python app.py` (now with WebSocket support)
2. Start frontend: `npm run dev`
3. Login with demo credentials
4. Navigate to "AI Demo" to experience advanced real-time features
5. Test WebSocket connectivity and real-time updates
6. Use customer selector modal to choose from live data

### 🔌 **WebSocket Features**
- **Real-time connection status** indicators
- **Live customer activity** simulation and display
- **WebSocket event broadcasting** for instant updates
- **Multi-platform data integration** simulation
- **Connection resilience** with automatic reconnection

### 👥 Demo Users Available
- **High Value**: Rahul Sharma (₹2,500), Sneha Reddy (₹3,200), Anita Desai (₹1,650), Kavya Nair (₹2,100), Deepika Roy (₹4,500)
- **Abandoned Cart**: Priya Patel (₹450), Vikram Singh (₹890), Ravi Gupta (₹75)
- **Inactive**: Amit Kumar (₹120), Arjun Mehta (₹340)

---

**Built with ❤️ for smart marketing automation**