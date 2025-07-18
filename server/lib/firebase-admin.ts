import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
let adminApp: App;
let adminAuth: Auth;

try {
  if (getApps().length === 0) {
    // For production, use service account key
    // For development, you can use the Firebase emulator or service account
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      throw new Error('Firebase project ID not found in environment variables');
    }

    adminApp = initializeApp({
      // If you have a service account key file:
      // credential: cert(require('./path/to/serviceAccountKey.json')),
      // For now, we'll use application default credentials
      projectId: projectId
    });
  } else {
    adminApp = getApps()[0];
  }

  adminAuth = getAuth(adminApp);
} catch (error) {
  console.warn('Firebase Admin SDK initialization failed:', error);
  // Set to null so we can handle gracefully in the service methods
  adminAuth = null as any;
}

export { adminAuth };

export class FirebaseAdminService {
  // Check if Firebase Admin is initialized
  static isInitialized(): boolean {
    return adminAuth !== null;
  }

  // Verify Firebase ID token
  static async verifyIdToken(idToken: string) {
    if (!this.isInitialized()) {
      throw new Error('Firebase Admin SDK not initialized');
    }

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
    if (!this.isInitialized()) {
      throw new Error('Firebase Admin SDK not initialized');
    }

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