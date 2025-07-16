import express from "express";
import { registerRoutes } from "../server/routes.ts";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "../server/storage";
import connectPgSimple from "connect-pg-simple";
import { pool } from "../server/db";
import { OAuthManager } from "../server/lib/oauth";
import GlobalErrorHandler from "../server/middleware/error-handler";

const PgSession = connectPgSimple(session);

// Configure Passport
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (user.password !== password) { // In production, use proper password hashing
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Configure OAuth strategies
OAuthManager.configureStrategies();

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session
app.use(session({
  store: new PgSession({
    pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'dev_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Register API routes
registerRoutes(app);

// Add global error handling
app.use(GlobalErrorHandler.middleware());

export default app;