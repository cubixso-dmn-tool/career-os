import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

export interface AuthResult {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}

export class FirebaseAuthService {
  // Sign in with Google
  static async signInWithGoogle(): Promise<AuthResult> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        success: true,
        user: result.user
      };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: error.message || 'Google sign in failed'
      };
    }
  }

  // Sign in with GitHub
  static async signInWithGitHub(): Promise<AuthResult> {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return {
        success: true,
        user: result.user
      };
    } catch (error: any) {
      console.error('GitHub sign in error:', error);
      return {
        success: false,
        error: error.message || 'GitHub sign in failed'
      };
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current user's ID token
  static async getIdToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Check if Firebase is configured
  static isConfigured(): boolean {
    return !!(
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    );
  }

  // Sync Firebase user to our database
  static async syncUserToDatabase(firebaseUser: FirebaseUser): Promise<any> {
    try {
      console.log('🔄 Getting Firebase ID token...');
      const idToken = await firebaseUser.getIdToken();
      
      const syncData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatar: firebaseUser.photoURL,
        provider: firebaseUser.providerData[0]?.providerId || 'firebase'
      };
      
      console.log('📤 Sending sync request with data:', syncData);
      
      const response = await fetch('/api/auth/firebase-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(syncData)
      });

      console.log('📥 Sync response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Sync response data:', result);
        return result;
      } else {
        const errorText = await response.text();
        console.error('❌ Sync response error:', errorText);
        throw new Error(`Failed to sync user to database: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('User sync error:', error);
      throw error;
    }
  }
}

export default FirebaseAuthService;