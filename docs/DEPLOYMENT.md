# CareerOS - Vercel Deployment Guide

## Prerequisites

### 1. Database Setup
- **PostgreSQL Database**: You'll need a production PostgreSQL database
- **Recommended**: Use [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)
- **Get your `DATABASE_URL`** in this format: `postgresql://username:password@host:port/database`

### 2. OAuth Applications
Create OAuth applications for social login:

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create credentials (OAuth 2.0 Client ID)
5. Add your domain to authorized origins
6. Get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

#### GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `https://yourdomain.com/api/auth/github/callback`
4. Get `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### 3. OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Get your `OPENAI_API_KEY`

### 4. Email Service (Optional)
- Set up SMTP credentials for email notifications
- Or use a service like [SendGrid](https://sendgrid.com/) or [Resend](https://resend.com/)

## Vercel Deployment Steps

### 1. Connect Your Repository
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository

### 2. Configure Build Settings
Vercel should auto-detect the settings, but verify:
- **Build Command**: `npm run build` (will use vercel-build script)
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 3. Set Environment Variables
In Vercel dashboard, go to Project Settings > Environment Variables and add:

#### Required Variables:
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Session Security
SESSION_SECRET=your-super-secure-random-string-here

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - GitHub  
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Production Environment
NODE_ENV=production
```

#### Optional Variables:
```env
# Email Configuration (if using SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (if using Redis for caching)
REDIS_URL=redis://username:password@host:port
```

### 4. Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Post-Deployment Setup

### 1. Database Migration
After deployment, run the database migration:
```bash
# Run this locally with production DATABASE_URL
npm run db:push
```

### 2. Create Admin User
```bash
# Run the admin setup script
npm run setup:admin
```

### 3. Test OAuth Flows
1. Update OAuth app settings with your new Vercel domain
2. Test Google and GitHub login flows
3. Verify all authentication features work

## Domain Configuration (Optional)

### Custom Domain:
1. In Vercel dashboard, go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update OAuth redirect URLs to use your custom domain

## Monitoring & Logs

### View Logs:
1. Vercel Dashboard > Project > Functions tab
2. Click on any function to see logs
3. Monitor API performance and errors

### Analytics:
- Enable Vercel Analytics in Project Settings
- Monitor page views, performance, and user behavior

## Troubleshooting

### Common Issues:

#### Build Failures:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

#### Database Connection:
- Verify `DATABASE_URL` is correct
- Check if database allows external connections
- Ensure SSL is properly configured

#### OAuth Issues:
- Verify redirect URLs match in OAuth app settings
- Check client IDs and secrets are correct
- Ensure domains are authorized

#### API Timeouts:
- Vercel functions have a 10-second timeout on Hobby plan
- Consider upgrading to Pro for longer timeouts
- Optimize database queries

## Security Checklist

- [ ] Strong `SESSION_SECRET` set
- [ ] OAuth credentials secured
- [ ] Database connection uses SSL
- [ ] CORS properly configured
- [ ] Environment variables are not exposed in client
- [ ] Rate limiting is enabled
- [ ] Input validation is working

## Performance Optimization

- [ ] Enable Vercel Edge Caching
- [ ] Optimize database queries
- [ ] Use Redis for session storage (optional)
- [ ] Enable compression
- [ ] Optimize bundle size

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs carefully
3. Test locally with production environment variables
4. Contact support if needed

Your CareerOS platform is now ready for production! 🚀