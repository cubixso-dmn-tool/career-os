import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { OAuthManager } from "./lib/oauth";
import GlobalErrorHandler from "./middleware/error-handler";

const port = process.env.PORT || 5000;
const host = process.env.NODE_ENV === 'production' ? "0.0.0.0" : "127.0.0.1";

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

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log("Current environment:", app.get("env"));
  console.log("NODE_ENV:", process.env.NODE_ENV);
  
  if (app.get("env") === "development") {
    console.log("Setting up Vite middleware for development");
    await setupVite(app, server);
  } else {
    console.log("Setting up static file serving for production");
    serveStatic(app);
  }

  // Add global error handling after Vite setup
  app.use(GlobalErrorHandler.middleware());

  // const port = 5000;
  // const host = "127.0.0.1";
  const url = `http://${host}:${port}`;
  
  server.listen({ port: Number(port), host }, () => {
    log(`serving on port ${port}`);
    log(`Click here to open the app: ${url}`)
  });

})();
