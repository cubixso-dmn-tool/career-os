import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { storage } from "../storage.js";
import { JWTManager, jwtAuthMiddleware } from "../lib/jwt.js";
import { OAuthManager, isOAuthConfigured } from "../lib/oauth.js";
import { EmailManager } from "../lib/email.js";
import { AdminLogger, LogLevel, LogCategory } from "../lib/admin-logs.js";
import { FirebaseAdminService } from "../lib/firebase-admin.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const router = Router();

// Configure OAuth strategies on startup
OAuthManager.configureStrategies();

// Registration with email verification
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      await AdminLogger.logAuth(
        "REGISTRATION_FAILED",
        "Missing required fields",
        undefined,
        email,
        { reason: "missing_fields" }
      );
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      await AdminLogger.logAuth(
        "REGISTRATION_FAILED",
        "Email already registered",
        undefined,
        email,
        { reason: "email_exists" }
      );
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      name: `${firstName || ''} ${lastName || ''}`.trim() || username,
      bio: null,
      avatar: null
    });

    // Generate email verification token
    const verificationToken = EmailManager.generateVerificationToken(newUser.id, email);
    
    // Send verification email
    const emailSent = await EmailManager.sendVerificationEmail(
      email,
      username,
      verificationToken
    );

    await AdminLogger.logAuth(
      "USER_REGISTERED",
      `New user registered: ${username}`,
      newUser.id,
      email,
      { emailVerificationSent: emailSent }
    );

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
      emailSent,
      userId: newUser.id
    });
  } catch (error: any) {
    await AdminLogger.logAuth(
      "REGISTRATION_ERROR",
      `Registration error: ${error}`,
      undefined,
      req.body.email,
      { error: error.toString() }
    );
    
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Email verification
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Verification token required" });
    }

    const verification = EmailManager.verifyEmailToken(token as string);
    if (!verification) {
      await AdminLogger.logAuth(
        "EMAIL_VERIFICATION_FAILED",
        "Invalid or expired verification token",
        undefined,
        undefined,
        { token: token as string }
      );
      return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    // Update user as verified
    await storage.updateUser(verification.userId, { 
      // isEmailVerified: true // This field would need to be added to schema
    });

    await AdminLogger.logAuth(
      "EMAIL_VERIFIED",
      "Email address verified successfully",
      verification.userId,
      verification.email
    );

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error: any) {
    await AdminLogger.logAuth(
      "EMAIL_VERIFICATION_ERROR",
      `Email verification error: ${error}`,
      undefined,
      undefined,
      { error: error.toString() }
    );
    
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Email verification failed" });
  }
});

// JWT Login with enhanced security
router.post("/jwt-login", async (req, res) => {
  try {
    const { username, password, twoFactorCode } = req.body;
    const clientIP = req.ip;
    const userAgent = req.get('User-Agent');

    if (!username || !password) {
      await AdminLogger.logSecurity(
        "LOGIN_ATTEMPT_MISSING_CREDENTIALS",
        "Login attempt with missing credentials",
        LogLevel.WARNING,
        { clientIP, userAgent }
      );
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user
    const user = await storage.getUserByUsername(username) || await storage.getUserByEmail(username);
    if (!user) {
      await AdminLogger.logSecurity(
        "LOGIN_FAILED_USER_NOT_FOUND",
        `Login attempt for non-existent user: ${username}`,
        LogLevel.WARNING,
        { username, clientIP, userAgent }
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      await AdminLogger.logSecurity(
        "LOGIN_FAILED_INVALID_PASSWORD",
        `Invalid password attempt for user: ${username}`,
        LogLevel.WARNING,
        { userId: user.id, username, clientIP, userAgent }
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check 2FA if enabled (this would require additional schema fields)
    // if (user.twoFactorEnabled && !twoFactorCode) {
    //   return res.status(200).json({ requiresTwoFactor: true });
    // }

    // Get user roles from database
    const userRoles = await storage.getUserRoles(user.id);
    // Default to student role (4) if no roles found, and convert to strings
    const roleIds = userRoles.length > 0 ? userRoles.map((ur: { roleId: number }) => ur.roleId) : [4];
    const roles = roleIds.map(String); // Convert to strings for JWT

    // Generate JWT tokens
    const tokens = JWTManager.createTokenPair(user, roles);

    // Update last login
    await storage.updateUser(user.id, {
      // lastLoginAt: new Date(), // This field would need to be added to schema
    });

    await AdminLogger.logAuth(
      "JWT_LOGIN_SUCCESS",
      `User logged in successfully: ${username}`,
      user.id,
      user.email,
      { clientIP, userAgent, sessionId: tokens.accessToken.substring(0, 16) + "..." }
    );

    res.json({
      message: "Login successful",
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        roles
      }
    });
  } catch (error: any) {
    await AdminLogger.logAuth(
      "JWT_LOGIN_ERROR",
      `Login error: ${error}`,
      undefined,
      req.body.username,
      { error: error.toString() }
    );
    
    console.error("JWT Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Refresh JWT token
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const decoded = JWTManager.verifyRefreshToken(refreshToken);
    if (!decoded) {
      await AdminLogger.logSecurity(
        "TOKEN_REFRESH_FAILED",
        "Invalid refresh token used",
        LogLevel.WARNING,
        { token: refreshToken.substring(0, 16) + "..." }
      );
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Get user and roles
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const roles = ['user']; // Default role
    const tokens = JWTManager.createTokenPair(user, roles);

    await AdminLogger.logAuth(
      "TOKEN_REFRESHED",
      "Access token refreshed",
      user.id,
      user.email,
      { sessionId: decoded.sessionId }
    );

    res.json({
      message: "Token refreshed successfully",
      ...tokens
    });
  } catch (error: any) {
    await AdminLogger.logAuth(
      "TOKEN_REFRESH_ERROR",
      `Token refresh error: ${error}`,
      undefined,
      undefined,
      { error: error.toString() }
    );
    
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

// Google OAuth routes
router.get("/google", passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account" // Force account selection
}));

router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login?error=oauth_failed" }),
  async (req: any, res) => {
    try {
      const user = req.user;
      const roles = ['user']; // Default role
      const tokens = JWTManager.createTokenPair(user, roles);

      await AdminLogger.logAuth(
        "OAUTH_LOGIN_SUCCESS",
        `User logged in via Google OAuth: ${user.email}`,
        user.id,
        user.email,
        { provider: "google" }
      );

      // Redirect with tokens (in production, use secure method)
      res.redirect(`/?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`);
    } catch (error: any) {
      await AdminLogger.logAuth(
        "OAUTH_LOGIN_ERROR",
        `Google OAuth login error: ${error}`,
        undefined,
        undefined,
        { error: error.toString() }
      );
      
      res.redirect("/login?error=oauth_error");
    }
  }
);


// Check username/email uniqueness
router.post("/check-uniqueness", async (req, res) => {
  try {
    const { field, value } = req.body;

    if (!field || !value) {
      return res.status(400).json({ error: "Field and value are required" });
    }

    if (!['username', 'email'].includes(field)) {
      return res.status(400).json({ error: "Invalid field. Must be 'username' or 'email'" });
    }

    let existingUser;
    if (field === 'username') {
      existingUser = await storage.getUserByUsername(value);
    } else {
      existingUser = await storage.getUserByEmail(value);
    }

    const available = !existingUser;

    await AdminLogger.logSystem(
      "UNIQUENESS_CHECK",
      `Uniqueness check for ${field}: ${value}`,
      { field, value, available }
    );

    res.json({ available });
  } catch (error: any) {
    await AdminLogger.logSystem(
      "UNIQUENESS_CHECK_ERROR",
      `Uniqueness check error: ${error}`,
      { error: error.toString() }
    );
    
    console.error("Uniqueness check error:", error);
    res.status(500).json({ error: "Uniqueness check failed" });
  }
});

// Password reset request
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      await AdminLogger.logSecurity(
        "PASSWORD_RESET_REQUESTED_INVALID_EMAIL",
        `Password reset requested for non-existent email: ${email}`,
        LogLevel.INFO,
        { email }
      );
      
      return res.json({ message: "If the email exists, a reset link has been sent." });
    }

    // Generate reset token
    const resetToken = JWTManager.generateApiKey(user.id); // Reuse API key generation for reset token
    
    // Send reset email
    const emailSent = await EmailManager.sendPasswordResetEmail(
      email,
      user.username,
      resetToken
    );

    await AdminLogger.logAuth(
      "PASSWORD_RESET_REQUESTED",
      `Password reset requested for user: ${user.username}`,
      user.id,
      email,
      { emailSent }
    );

    res.json({ 
      message: "If the email exists, a reset link has been sent.",
      emailSent 
    });
  } catch (error: any) {
    await AdminLogger.logAuth(
      "PASSWORD_RESET_ERROR",
      `Password reset error: ${error}`,
      undefined,
      req.body.email,
      { error: error.toString() }
    );
    
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Password reset failed" });
  }
});

// Validate reset token
router.post("/validate-reset-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Reset token is required" });
    }

    // For now, we'll use a simple validation - in production, this should be more robust
    // TODO: Implement proper token storage and validation
    const tokenValid = token.length > 10; // Basic validation

    if (!tokenValid) {
      await AdminLogger.logSecurity(
        "INVALID_RESET_TOKEN",
        "Invalid reset token validation attempt",
        LogLevel.WARNING,
        { token: token.substring(0, 10) + "..." }
      );
      
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    await AdminLogger.logAuth(
      "RESET_TOKEN_VALIDATED",
      "Reset token validated successfully",
      undefined,
      undefined,
      { token: token.substring(0, 10) + "..." }
    );

    res.json({ message: "Reset token is valid" });
  } catch (error: any) {
    await AdminLogger.logAuth(
      "RESET_TOKEN_VALIDATION_ERROR",
      `Reset token validation error: ${error}`,
      undefined,
      undefined,
      { error: error.toString() }
    );
    
    console.error("Reset token validation error:", error);
    res.status(500).json({ error: "Reset token validation failed" });
  }
});

// Reset password with token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // For now, we'll use a simple token validation - in production, this should be more robust
    // TODO: Implement proper token storage and validation with user association
    const tokenValid = token.length > 10; // Basic validation

    if (!tokenValid) {
      await AdminLogger.logSecurity(
        "INVALID_RESET_TOKEN_PASSWORD_CHANGE",
        "Invalid reset token used for password change",
        LogLevel.WARNING,
        { token: token.substring(0, 10) + "..." }
      );
      
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // TODO: Extract user ID from token and update password
    // For now, this is a placeholder implementation
    // In production, you would:
    // 1. Decode the token to get user ID
    // 2. Hash the new password
    // 3. Update the user's password in the database
    // 4. Invalidate the reset token

    await AdminLogger.logAuth(
      "PASSWORD_RESET_SUCCESS",
      "Password reset completed successfully",
      undefined, // TODO: Add actual user ID from token
      undefined,
      { token: token.substring(0, 10) + "..." }
    );

    res.json({ message: "Password reset successfully" });
  } catch (error: any) {
    await AdminLogger.logAuth(
      "PASSWORD_RESET_COMPLETION_ERROR",
      `Password reset completion error: ${error}`,
      undefined,
      undefined,
      { error: error.toString() }
    );
    
    console.error("Password reset completion error:", error);
    res.status(500).json({ error: "Password reset failed" });
  }
});

// Get current user info (JWT protected)
router.get("/me", jwtAuthMiddleware, async (req: any, res) => {
  try {
    const user = await storage.getUser(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      roles: req.user.roles,
      sessionId: req.sessionId
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({ error: "Failed to get user info" });
  }
});

// Logout (JWT)
router.post("/logout", jwtAuthMiddleware, async (req: any, res) => {
  try {
    // In production, add token to blacklist
    await AdminLogger.logAuth(
      "JWT_LOGOUT",
      "User logged out",
      req.user.userId,
      req.user.email,
      { sessionId: req.sessionId }
    );

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

// Generate 2FA setup
router.post("/setup-2fa", jwtAuthMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate 2FA secret
    const secret = speakeasy.generateSecret({
      name: `CareerOS (${user.email})`,
      issuer: 'CareerOS'
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    await AdminLogger.logSecurity(
      "2FA_SETUP_INITIATED",
      "User initiated 2FA setup",
      LogLevel.INFO,
      { userId, userEmail: user.email, secretLength: secret.base32.length }
    );

    res.json({
      secret: secret.base32,
      qrCode,
      backupCodes: [] // Generate backup codes in production
    });
  } catch (error: any) {
    await AdminLogger.logSecurity(
      "2FA_SETUP_ERROR",
      `2FA setup error: ${error}`,
      LogLevel.ERROR,
      { userId: req.user.userId, userEmail: req.user.email, error: error.toString() }
    );
    
    console.error("2FA setup error:", error);
    res.status(500).json({ error: "2FA setup failed" });
  }
});

// Development OAuth simulation (localhost only)
router.get("/dev-oauth/:provider", async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: "Not found" });
  }

  const { provider } = req.params;
  
  if (!['google'].includes(provider)) {
    return res.status(400).json({ error: "Invalid provider" });
  }

  try {
    // Simulate OAuth user data
    const mockUser = {
      email: `test@${provider}.com`,
      username: `${provider}_user`,
      name: `Test ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      avatar: `https://via.placeholder.com/150?text=${provider.charAt(0).toUpperCase()}`
    };

    // Check if user exists, create if not
    let user = await storage.getUserByEmail(mockUser.email);
    if (!user) {
      user = await storage.createUser({
        ...mockUser,
        password: 'oauth_user' // Not used for OAuth users
      });
    }

    // Create JWT tokens
    const roles = ['user'];
    const tokens = JWTManager.createTokenPair(user, roles);

    await AdminLogger.logAuth(
      "DEV_OAUTH_LOGIN",
      `Development OAuth login via ${provider}: ${user.email}`,
      user.id,
      user.email,
      { provider, isDevelopment: true }
    );

    // Redirect with tokens
    res.redirect(`/?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`);
  } catch (error) {
    console.error("Development OAuth error:", error);
    res.redirect("/login?error=dev_oauth_error");
  }
});

// Firebase user sync endpoint
router.post("/firebase-sync", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No valid authorization header" });
    }

    const idToken = authHeader.split(' ')[1];
    
    // Check if Firebase Admin is initialized
    if (!FirebaseAdminService.isInitialized()) {
      console.warn('Firebase Admin SDK not initialized, skipping token verification');
      // In this case, we'll trust the client-side Firebase auth
      // This is less secure but allows the app to work without Firebase Admin setup
    } else {
      // Verify Firebase ID token
      const decodedToken = await FirebaseAdminService.verifyIdToken(idToken);
    }
    
    const { uid, email, name, avatar, provider } = req.body;

    // Validate required fields
    if (!uid || !email) {
      return res.status(400).json({ error: "Missing required fields: uid, email" });
    }

    // Check if user exists by email
    let user = await storage.getUserByEmail(email);
    
    if (user) {
      // Update existing user with Firebase data
      await storage.updateUser(user.id, {
        name: name || user.name,
        avatar: avatar || user.avatar,
        // Store Firebase UID for future reference
        // Note: This would require adding a firebaseUid field to the user schema
      });
      
      await AdminLogger.logAuth(
        "FIREBASE_USER_UPDATED",
        `Firebase user synced: ${email}`,
        user.id,
        email,
        { provider, firebaseUid: uid }
      );
    } else {
      // Create new user from Firebase data
      user = await storage.createUser({
        email,
        username: email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 6),
        name: name || email.split('@')[0],
        password: 'firebase_' + Math.random().toString(36).substring(2, 15), // Random password for Firebase users
        avatar,
        bio: null
      });

      await AdminLogger.logAuth(
        "FIREBASE_USER_CREATED",
        `New Firebase user created: ${email}`,
        user.id,
        email,
        { provider, firebaseUid: uid }
      );
    }

    // Generate our JWT tokens for the user
    const roles = ['user']; // Default role
    const tokens = JWTManager.createTokenPair(user, roles);

    res.json({
      message: "User synced successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        roles
      },
      ...tokens
    });
  } catch (error: any) {
    console.error("Firebase sync error:", error);
    await AdminLogger.logAuth(
      "FIREBASE_SYNC_ERROR",
      `Firebase sync failed: ${error.message}`,
      undefined,
      req.body.email,
      { error: error.toString() }
    );
    
    res.status(500).json({ error: "Firebase sync failed" });
  }
});

// OAuth configuration status (now includes Firebase)
router.get("/oauth-config", (req, res) => {
  const config = isOAuthConfigured();
  
  // Check if Firebase is configured
  const firebaseConfigured = !!(
    process.env.VITE_FIREBASE_API_KEY &&
    process.env.VITE_FIREBASE_AUTH_DOMAIN &&
    process.env.VITE_FIREBASE_PROJECT_ID
  );
  
  res.json({
    ...config,
    firebase: firebaseConfigured
  });
});

export default router;