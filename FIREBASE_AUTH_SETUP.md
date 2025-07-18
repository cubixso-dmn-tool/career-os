# Firebase Authentication Setup Guide

## 🔥 Firebase Authentication with Google & GitHub

We've migrated from custom OAuth to Firebase Authentication for better security and ease of use.

## Steps to Configure Firebase Authentication

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enter project name: "CareerOS" (or your preferred name)
4. Enable Google Analytics (optional)
5. Wait for project creation

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" 
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Google**: Click "Google" → Enable → Configure
   - **GitHub**: Click "GitHub" → Enable → Add Client ID and Secret from GitHub

### 3. Configure Web App
1. Go to Project Settings (gear icon)
2. In "General" tab, scroll to "Your apps"
3. Click "Add app" → Web app (</>) 
4. Register app name: "CareerOS Web"
5. Copy the Firebase config object

### 4. Update Environment Variables
Add the Firebase config to your `.env` file:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY="your_api_key_here"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID="your_project_id"
```

### 🔐 Security Note about Firebase API Keys
Firebase API keys are **public identifiers** and are safe to expose in frontend code. However:
- They identify your Firebase project, not authenticate requests
- Security is handled by Firebase Auth rules and domain restrictions
- Make sure to configure authorized domains in Firebase Console
- Keep your `.env` file in `.gitignore` (already done)

### 5. GitHub OAuth Setup (for GitHub provider)
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - App name: "CareerOS"
   - Homepage URL: `http://localhost:5000` (dev) or your domain
   - Authorization callback URL: `https://your-project.firebaseapp.com/__/auth/handler`
4. Copy Client ID and Client Secret
5. Add them to Firebase Console → Authentication → Sign-in method → GitHub

### 6. Configure Domain Restrictions (Security)
1. In Firebase Console, go to "Authentication" → "Settings"
2. Under "Authorized domains", add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `your-app.vercel.app`)
3. This prevents unauthorized domains from using your Firebase project

### 7. Install Dependencies (if not already installed)
```bash
npm install firebase firebase-admin
```

### 8. Restart the Server
```bash
npm run dev
```

## How Firebase Authentication Works

### 🔄 Complete Flow:
1. **User clicks "Google"** → Firebase popup opens
2. **Account Selection** → User chooses Google account  
3. **Permission Grant** → User grants email/profile access
4. **Firebase Auth** → Firebase handles OAuth flow
5. **User Sync** → Our system syncs Firebase user to database
6. **JWT Tokens** → Generate our own JWT tokens for API access
7. **Dashboard Redirect** → User lands on dashboard

### 🔍 User Management:
- **Existing User**: Authenticates and updates profile data
- **New User**: Creates account with Google/GitHub email/name
- **Session**: Uses Firebase ID tokens + our JWT tokens

## 🛡️ Security Features
- ✅ Firebase handles all OAuth complexity
- ✅ Account selection prompt (Google)
- ✅ Secure popup-based authentication
- ✅ Automatic user creation/linking by email
- ✅ Firebase ID token verification
- ✅ Our JWT tokens for API access
- ✅ Session management across browser tabs

## 🔧 Troubleshooting
- **"Firebase not configured"**: Check environment variables
- **"Popup blocked"**: Allow popups for your domain
- **"GitHub OAuth error"**: Verify callback URL in GitHub settings
- **"User sync failed"**: Check server logs for database errors
- **"Domain not authorized"**: Add your domain to Firebase authorized domains
- **Vercel "KEY" warning**: Firebase API keys are public identifiers, safe to expose

## 🎯 Benefits of Firebase Auth
- **No OAuth setup complexity**
- **Built-in security best practices**
- **Account linking and provider management**
- **Real-time auth state management**
- **Automatic token refresh**
- **Multi-provider support**

## 📱 Demo Mode
Without Firebase config, the app falls back to demo mode with mock users.