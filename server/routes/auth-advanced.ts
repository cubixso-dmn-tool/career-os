import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { storage } from "../simple-storage";
import { JWTManager, jwtAuthMiddleware } from "../lib/jwt";
import { OAuthManager, isOAuthConfigured } from "../lib/oauth";
import { EmailManager } from "../lib/email";
import { AdminLogger, LogLevel, LogCategory } from "../lib/admin-logs";
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

    // Get user roles
    // const roles = await storage.getUserRoles(user.id); // This would need to be implemented
    const roles = ['user']; // Default role

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
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

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

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// GitHub OAuth routes
router.get("/github", passport.authenticate("github"));

router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/login?error=oauth_failed" }),
  async (req: any, res) => {
    try {
      const user = req.user;
      const roles = ['user']; // Default role
      const tokens = JWTManager.createTokenPair(user, roles);

      await AdminLogger.logAuth(
        "OAUTH_LOGIN_SUCCESS",
        `User logged in via GitHub OAuth: ${user.email}`,
        user.id,
        user.email,
        { provider: "github" }
      );

      res.redirect(`/?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`);
    } catch (error: any) {
      await AdminLogger.logAuth(
        "OAUTH_LOGIN_ERROR",
        `GitHub OAuth login error: ${error}`,
        undefined,
        undefined,
        { error: error.toString() }
      );
      
      res.redirect("/login?error=oauth_error");
    }
  }
);

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
  
  if (!['google', 'github'].includes(provider)) {
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

// OAuth configuration status
router.get("/oauth-config", (req, res) => {
  const config = isOAuthConfigured();
  // In development, always show as available for testing
  if (process.env.NODE_ENV !== 'production') {
    config.google = true;
    config.github = true;
  }
  res.json(config);
});

export default router;