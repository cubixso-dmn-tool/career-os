# Firebase Unauthorized Domain Fix

## 🚨 Error: "Unauthorized domain for Google sign-in"

This error occurs when your current domain isn't authorized in Firebase Console.

## 🔧 Quick Fix Steps:

### 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `career-os-1c775`
3. Go to **Authentication** → **Settings**
4. Scroll to **Authorized domains**
5. Add these domains:

```
localhost
127.0.0.1
your-vercel-app.vercel.app
```

### 2. Common Domain Patterns:
- **Local Dev**: `localhost`, `127.0.0.1`
- **Vercel**: `your-app.vercel.app`
- **Custom**: Your custom domain

### 3. Check Current Domain:
Look at your browser's address bar - whatever domain you're using needs to be in the authorized list.

### 4. Firebase Default Domains:
Firebase automatically includes:
- `localhost` (usually)
- `your-project.firebaseapp.com`
- `your-project.web.app`

## 🔍 Troubleshooting:

**If still getting error:**
1. Clear browser cache
2. Try incognito/private window
3. Wait 5-10 minutes after adding domain
4. Check exact domain spelling (no typos)
5. Ensure protocol matches (http vs https)

**Common mistakes:**
- Forgot to add `localhost` for development
- Added `http://localhost` instead of just `localhost`
- Typo in domain name
- Using IP address instead of domain name

## 📱 Testing:
1. Add domain to Firebase
2. Wait a few minutes
3. Try Google sign-in again
4. Should work without errors

## 🚀 Production Deployment:
Before deploying to Vercel, make sure to add your Vercel domain to Firebase authorized domains list.