# Convexa AI - Smart Marketing Personalization Platform

🚀 **AI-powered marketing personalization engine that generates smart, targeted messages for different user segments**

## 🌟 Features

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

**Backend:**
- Python Flask
- OpenAI API integration
- Flask-CORS for cross-origin requests
- Supabase for database (configurable)

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

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
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

### 4. History Page
- Past campaign performance
- Conversion tracking
- Revenue analytics

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

### Campaign Management
```bash
POST /api/campaign/trigger
GET /api/campaign/history
```

### Analytics
```bash
GET /api/analytics
```

### User Management
```bash
GET /api/users
```

## 🎯 Demo Flow

1. **Dashboard**: View analytics and KPIs
2. **Campaign**: Select "High Value Users" → Enter goal → Click "Run Campaign"
3. **AI Magic**: Watch AI generate personalized messages
4. **WhatsApp**: See mock delivery confirmation
5. **Analytics**: Track campaign performance in real-time

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

---

**Built with ❤️ for smart marketing automation**