import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { storage } from '../simple-storage.js';
import { JWTManager } from './jwt.js';

export interface OAuthProfile {
  id: string;
  provider: 'google' | 'github';
  email: string;
  name: string;
  avatar?: string;
  username?: string;
}

export class OAuthManager {
  static configureStrategies() {
    // Determine base URL for callbacks
    const baseURL = process.env.REPLIT_URL || 'http://localhost:5000';
    
    // Google OAuth Strategy
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${baseURL}/api/auth/google/callback`
      }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const oauthProfile: OAuthProfile = {
            id: profile.id,
            provider: 'google',
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || '',
            avatar: profile.photos?.[0]?.value
          };

          const user = await this.handleOAuthUser(oauthProfile);
          return done(null, user as any);
        } catch (error) {
          return done(error, null);
        }
      }));
    }

    // GitHub OAuth Strategy
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${baseURL}/api/auth/github/callback`
      }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const oauthProfile: OAuthProfile = {
            id: profile.id,
            provider: 'github',
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || profile.username || '',
            avatar: profile.photos?.[0]?.value,
            username: profile.username
          };

          const user = await this.handleOAuthUser(oauthProfile);
          return done(null, user as any);
        } catch (error) {
          return done(error, null);
        }
      }));
    }

    // Passport serialization
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: any, done) => {
      try {
        const user = await storage.getUser(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  private static async handleOAuthUser(profile: OAuthProfile): Promise<any> {
    // Check if user exists by email
    let user = await storage.getUserByEmail(profile.email);

    if (user) {
      // Update OAuth info if user exists
      await storage.updateUser(user.id, {
        avatar: profile.avatar || user.avatar,
        // Using the correct field name from the User type
      });
    } else {
      // Create new user from OAuth profile
      const newUser = {
        email: profile.email,
        username: this.generateUsername(profile),
        // Combine first and last name into full name as required by User schema
        name: profile.name,
        // Use a placeholder password for OAuth users
        password: `oauth_${Math.random().toString(36).substring(2, 15)}`,
        // Use avatar field instead of profileImageUrl
        avatar: profile.avatar,
        // Bio can be null
        bio: null
      };

      user = await storage.createUser(newUser);
    }

    return user;
  }

  private static generateUsername(profile: OAuthProfile): string {
    if (profile.username) {
      return profile.username;
    }
    
    // Generate username from email or name
    const baseUsername = profile.email.split('@')[0] || 
                        profile.name.toLowerCase().replace(/\s+/g, '');
    
    return baseUsername + '_' + Math.random().toString(36).substring(2, 6);
  }

  private static extractFirstName(fullName: string): string {
    return fullName.split(' ')[0] || '';
  }

  private static extractLastName(fullName: string): string {
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }

  // Generate OAuth login URL
  static getOAuthLoginUrl(provider: 'google' | 'github', state?: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const stateParam = state ? `?state=${encodeURIComponent(state)}` : '';
    
    return `${baseUrl}/api/auth/${provider}${stateParam}`;
  }

  // Verify OAuth state parameter for CSRF protection
  static verifyOAuthState(receivedState: string, expectedState: string): boolean {
    return receivedState === expectedState;
  }
}

// OAuth middleware for route protection
export function requireOAuthProvider(providers: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (providers.length > 0 && !providers.includes(req.user.oauthProvider)) {
      return res.status(403).json({ 
        error: 'Specific OAuth provider required',
        allowedProviders: providers 
      });
    }

    next();
  };
}

// Check if OAuth is configured
export function isOAuthConfigured(): { google: boolean; github: boolean } {
  return {
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
  };
}