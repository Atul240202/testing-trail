# Pause App - Stress Management & Wellness Platform

A full-stack application for stress management and wellness tracking with React Native mobile app and Node.js backend.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Mobile Setup](#mobile-setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 📁 Project Structure

```
Pause-App-Official/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Database and app configuration
│   │   │   └── database.js
│   │   ├── controllers/       # Request handlers
│   │   │   ├── resetController.js
│   │   │   └── user.controller.js
│   │   ├── middlewares/       # Express middlewares
│   │   │   └── tempAuthMiddleware.js
│   │   ├── models/            # MongoDB models
│   │   │   ├── ResetSession.js
│   │   │   └── User.js
│   │   ├── routes/            # API routes
│   │   │   ├── resetRoutes.js
│   │   │   └── user.routes.js
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── validators/        # Input validation
│   │   │   └── resetValidator.js
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Server entry point
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── README.md
│
├── mobile/                    # React Native mobile app
│   ├── android/              # Android native code
│   ├── ios/                  # iOS native code
│   ├── src/
│   │   ├── api/             # API client and endpoints
│   │   │   └── client.ts
│   │   ├── assets/          # Images, fonts, etc.
│   │   │   ├── fonts/
│   │   │   └── images/
│   │   ├── auth/            # Authentication services
│   │   │   ├── GoogleAuthService.ts
│   │   │   └── index.ts
│   │   ├── components/      # Reusable components
│   │   │   ├── onboarding/
│   │   │   ├── reset/
│   │   │   └── PauseButton.tsx
│   │   ├── config/          # App configuration
│   │   │   └── auth.config.ts
│   │   ├── constants/       # App constants
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useGoogleAuth.ts
│   │   ├── navigation/      # Navigation setup
│   │   ├── screens/         # App screens
│   │   │   ├── SplashScreen1.tsx
│   │   │   ├── SplashScreen2.tsx
│   │   │   ├── SplashScreen3.tsx
│   │   │   ├── SplashScreen4.tsx
│   │   │   ├── GoogleAuthScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   └── HomeScreen.tsx
│   │   ├── store/           # State management
│   │   ├── theme/           # Theme configuration
│   │   │   └── colors.ts
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # App entry point
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md                 # This file
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required for All Platforms
- **Node.js** >= 20.0.0 ([Download](https://nodejs.org/))
- **npm** >= 10.0.0 (comes with Node.js)
- **MongoDB** >= 6.0 ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/downloads))

### For iOS Development (macOS only)
- **Xcode** >= 15.0 ([Mac App Store](https://apps.apple.com/us/app/xcode/id497799835))
- **CocoaPods** >= 1.15.0
  ```bash
  sudo gem install cocoapods
  ```
- **Xcode Command Line Tools**
  ```bash
  xcode-select --install
  ```

### For Android Development
- **Android Studio** ([Download](https://developer.android.com/studio))
- **JDK** >= 17 ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Android SDK** (installed via Android Studio)
- **Android Emulator** or physical device

### Verify Installation
```bash
node --version    # Should be >= 20.0.0
npm --version     # Should be >= 10.0.0
mongod --version  # Should be >= 6.0.0
pod --version     # Should be >= 1.15.0 (macOS only)
```

## 🚀 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/Pause
```

### 4. Start MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/your/data/directory

# Verify MongoDB is running
mongosh
```

### 5. Start Backend Server
```bash
npm run dev
```

Backend should be running at `http://localhost:5001`

### Verify Backend is Running
```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-02-16T...",
  "uptime": 1.234
}
```

## 📱 Mobile Setup

### 1. Navigate to Mobile Directory
```bash
cd mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Google OAuth 2.0 Configuration
GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

**Get Google OAuth Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

### 4. iOS Setup (macOS only)

#### Install Ruby Dependencies
```bash
bundle install
```

#### Install iOS Pods
```bash
cd ios
pod install
cd ..
```

### 5. Android Setup

#### Configure Android SDK
Open Android Studio and ensure:
- Android SDK is installed
- Android SDK Platform-Tools is installed
- Android Emulator is set up

#### Set Environment Variables (if needed)
```bash
# Add to ~/.zshrc or ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## ▶️ Running the Application

### Start Metro Bundler
```bash
cd mobile
npm start
```

### Run on iOS (macOS only)
```bash
# In a new terminal
cd mobile
npm run ios

# Or specify simulator
npm run ios -- --simulator="iPhone 15 Pro"
```

### Run on Android
```bash
# In a new terminal
cd mobile
npm run android

# Or specify emulator
npm run android -- --deviceId=emulator-5554
```

### Run on Physical Device

#### iOS
1. Open `mobile/ios/PauseFrontend.xcworkspace` in Xcode
2. Select your device from the device list
3. Click Run button or press Cmd+R

#### Android
1. Enable USB debugging on your device
2. Connect device via USB
3. Run `adb devices` to verify connection
4. Run `npm run android`

## 🔐 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/Pause
```

### Mobile (.env)
```env
# Google OAuth 2.0 Configuration
GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB 9.2.1 with Mongoose
- **Validation:** Joi 18.0.2
- **Logging:** Morgan 1.10.1
- **Environment:** dotenv 17.2.4

### Mobile
- **Framework:** React Native 0.83.1
- **Language:** TypeScript 5.8.3
- **Navigation:** React Navigation 7.x
- **Styling:** NativeWind 4.2.1 (Tailwind CSS)
- **Authentication:** @react-native-google-signin/google-signin 16.1.1
- **UI Components:**
  - React Native Vector Icons 10.3.0
  - React Native Linear Gradient 2.8.3
  - React Native Reanimated 4.2.1
  - React Native Safe Area Context 5.5.2

## ✨ Features

### Current Features
- ✅ Google OAuth 2.0 Authentication
- ✅ Multi-step Onboarding Flow
- ✅ Personalized User Profiles
- ✅ Reset Session Tracking
- ✅ User Statistics Dashboard
- ✅ Stress Management Tools

### Upcoming Features
- 🔄 Smart Watch Integration
- 🔄 Real-time Stress Detection
- 🔄 Guided Meditation Sessions
- 🔄 Progress Analytics
- 🔄 Social Features

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api/v1
```

### Endpoints

#### Health Check
```http
GET /health
```

#### User Management
```http
POST   /users              # Create new user
```

#### Reset Sessions
```http
POST   /reset-sessions           # Start reset session
PUT    /reset-sessions/:id       # End reset session
GET    /reset-sessions           # Get user's reset history
GET    /reset-sessions/stats     # Get user statistics
POST   /reset-sessions/sync      # Bulk sync sessions
```

### Request Headers
```http
Content-Type: application/json
x-user-id: <user-id>
```

### Example Request
```bash
curl -X POST http://localhost:5001/api/v1/reset-sessions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 507f1f77bcf86cd799439011" \
  -d '{
    "startTime": "2024-02-16T10:00:00Z",
    "type": "meditation"
  }'
```

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/data
```

#### Port Already in Use
```bash
# Find process using port 5001
lsof -ti:5001

# Kill the process
lsof -ti:5001 | xargs kill -9
```

#### Module Not Found
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Mobile Issues

#### iOS Build Fails

**Clean Build:**
```bash
cd mobile/ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
npm run ios
```

**Clear Derived Data:**
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```

**Reset Metro Cache:**
```bash
npm start -- --reset-cache
```

#### Android Build Fails

**Clean Gradle:**
```bash
cd mobile/android
./gradlew clean
cd ..
npm run android
```

**Clear Build Cache:**
```bash
cd mobile/android
rm -rf .gradle build app/build
cd ..
```

#### Metro Bundler Issues

**Clear All Caches:**
```bash
cd mobile
npm start -- --reset-cache

# Or manually
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
npm install
```

#### Google Sign-In Not Working

**iOS:**
1. Verify `GOOGLE_IOS_CLIENT_ID` in `.env`
2. Check URL schemes in `Info.plist`
3. Rebuild app after changing `.env`

**Android:**
1. Verify `GOOGLE_ANDROID_CLIENT_ID` in `.env`
2. Check SHA-1 fingerprint matches Google Console
3. Rebuild app after changing `.env`

#### Common Errors

**Error: Unable to resolve module**
```bash
cd mobile
npm install
npm start -- --reset-cache
```

**Error: Command PhaseScriptExecution failed**
```bash
cd mobile/ios
pod install
cd ..
```

**Error: ENOSPC: System limit for number of file watchers reached**
```bash
# Increase file watchers (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 📝 Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Mobile
```bash
npm start        # Start Metro bundler
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
npm run lint     # Run ESLint
npm test         # Run tests
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow existing code patterns
- Use TypeScript for mobile app
- Add JSDoc comments for functions
- Run linter before committing

## 📄 License

This project is proprietary and confidential.

## 👥 Team

- **Development Team:** NextYou Innovations
- **Project:** Pause App v1

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

---

**Note:** This is a development setup guide. For production deployment, additional configuration and security measures are required.
