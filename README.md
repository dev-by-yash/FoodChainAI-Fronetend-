# 🍽️ FoodChain AI - Advanced Food Waste Analytics Platform

## 📋 Overview

FoodChain AI is a comprehensive full-stack application designed to track, analyze, and reduce food waste using AI-powered insights. The platform combines real-time data visualization, OCR bill scanning, machine learning predictions, and NGO integration to create a complete food waste management ecosystem.

## ✨ Key Features

### Real-Time Analytics Dashboard
- Live food waste tracking with auto-refresh every 5 seconds
- Interactive charts (Line, Bar, Pie) using Recharts
- Dynamic metric analysis by Event Type, Seasonality, Location, Pricing, and Preparation Method
- Key performance indicators: Total Food, Total Waste, Food Saved, Average Waste %

### 📸 **Smart Bill Scanning (OCR)**
- Upload food bills/receipts as images
- Automatic text extraction using Tesseract.js
- Intelligent data parsing to extract:
  - Event Type
  - Quantity of Food
  - Wastage Amount
  - Geographical Location
- One-click save to database

### 🤖 **Machine Learning Predictions**
- Linear regression model for waste prediction
- Trained on historical food wastage data
- Predicts waste amount based on food quantity
- Helps in proactive waste management

### 📝 **Manual Data Entry**
- Add food waste data manually
- Support for multiple data fields:
  - Event Type
  - Quantity of Food
  - Storage Conditions
  - Purchase History
  - Seasonality
  - Preparation Method
  - Geographical Location
  - Pricing
  - Wastage Amount

### 🏢 **NGO Integration**
- Connect with NGOs for food donation
- Reduce waste by redistributing excess food

### 📱 **Mobile Support**
- React Native mobile app (Expo)
- Cross-platform support (iOS & Android)

## 🏗️ Technology Stack

### **Frontend**
- **Framework**: React 19.2.4 with Vite
- **Routing**: React Router DOM 7.14.2
- **Styling**: Tailwind CSS 3.4.19
- **Charts**: Recharts 3.8.1, Chart.js 4.5.1
- **OCR**: Tesseract.js 7.0.0
- **HTTP Client**: Axios 1.15.0
- **Icons**: Lucide React 1.7.0
- **Authentication**: Firebase 12.11.0

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose 9.4.1
- **File Upload**: Multer 2.1.1
- **OCR Processing**: Tesseract.js 7.0.0
- **AI Integration**: OpenAI 6.34.0
- **CSV Parsing**: csv-parser 3.2.0
- **Environment**: dotenv 17.4.1
- **CORS**: cors 2.8.6

### **Mobile**
- **Framework**: React Native (Expo)

## 📁 Project Structure

```
foodchain-ai-advanced/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Dashboard.jsx      # Main analytics dashboard
│   │   │   ├── ScanBill.jsx       # OCR bill scanning
│   │   │   ├── AddData.jsx        # Manual data entry
│   │   │   ├── Analysis.jsx       # Advanced analytics
│   │   │   ├── NGO.jsx            # NGO integration
│   │   │   ├── DataTable.jsx      # Data grid display
│   │   │   ├── WasteChart.jsx     # Waste visualization
│   │   │   ├── AIInsights.jsx     # AI-powered insights
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   └── Sidebar.jsx        # Side navigation
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx          # Authentication
│   │   │   ├── AddFood.jsx        # Add food page
│   │   │   └── UploadBill.jsx     # Bill upload page
│   │   ├── services/         # External services
│   │   │   └── firebase.js        # Firebase config
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   └── package.json
│
├── server/                   # Backend Node.js application
│   ├── routes/              # API endpoints
│   │   ├── foodRoutes.js         # Food CRUD operations
│   │   ├── mlRoutes.js           # ML predictions
│   │   └── ocrRoutes.js          # OCR processing
│   ├── models/              # Database schemas
│   │   └── Food.js               # Food waste model
│   ├── ml/                  # Machine learning
│   │   └── model.js              # Linear regression model
│   ├── uploads/             # Uploaded bill images
│   ├── server.js            # Express server
│   ├── importData.js        # CSV data importer
│   ├── food_wastage_data.csv    # Sample dataset
│   ├── .env                 # Environment variables
│   └── package.json
│
└── mobile/                  # React Native mobile app
    └── App.js
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd foodchain-ai-advanced
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
```

**Start the Backend Server:**
```bash
npm start
# Server runs on http://localhost:5000
```

### 3️⃣ Frontend Setup
```bash
cd client
npm install
```

**Start the Development Server:**
```bash
npm run dev
# Frontend runs on http://localhost:5173 (Vite default)
```

### 4️⃣ Mobile Setup (Optional)
```bash
cd mobile
npm install -g expo-cli
expo start
```

## 🔌 API Endpoints

### **Food Data Routes** (`/api/food`)
- `GET /api/food` - Fetch all food data (CSV + Database combined)
- `POST /api/food` - Add new food waste entry
- `GET /api/food/db` - View database entries only

### **Machine Learning Routes** (`/api/ml`)
- `POST /api/ml/predict` - Predict waste amount based on quantity
  ```json
  {
    "quantity": 100
  }
  ```

### **OCR Routes** (`/api/ocr`)
- `POST /api/ocr/scan` - Upload and scan bill image
  - Accepts: `multipart/form-data` with `bill` field
  - Returns: Extracted text from image

## Data Model

### Food Schema
```javascript
{
  "Event Type": String,           // e.g., "Wedding", "Party", "Restaurant"
  "Quantity of Food": Number,     // Total food quantity
  "Storage Conditions": String,   // Storage method
  "Purchase History": String,     // Purchase details
  "Seasonality": String,          // Season information
  "Preparation Method": String,   // How food was prepared
  "Geographical Location": String,// Location
  "Pricing": String,              // Price range
  "Wastage Food Amount": Number   // Amount wasted
}
```

## 🎯 Usage Guide

### **Dashboard**
1. Navigate to the home page to view real-time analytics
2. Use dropdown filters to analyze data by different dimensions
3. Monitor key metrics: Total Food, Waste, Saved Food, and Waste %
4. View interactive charts that update every 5 seconds

### **Scan Bill**
1. Go to the "Scan" page
2. Upload a food bill/receipt image
3. Wait for OCR processing
4. Review extracted data
5. Click "Save to Database" to store the information

### **Add Data Manually**
1. Navigate to "Add Data" page
2. Fill in the food waste details
3. Submit to save to database

### **ML Predictions**
1. Go to "Analysis" page
2. Enter food quantity
3. Get AI-powered waste prediction
4. Use insights for better planning

### **NGO Integration**
1. Visit "NGO" page
2. Connect with local NGOs
3. Coordinate food donations

## 🔧 Configuration

### **Vite Configuration** (`client/vite.config.js`)
```javascript
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

### **Tailwind Configuration** (`client/tailwind.config.js`)
Customize colors, fonts, and design tokens

### **Firebase Configuration** (`client/src/services/firebase.js`)
Add your Firebase credentials for authentication

## 🧪 Testing

```bash
# Frontend
cd client
npm run lint

# Backend
cd server
npm test
```

## Build for Production

### Frontend
```bash
cd client
npm run build
# Output: dist/ folder
```

### Backend
```bash
cd server
npm start
# Use PM2 or similar for production deployment
```

## 🌟 Features in Detail

### **Real-Time Data Sync**
- Dashboard auto-refreshes every 5 seconds
- Combines CSV data with live database entries
- Seamless data flow from backend to frontend

### **Intelligent OCR**
- Supports various bill formats
- Regex-based data extraction
- Handles text variations and formatting issues

### **Machine Learning**
- Linear regression model
- Trained on historical data
- Provides waste predictions for planning

### **Responsive Design**
- Mobile-first approach
- Tailwind CSS for consistent styling
- Dark theme for better UX

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Known Issues

- OCR accuracy depends on image quality
- MongoDB connection string is exposed in .env (use environment variables in production)
- Mobile app needs additional configuration

## 🔮 Future Enhancements

- [ ] AI-powered waste reduction recommendations
- [ ] Integration with more NGOs
- [ ] Blockchain for food donation tracking
- [ ] Advanced ML models (Random Forest, Neural Networks)
- [ ] Multi-language support
- [ ] Push notifications for waste alerts
- [ ] Export reports as PDF
- [ ] Social sharing features

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for a sustainable future**
