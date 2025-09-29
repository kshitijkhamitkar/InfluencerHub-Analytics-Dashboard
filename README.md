# Instagram Influencer Profile Dashboard

A complete MERN stack application that displays Instagram influencer profiles with comprehensive analytics, engagement metrics, and audience demographics.

## 🚀 Features

### Core Features
- **Influencer Profiles**: Display name, username, profile picture, followers, following, and post counts
- **Engagement Analytics**: Average likes, comments, and engagement rate calculations
- **Recent Posts Analysis**: Last 10+ posts with image analysis, keywords, vibe classification
- **Reels Analytics**: Recent reels with video analysis and performance metrics
- **Demographics Visualization**: Gender distribution, age groups, and geographic data

### Advanced Analytics
- **Content Analysis**: Automatic keyword extraction and vibe classification
- **Quality Indicators**: Lighting assessment, visual appeal scores, consistency ratings
- **Engagement Trends**: Interactive charts showing performance over time
- **Audience Insights**: Comprehensive demographic breakdowns with visualizations

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Charts**: Built with Chart.js for dynamic data visualization
- **Modern UI/UX**: Glass-morphism design with smooth animations
- **RESTful API**: Well-structured backend with proper error handling
- **Mock Data**: Realistic sample data for demonstration

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **React** - Frontend library
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **Axios** - HTTP client

## 📋 Prerequisites

Before running this project, make sure you have:
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd influencer-dashboard
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your MongoDB URI
echo "MONGODB_URI=mongodb://localhost:27017/influencer_db" > .env
echo "PORT=5000" >> .env

# Seed the database with mock data
npm run seed

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

### 4. Access the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
influencer-dashboard/
├── backend/
│   ├── models/
│   │   ├── Influencer.js      # Influencer schema
│   │   ├── Post.js            # Post schema
│   │   └── Reel.js            # Reel schema
│   ├── routes/
│   │   ├── influencers.js     # Influencer routes
│   │   ├── posts.js           # Posts routes
│   │   └── reels.js           # Reels routes
│   ├── scripts/
│   │   └── seedData.js        # Database seeding script
│   ├── server.js              # Express server setup
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js      # Navigation header
│   │   │   ├── InfluencerList.js   # Influencers listing
│   │   │   ├── InfluencerProfile.js # Main profile page
│   │   │   ├── Analytics.js   # Analytics dashboard
│   │   │   ├── Posts.js       # Posts display
│   │   │   ├── Reels.js       # Reels display
│   │   │   └── Demographics.js # Demographics charts
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Influencers
- `GET /api/influencers` - Get all influencers
- `GET /api/influencers/:id` - Get influencer by ID
- `GET /api/influencers/username/:username` - Get influencer by username
- `GET /api/influencers/:id/analytics` - Get influencer analytics

### Posts
- `GET /api/posts/influencer/:influencerId` - Get all posts for an influencer
- `GET /api/posts/influencer/:influencerId/recent` - Get recent posts (last 10)
- `GET /api/posts/influencer/:influencerId/analytics` - Get posts analytics

### Reels
- `GET /api/reels/influencer/:influencerId` - Get all reels for an influencer
- `GET /api/reels/influencer/:influencerId/recent` - Get recent reels (last 5)
- `GET /api/reels/influencer/:influencerId/analytics` - Get reels analytics

## 📊 Mock Data Features

The application includes realistic mock data featuring:

### Sample Influencers
- **Emma Johnson (@emmastyle)**: Fashion & Lifestyle blogger with 2.5M followers
- **Alex Chen (@alexfitness)**: Fitness coach with 1.8M followers

### Generated Content
- **Posts**: 15+ posts per influencer with realistic engagement metrics
- **Reels**: 8+ reels per influencer with video analysis
- **Analytics**: Comprehensive engagement trends and audience insights
- **Demographics**: Realistic audience distribution data

## 🎨 Design Features

- **Glass-morphism UI**: Modern translucent design elements
- **Gradient Backgrounds**: Beautiful color gradients throughout
- **Smooth Animations**: Hover effects and transitions
- **Interactive Charts**: Dynamic data visualization
- **Responsive Grid Layouts**: Adapts to all screen sizes
- **Emoji Integration**: Intuitive visual indicators

## 🔧 Configuration



### Proxy Configuration (Frontend)
The React app is configured to proxy API requests to `http://localhost:5000`

## 🚀 Deployment

### Backend Deployment (Render)
1. Set environment variables
2. Ensure MongoDB connection string is set
3. Deploy with build command: `npm install && npm start`

### Frontend Deployment (Render)
1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Configure API base URL for production

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test API endpoints
curl http://localhost:5000/api/influencers
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 Assumptions Made

1. **No Real Scraping**: Uses mock data instead of actual Instagram scraping
2. **No ML Models**: Content analysis uses predefined categories and random quality scores
3. **Simplified Authentication**: No user authentication implemented
4. **Static Media**: Uses Unsplash images for profile pictures and posts
5. **Demo Data**: All engagement metrics and demographics are simulated

## 🔮 Future Enhancements

- Real-time data integration
- User authentication and authorization
- Export functionality for analytics
- Comparison tools between influencers
- Advanced filtering and search
- Email reporting features
- Mobile app version

## 📄 License

This project is created for demonstration purposes. Feel free to use and modify as needed.



