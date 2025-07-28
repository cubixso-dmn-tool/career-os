# Client Requirements Implementation Plan

## Overview
This document tracks the implementation of the following client requirements:

1. **New Tab Navigation**: Login/Register buttons on homepage should open in new tabs
2. **Registration Validation**: Real-time username/email uniqueness checking with proper UI feedback
3. **Remove GitHub Auth**: Complete removal of GitHub authentication
4. **Forgot Password**: Add forgot password functionality with email reset
5. **Remove Sessions Tab**: Remove "Sessions" tab from Expert Network

## Implementation Tasks

### ✅ Completed Tasks
- [x] Update LandingPage.tsx - Make Login/Register buttons open in new tabs
- [x] Add username/email uniqueness validation in Register component with proper UI feedback  
- [x] Remove GitHub authentication completely from Login component
- [x] Add forgot password feature - Create ForgotPassword component
- [x] Add forgot password link to Login component
- [x] Remove Sessions tab from Expert Network component
- [x] Update backend auth routes to support forgot password functionality
- [x] Add email validation endpoint for real-time checking during registration
- [x] Update routing to handle new tab navigation properly

### 🔄 In Progress Tasks
- [ ] 

### 📝 Pending Tasks
- [ ]

## Detailed Implementation Plan

### 1. New Tab Navigation for Login/Register
**Files to modify:**
- `client/src/pages/LandingPage.tsx`

**Changes:**
- Update Login and Register button click handlers to open in new tabs using `window.open()`
- Ensure proper URL routing for new tab context

### 2. Registration Validation with UI Feedback
**Files to modify:**
- `client/src/pages/Register.tsx`
- `server/routes/auth.ts` (or equivalent)

**Changes:**
- Add real-time validation for username and email uniqueness
- Create API endpoints for checking username/email availability
- Add proper UI components (popups/toasts) for validation feedback
- Implement debounced API calls to avoid excessive requests

### 3. Remove GitHub Authentication
**Files to modify:**
- `client/src/pages/Login.tsx`
- `client/src/hooks/use-auth-context.tsx`
- `server/routes/auth.ts`
- Any other OAuth-related files

**Changes:**
- Remove all GitHub OAuth buttons and handlers
- Remove GitHub OAuth configuration
- Clean up unused imports and dependencies
- Update UI layout after removing GitHub option

### 4. Forgot Password Feature
**Files to create/modify:**
- `client/src/pages/ForgotPassword.tsx` (new)
- `client/src/pages/ResetPassword.tsx` (new)
- `client/src/pages/Login.tsx` (add link)
- `server/routes/auth.ts` (add endpoints)

**Changes:**
- Create forgot password form component
- Create reset password form component
- Add email sending functionality for reset tokens
- Add password reset token validation
- Update login page with "Forgot Password?" link

### 5. Remove Sessions Tab from Expert Network
**Files to modify:**
- `client/src/components/experts/IndustryExpertNetwork.tsx`

**Changes:**
- Remove "Sessions" tab from TabsList
- Remove corresponding TabsContent for sessions
- Update grid layout from 4 columns to 3 columns
- Clean up unused session-related code and imports

### 6. Backend Support
**Files to modify:**
- `server/routes/auth.ts` (or equivalent auth routes)
- Database schema updates if needed

**Changes:**
- Add forgot password endpoints
- Add email/username uniqueness check endpoints
- Add password reset token handling
- Update email service configuration

## Technical Considerations

### Security
- Implement proper password reset token expiration
- Use secure random tokens for password reset
- Implement rate limiting for validation requests
- Ensure proper input sanitization

### User Experience
- Provide clear feedback for validation errors
- Implement loading states for async operations
- Use proper error handling and user-friendly messages
- Ensure responsive design for all new components

### Performance
- Implement debouncing for real-time validation
- Use proper caching strategies
- Optimize API calls to avoid unnecessary requests

## Testing Strategy

### Frontend Testing
- Test new tab navigation functionality
- Test real-time validation UI feedback
- Test forgot password flow end-to-end
- Test responsive design on various devices

### Backend Testing
- Test email/username uniqueness endpoints
- Test forgot password email sending
- Test password reset token validation
- Test rate limiting functionality

### Integration Testing
- Test complete registration flow with validation
- Test complete forgot password flow
- Test login flow after GitHub removal
- Test Expert Network without Sessions tab

## Deployment Considerations

### Environment Variables
- Add email service configuration
- Add frontend URL configuration for password reset links
- Update any OAuth-related environment variables

### Database Updates
- Add password reset token table/fields if needed
- Ensure proper indexing for username/email lookups

### Email Service
- Configure email templates for password reset
- Test email delivery in production environment

## Implementation Summary

### Files Modified
1. **client/src/pages/LandingPage.tsx**
   - Updated Login and Register buttons to use `window.open('/login', '_blank')` and `window.open('/register', '_blank')`
   - Updated `handleGetStarted` function to open login in new tab for unauthenticated users

2. **client/src/pages/Login.tsx**
   - Removed GitHub OAuth functionality completely
   - Removed GitHub imports and button
   - Updated Google OAuth button to full width
   - Added "Forgot your password?" link

3. **client/src/pages/Register.tsx**
   - Added real-time username and email uniqueness validation
   - Implemented debounced API calls to `/api/auth/check-uniqueness`
   - Added visual indicators for validation states (checking, available, taken)
   - Added form submission validation to prevent submission with invalid data

4. **client/src/pages/ForgotPassword.tsx** (new)
   - Created complete forgot password flow
   - Email input with validation
   - Success state with email sent confirmation
   - Navigation back to login

5. **client/src/pages/ResetPassword.tsx** (new)
   - Created password reset form with token validation
   - Token validation on page load
   - Password strength requirements
   - Success state after password reset

6. **client/src/App.tsx**
   - Added routes for `/forgot-password` and `/reset-password`

7. **client/src/components/experts/IndustryExpertNetwork.tsx**
   - Removed "Sessions" tab from TabsList (changed from 4 to 3 columns)
   - Removed sessions TabsContent section
   - Cleaned up session-related state, functions, and interfaces
   - Removed session API calls from fetchData

8. **server/routes/auth-advanced.ts**
   - Added `/check-uniqueness` endpoint for real-time validation
   - Added `/validate-reset-token` endpoint for token validation
   - Added `/reset-password` endpoint for password reset completion
   - Removed GitHub OAuth routes
   - Updated development OAuth to only support Google

### Features Implemented

✅ **New Tab Navigation**
- Login and Register buttons now open in new tabs
- Maintains user experience on landing page
- Proper URL routing for new tab context

✅ **Real-time Registration Validation**
- Debounced API calls (500ms delay)
- Visual feedback with loading, success, and error states
- Prevents form submission until validation passes
- User-friendly error messages

✅ **GitHub Authentication Removal**
- Completely removed from frontend and backend
- Updated UI to single Google OAuth option
- Cleaned up unused imports and code

✅ **Forgot Password Flow**
- Complete email-based password reset
- Token generation and validation
- Email sending integration (ready for SMTP setup)
- Secure token handling with expiration

✅ **Expert Network Sessions Removal**
- Removed Sessions tab from interface
- Updated grid layout from 4 to 3 columns
- Cleaned up unused session-related code
- Maintained existing Experts, Stories, and Events tabs

### Testing Recommendations

1. **New Tab Navigation**: Test that login/register open in new tabs and maintain landing page
2. **Registration Validation**: Test username/email uniqueness checking with various inputs
3. **Forgot Password**: Test complete flow from email entry to password reset
4. **Login Flow**: Verify GitHub removal and Google OAuth still works
5. **Expert Network**: Confirm Sessions tab is removed and other tabs work correctly

---

**Last Updated:** July 28, 2025
**Status:** ✅ COMPLETED
**Implementation Time:** ~2 hours