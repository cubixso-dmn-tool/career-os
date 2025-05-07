import { Router } from "express";
import { storage } from "../storage";
import { 
  loadUserRolesMiddleware, 
  requirePermission, 
  requireCommunityModerator, 
  requireCommunityOwner 
} from "../middleware/rbac";
import { 
  insertCommunitySchema, 
  insertCommunityPostSchema, 
  insertCommunityPostCommentSchema 
} from "@shared/schema";

// Create router
const router = Router();

// Apply middleware to load user roles and permissions
router.use(loadUserRolesMiddleware);

// Community routes

// Get all communities
router.get("/", async (req, res) => {
  try {
    const communities = await storage.getAllCommunities();
    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Failed to fetch communities" });
  }
});

// Get a specific community
router.get("/:communityId", async (req, res) => {
  try {
    const communityId = parseInt(req.params.communityId);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    const community = await storage.getCommunity(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    res.status(200).json(community);
  } catch (error) {
    console.error("Error fetching community:", error);
    res.status(500).json({ message: "Failed to fetch community" });
  }
});

// Create a new community
router.post("/", requirePermission("create:community"), async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const validatedData = insertCommunitySchema.parse(req.body);
    const communityData = {
      ...validatedData,
      createdBy: req.user.id
    };
    
    const community = await storage.createCommunity(communityData);
    
    // Add the creator as a member with 'owner' role
    await storage.joinCommunity({
      userId: req.user.id,
      communityId: community.id,
      role: "owner"
    });
    
    res.status(201).json(community);
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: "Failed to create community" });
  }
});

// Join a community
router.post("/:communityId/members", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const communityId = parseInt(req.params.communityId);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    // Check if community exists
    const community = await storage.getCommunity(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Check if user is already a member
    const isMember = await storage.isCommunityMember(req.user.id, communityId);
    if (isMember) {
      return res.status(400).json({ message: "Already a member of this community" });
    }
    
    // Add user to community with 'member' role
    const member = await storage.joinCommunity({
      userId: req.user.id,
      communityId: communityId,
      role: "member"
    });
    
    res.status(201).json(member);
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Failed to join community" });
  }
});

// Leave a community
router.delete("/:communityId/members", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const communityId = parseInt(req.params.communityId);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    // Check if community exists
    const community = await storage.getCommunity(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Check if user is a member
    const isMember = await storage.isCommunityMember(req.user.id, communityId);
    if (!isMember) {
      return res.status(400).json({ message: "Not a member of this community" });
    }
    
    // Don't allow community owners to leave (they must transfer ownership first)
    if (community.createdBy === req.user.id) {
      return res.status(400).json({ 
        message: "Community owners cannot leave. Transfer ownership first." 
      });
    }
    
    // Remove user from community
    await storage.leaveCommunity(req.user.id, communityId);
    
    res.status(200).json({ message: "Successfully left the community" });
  } catch (error) {
    console.error("Error leaving community:", error);
    res.status(500).json({ message: "Failed to leave community" });
  }
});

// Get community members
router.get("/:communityId/members", async (req, res) => {
  try {
    const communityId = parseInt(req.params.communityId);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    // Check if community exists
    const community = await storage.getCommunity(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    const members = await storage.getCommunityMembers(communityId);
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching community members:", error);
    res.status(500).json({ message: "Failed to fetch community members" });
  }
});

// Update member role (moderator only)
router.patch("/:communityId/members/:userId", requireCommunityOwner(), async (req, res) => {
  try {
    const communityId = parseInt(req.params.communityId);
    const userId = parseInt(req.params.userId);
    const { role } = req.body;
    
    if (isNaN(communityId) || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid community ID or user ID" });
    }
    
    if (!role || !["member", "moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'member' or 'moderator'" });
    }
    
    // Check if the target user is a member
    const isMember = await storage.isCommunityMember(userId, communityId);
    if (!isMember) {
      return res.status(404).json({ message: "User is not a member of this community" });
    }
    
    // Update member role
    const updatedMember = await storage.updateCommunityMemberRole(userId, communityId, role);
    
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member role:", error);
    res.status(500).json({ message: "Failed to update member role" });
  }
});

// Community Post routes

// Get all posts in a community
router.get("/:communityId/posts", async (req, res) => {
  try {
    const communityId = parseInt(req.params.communityId);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    // Check if community exists
    const community = await storage.getCommunity(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    const posts = await storage.getCommunityPosts(communityId);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ message: "Failed to fetch community posts" });
  }
});

// Get a specific post
router.get("/:communityId/posts/:postId", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    const post = await storage.getCommunityPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Community post not found" });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching community post:", error);
    res.status(500).json({ message: "Failed to fetch community post" });
  }
});

// Create a post in a community
router.post("/:communityId/posts", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const communityId = parseInt(req.params.communityId);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    // Check if community exists
    const community = await storage.getCommunity(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Check if user is a member
    const isMember = await storage.isCommunityMember(req.user.id, communityId);
    if (!isMember) {
      return res.status(403).json({ message: "Only community members can create posts" });
    }
    
    const validatedData = insertCommunityPostSchema.parse(req.body);
    const postData = {
      ...validatedData,
      userId: req.user.id,
      communityId: communityId
    };
    
    const post = await storage.createCommunityPost(postData);
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating community post:", error);
    res.status(500).json({ message: "Failed to create community post" });
  }
});

// Update a post
router.patch("/:communityId/posts/:postId", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    // Check if post exists
    const post = await storage.getCommunityPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Community post not found" });
    }
    
    // Check if user is the post creator or a moderator
    const isModerator = await storage.isCommunityModerator(req.user.id, post.communityId);
    if (post.userId !== req.user.id && !isModerator) {
      return res.status(403).json({ 
        message: "Only the post creator or moderators can update posts" 
      });
    }
    
    const updatedPost = await storage.updateCommunityPost(postId, req.body);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating community post:", error);
    res.status(500).json({ message: "Failed to update community post" });
  }
});

// Delete a post
router.delete("/:communityId/posts/:postId", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    // Check if post exists
    const post = await storage.getCommunityPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Community post not found" });
    }
    
    // Check if user is the post creator or a moderator
    const isModerator = await storage.isCommunityModerator(req.user.id, post.communityId);
    if (post.userId !== req.user.id && !isModerator) {
      return res.status(403).json({ 
        message: "Only the post creator or moderators can delete posts" 
      });
    }
    
    await storage.deleteCommunityPost(postId);
    
    // If user is a moderator and not the post creator, log a moderation action
    if (isModerator && post.userId !== req.user.id) {
      await storage.createModerationAction({
        moderatorId: req.user.id,
        targetId: post.userId,
        targetType: "user",
        communityId: post.communityId,
        action: "post_removal",
        reason: req.body.reason || "Violated community guidelines"
      });
    }
    
    res.status(200).json({ message: "Community post deleted successfully" });
  } catch (error) {
    console.error("Error deleting community post:", error);
    res.status(500).json({ message: "Failed to delete community post" });
  }
});

// Post comments routes

// Get comments for a post
router.get("/:communityId/posts/:postId/comments", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    // Check if post exists
    const post = await storage.getCommunityPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Community post not found" });
    }
    
    const comments = await storage.getCommunityPostComments(postId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching post comments:", error);
    res.status(500).json({ message: "Failed to fetch post comments" });
  }
});

// Add a comment to a post
router.post("/:communityId/posts/:postId/comments", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const postId = parseInt(req.params.postId);
    const communityId = parseInt(req.params.communityId);
    
    if (isNaN(postId) || isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid post ID or community ID" });
    }
    
    // Check if post exists
    const post = await storage.getCommunityPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Community post not found" });
    }
    
    // Check if user is a community member
    const isMember = await storage.isCommunityMember(req.user.id, communityId);
    if (!isMember) {
      return res.status(403).json({ message: "Only community members can comment" });
    }
    
    const validatedData = insertCommunityPostCommentSchema.parse(req.body);
    const commentData = {
      ...validatedData,
      userId: req.user.id,
      postId: postId
    };
    
    const comment = await storage.createCommunityPostComment(commentData);
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
});

// Update a comment
router.patch("/:communityId/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const commentId = parseInt(req.params.commentId);
    if (isNaN(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    
    // Check if comment exists
    const comment = await storage.getCommunityPostComment(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if user is the comment creator
    if (comment.userId !== req.user.id) {
      // Check if user is a moderator
      const post = await storage.getCommunityPost(comment.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const isModerator = await storage.isCommunityModerator(req.user.id, post.communityId);
      if (!isModerator) {
        return res.status(403).json({ 
          message: "Only the comment creator or moderators can update comments" 
        });
      }
    }
    
    const updatedComment = await storage.updateCommunityPostComment(commentId, req.body);
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Failed to update comment" });
  }
});

// Delete a comment
router.delete("/:communityId/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const commentId = parseInt(req.params.commentId);
    if (isNaN(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    
    // Check if comment exists
    const comment = await storage.getCommunityPostComment(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if user is the comment creator or a moderator
    let isModerator = false;
    if (comment.userId !== req.user.id) {
      // Get the post to check community
      const post = await storage.getCommunityPost(comment.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      isModerator = await storage.isCommunityModerator(req.user.id, post.communityId);
      if (!isModerator) {
        return res.status(403).json({ 
          message: "Only the comment creator or moderators can delete comments" 
        });
      }
    }
    
    await storage.deleteCommunityPostComment(commentId);
    
    // Log moderation action if applicable
    if (isModerator && comment.userId !== req.user.id) {
      const post = await storage.getCommunityPost(comment.postId);
      
      await storage.createModerationAction({
        moderatorId: req.user.id,
        targetUserId: comment.userId,
        communityId: post.communityId,
        actionType: "comment_removal",
        reason: req.body.reason || "Violated community guidelines"
      });
    }
    
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

// Moderation actions routes

// Get moderation actions for a community (moderators only)
router.get("/:communityId/moderation-actions", requireCommunityModerator(), async (req, res) => {
  try {
    const communityId = parseInt(req.params.communityId);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    const actions = await storage.getModerationActionsByCommunity(communityId);
    res.status(200).json(actions);
  } catch (error) {
    console.error("Error fetching moderation actions:", error);
    res.status(500).json({ message: "Failed to fetch moderation actions" });
  }
});

export default router;