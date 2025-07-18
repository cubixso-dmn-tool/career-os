import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
let adminApp;
if (getApps().length === 0) {
  // For production, use service account key
  // For development, you can use the Firebase emulator or service account
  try {
    adminApp = initializeApp({
      // If you have a service account key file:
      // credential: cert(require('./path/to/serviceAccountKey.json')),
      // For now, we'll use application default credentials
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID
    });
  } catch (error) {
    console.warn('Firebase Admin SDK initialization failed:', error);
    // Fallback initialization without credentials for development
    adminApp = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID
    });
  }
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);

export class FirebaseAdminService {
  // Verify Firebase ID token
  static async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Invalid Firebase token');
    }
  }

  // Get user by UID
  static async getUserByUid(uid: string) {
    try {
      const userRecord = await adminAuth.getUser(uid);
      return userRecord;
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error('User not found');
    }
  }
}

export default FirebaseAdminService;