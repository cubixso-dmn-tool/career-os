import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

// Check if user has admin role
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ message: "Admin access required" });
}

// Check if user is the founder of a community
export function isCommunityFounder(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const communityId = parseInt(req.params.communityId || req.params.id);
  
  // Admin bypass - admins can perform any action
  if (req.user.role === 'admin') {
    return next();
  }
  
  // Check if the community exists and the user is the founder
  storage.getCommunity(communityId)
    .then(community => {
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      
      if (community.founderId === req.user.id) {
        return next();
      }
      
      res.status(403).json({ message: "Only the community founder can perform this action" });
    })
    .catch(() => {
      res.status(500).json({ message: "Error verifying community founder status" });
    });
}

// Check if user is verified
export function isVerified(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user.isVerified || req.user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ message: "Account verification required" });
}

// Check if user is a member of the community
export function isCommunityMember(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // Admin bypass
  if (req.user.role === 'admin') {
    return next();
  }
  
  const communityId = parseInt(req.params.communityId);
  
  // Check if the user is an active member of the community
  storage.getCommunityMember(communityId, req.user.id)
    .then(member => {
      if (!member || !member.isActive) {
        return res.status(403).json({ message: "You must be a member of this community to perform this action" });
      }
      
      // Store the member info in the request for later use
      (req as any).communityMember = member;
      next();
    })
    .catch(() => {
      res.status(500).json({ message: "Error verifying community membership" });
    });
}

// Check if user is an admin or moderator of the community
export function isCommunityAdminOrModerator(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // Admin bypass
  if (req.user.role === 'admin') {
    return next();
  }
  
  const communityId = parseInt(req.params.communityId);
  
  // Check if the user is an admin or moderator in the community
  storage.getCommunityMember(communityId, req.user.id)
    .then(member => {
      if (!member || !member.isActive) {
        return res.status(403).json({ message: "You must be a member of this community to perform this action" });
      }
      
      if (member.role !== 'admin' && member.role !== 'moderator') {
        return res.status(403).json({ message: "You must be an admin or moderator to perform this action" });
      }
      
      // Store the member info in the request for later use
      (req as any).communityMember = member;
      next();
    })
    .catch(() => {
      res.status(500).json({ message: "Error verifying community role" });
    });
}