import { Request, Response, NextFunction } from 'express';

// Middleware to check if the user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// Middleware to check if the user is an admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Permission denied' });
}

// Middleware to check if the user is verified
export function isVerified(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user?.isVerified) {
    return next();
  }
  res.status(403).json({ message: 'Account not verified' });
}

// Middleware to check if the user is the founder of a community
export function isCommunityFounder(req: Request, res: Response, next: NextFunction) {
  const communityId = parseInt(req.params.id);
  
  if (req.isAuthenticated() && req.user?.id) {
    // In a real implementation, this would check the database
    // For now, we'll use a simple check based on the mock data
    if (communityId <= 2 && req.user.id === 1) {
      return next();
    }
  }
  
  res.status(403).json({ message: 'Permission denied' });
}

// Middleware to check if the user is a member of a community
export function isCommunityMember(req: Request, res: Response, next: NextFunction) {
  const communityId = parseInt(req.params.id);
  
  if (req.isAuthenticated() && req.user?.id) {
    // In a real implementation, this would check the database
    // For mock data, we'll assume users with IDs 1-5 are members of communities 1-2
    if (communityId <= 2 && req.user.id <= 5) {
      return next();
    }
  }
  
  res.status(403).json({ message: 'You must be a community member' });
}

// Middleware to check if the user is an admin or moderator of a community
export function isCommunityAdminOrModerator(req: Request, res: Response, next: NextFunction) {
  const communityId = parseInt(req.params.id);
  
  if (req.isAuthenticated() && req.user?.id) {
    // In a real implementation, this would check the database
    // For now, we'll use a simple check based on the mock data
    // Assume user 1 is admin of communities 1-2, and user 2 is moderator
    if (communityId <= 2 && (req.user.id === 1 || req.user.id === 2)) {
      return next();
    }
  }
  
  res.status(403).json({ message: 'Admin or moderator permissions required' });
}