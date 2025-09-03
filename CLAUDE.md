# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (runs both frontend and backend)
- `npm run build` - Build for production (Vite build + esbuild server bundle)
- `npm run start` - Start production server from dist/
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes using Drizzle

### Development Server Details
- Frontend runs on Vite dev server, proxies `/api` requests to backend
- Backend runs on port 5000 (127.0.0.1 in dev, 0.0.0.0 in production)
- Uses tsx for TypeScript execution in development

## Architecture Overview

### Full-Stack Structure
This is a full-stack TypeScript application with a clear separation between client, server, and shared code:

- **client/**: React frontend with Vite build system
- **server/**: Express.js backend with TypeScript
- **shared/**: Common types, schemas, and utilities shared between client and server

### Technology Stack
- **Frontend**: React 18 + TypeScript, Wouter routing, TanStack Query, Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript, Drizzle ORM, PostgreSQL (Neon), Redis caching
- **Authentication**: Passport.js with local strategy, JWT tokens, OAuth (Google/GitHub), 2FA support
- **Database**: PostgreSQL with Drizzle ORM, comprehensive RBAC system
- **File Upload**: Multer with Firebase Storage integration
- **UI Components**: Radix UI primitives with Tailwind CSS styling

### Database & Schema
- PostgreSQL database with Drizzle ORM for type-safe queries
- Schema defined in `shared/schema.ts` with comprehensive RBAC tables
- Migrations stored in `migrations/` directory
- Database operations abstracted through storage interface in `server/storage.ts`

### Key Architectural Patterns

#### Role-Based Access Control (RBAC)
- Comprehensive RBAC system with roles, permissions, and user roles
- Four main user types: students, mentors, moderators, admins
- Role-specific dashboards and navigation
- Middleware protection for API routes (`server/middleware/rbac.ts`)

#### Storage Interface Pattern
- All database operations go through `IStorage` interface in `server/storage.ts`
- Provides abstraction layer over Drizzle ORM queries
- Supports complex operations like user management, course enrollment, community features

#### Path Aliases
- `@/*` maps to `client/src/*` (frontend components, pages, hooks)
- `@shared/*` maps to `shared/*` (common schemas, types, utilities)
- `@assets/*` maps to `attached_assets/*` (static assets)

### Authentication Flow
- Session-based authentication with PostgreSQL session store
- Passport.js integration with local strategy
- JWT token support for API authentication
- OAuth integration with Google and GitHub
- Two-factor authentication with TOTP

### Frontend Architecture

#### Router Structure
- Wouter for client-side routing
- Role-based dashboard routing (`DashboardRouter.tsx`)
- Protected routes with authentication middleware
- Landing page for unauthenticated users

#### State Management
- TanStack Query for server state management
- Zustand for local state management
- React Context for authentication state
- Learning mode context for educational features

#### Component Organization
- UI components in `client/src/components/ui/` (shadcn/ui based)
- Page components in `client/src/pages/`
- Custom hooks in `client/src/hooks/`
- Utilities in `client/src/lib/`

### Backend Architecture

#### API Routes Structure
- Route registration in `server/routes.ts`
- Modular route handlers in `server/routes/` directory
- Middleware for authentication, RBAC, validation, and error handling
- WebSocket support for real-time features

#### Error Handling
- Global error handler in `server/middleware/error-handler.ts`
- Comprehensive error logging with AdminLogger
- User-friendly error responses with proper HTTP status codes
- Redis connection fallback to prevent crashes

#### Security Features
- Input validation and sanitization
- SQL injection protection through parameterized queries
- XSS prevention with proper content sanitization
- Rate limiting and security headers
- Session security with secure cookies

### Key Business Logic

#### Career Assessment Engine
- Multi-stage career assessment quiz system
- Personalized career recommendations based on user responses
- Skills mapping and learning path generation

#### Learning Management System
- Course enrollment and progress tracking
- Project-based learning with portfolio building
- Skills assessment and certification tracking
- Daily learning bytes for engagement

#### Community Features
- Role-based community management
- Post creation, commenting, and moderation
- Expert network with session management
- Mentorship matching and tracking

#### Resume Builder
- Template-based resume generation
- Export capabilities (PDF, image formats)
- Career-specific template recommendations

## Important Development Notes

### Database Operations
- Always use the storage interface rather than direct Drizzle queries
- Database schema changes require running `npm run db:push`
- Complex queries are abstracted in storage methods

### Authentication Context
- User authentication state managed through React Context
- Check authentication status using `useAuth` hook
- Protected routes automatically redirect unauthenticated users

### API Development
- All API routes should include proper authentication and RBAC middleware
- Use input validation middleware for request sanitization
- Follow RESTful conventions for endpoint design

### File Upload Handling
- File uploads handled through Firebase Storage
- Multer middleware for file processing
- Proper file type and size validation

### Error Handling Best Practices
- Use global error handler for consistent error responses
- Log errors appropriately for debugging
- Provide user-friendly error messages

### Performance Considerations
- Redis caching implemented for frequently accessed data
- Database queries optimized with proper indexing
- Frontend code splitting for better load times

## Environment Variables
Key environment variables are defined in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment mode (development/production)
- Firebase configuration for file storage
- Email configuration for notifications
- OAuth client credentials

## Production Deployment
- Vercel deployment configured with `vercel.json`
- Production build creates optimized bundles in `dist/`
- Environment variables must be configured in deployment environment
- Database migrations need to be run in production environment