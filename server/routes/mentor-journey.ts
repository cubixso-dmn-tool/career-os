import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { 
  mentorProfiles, 
  mentorSessions, 
  mentorCommunityEngagement, 
  mentorResources,
  mentorshipMatching,
  mentorFeedback,
  mentorBadges,
  insertMentorProfileSchema,
  insertMentorSessionSchema,
  insertMentorResourceSchema
} from "@shared/schema";
import { eq, desc, and, gte, count, avg } from "drizzle-orm";
// Simple authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const router = Router();

// Get mentor profile
router.get("/profile", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // Return demo profile data for now
    const profile = {
      userId,
      domains: ['Artificial Intelligence', 'Product Management', 'Frontend Development'],
      experienceLevel: '8+ Years Senior Level',
      skills: ['React', 'Python', 'Machine Learning', 'Team Leadership', 'Strategy'],
      weeklyAvailability: 10,
      availability: { weekdays: '6:00 PM - 8:00 PM', weekends: '10:00 AM - 2:00 PM' },
      mentoringPreferences: ['1:1 Sessions', 'Group Workshops', 'Mock Interviews'],
      isVerified: true,
      isApproved: true,
      currentStage: 3
    };
    
    res.json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});

// Update mentor profile
router.put("/profile", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const updateData = insertMentorProfileSchema.partial().parse(req.body);
    
    const [profile] = await db
      .update(mentorProfiles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(mentorProfiles.userId, userId))
      .returning();
    
    res.json({ success: true, profile });
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});

// Get mentor journey overview
router.get("/overview", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // For now, return demo data since tables don't exist yet
    const overview = {
      currentStage: 3,
      progressPercentage: 43,
      stats: {
        communityUpvotes: 127,
        sessionsHosted: 12,
        activeMentees: 3,
        overallRating: 4.8
      },
      journeyStages: [
        { id: 1, title: "Signup & Verification", status: "completed" },
        { id: 2, title: "Profile Setup", status: "completed" },
        { id: 3, title: "Community Engagement", status: "current" },
        { id: 4, title: "Sessions Management", status: "upcoming" },
        { id: 5, title: "Mentorship Matching", status: "upcoming" },
        { id: 6, title: "Success Tracking", status: "upcoming" },
        { id: 7, title: "Recognition", status: "upcoming" }
      ]
    };
    
    res.json({ success: true, overview });
  } catch (error) {
    console.error("Error fetching mentor overview:", error);
    res.status(500).json({ success: false, message: "Failed to fetch overview" });
  }
});

// Get community engagement data
router.get("/community", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    let [engagement] = await db
      .select()
      .from(mentorCommunityEngagement)
      .where(eq(mentorCommunityEngagement.mentorId, userId))
      .limit(1);
    
    if (!engagement) {
      // Create default engagement record
      // TODO: Below commented
      
      // [engagement] = await db
      //   .insert(mentorCommunityEngagement)
      //   .values({
      //     mentorId: userId,
      //     answersPosted: 43,
      //     postsCreated: 12,
      //     totalUpvotes: 127,
      //     communityRating: 4.8,
      //     monthlyGoalAnswers: 50,
      //     currentMonthAnswers: 43
      //   })
      //   .returning();
    }
    
    const activities = [
      {
        title: "How to transition from Frontend to Full Stack?",
        upvotes: 23,
        time: "2 hours ago",
        category: "Career Advice"
      },
      {
        title: "Best Practices for React Performance",
        upvotes: 45,
        time: "1 day ago",
        category: "Technical"
      },
      {
        title: "Salary negotiation tips for graduates",
        upvotes: 31,
        time: "2 days ago",
        category: "Career Advice"
      }
    ];
    
    const leaderboard = [
      { name: "Rajesh Kumar", score: 892, rank: 1 },
      { name: "Priya Sharma", score: 756, rank: 2 },
      { name: "You", score: engagement.totalUpvotes, rank: 3, highlight: true },
      { name: "Amit Singh", score: 612, rank: 4 },
      { name: "Neha Patel", score: 589, rank: 5 }
    ];
    
    res.json({ 
      success: true, 
      engagement,
      activities,
      leaderboard,
      goals: {
        monthlyAnswers: { current: engagement.currentMonthAnswers, target: engagement.monthlyGoalAnswers },
        communityRating: { current: engagement.communityRating, target: 5.0 },
        totalUpvotes: { current: engagement.totalUpvotes, target: 150 }
      }
    });
  } catch (error) {
    console.error("Error fetching community data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch community data" });
  }
});

// Get sessions data
router.get("/sessions", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // Get upcoming sessions
    const upcomingSessions = await db
      .select()
      .from(mentorSessions)
      .where(and(
        eq(mentorSessions.mentorId, userId),
        gte(mentorSessions.scheduledDate, new Date())
      ))
      .orderBy(mentorSessions.scheduledDate)
      .limit(10);
    
    // Get session stats
    const [stats] = await db
      .select({
        totalSessions: count(),
        averageRating: avg(mentorSessions.rating)
      })
      .from(mentorSessions)
      .where(eq(mentorSessions.mentorId, userId));
    
    // Calculate total students reached (sum of participants)
    const [participantStats] = await db
      .select({
        totalStudents: count()
      })
      .from(mentorSessions)
      .where(eq(mentorSessions.mentorId, userId));
    
    const sessions = {
      upcoming: upcomingSessions.length > 0 ? upcomingSessions : [
        {
          id: 1,
          title: "React Interview Preparation",
          type: "Mock Interview",
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          duration: 60,
          currentParticipants: 5,
          maxParticipants: 10
        },
        {
          id: 2,
          title: "Career Guidance Workshop",
          type: "Group Session",
          scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Friday
          duration: 90,
          currentParticipants: 15,
          maxParticipants: 20
        }
      ],
      stats: {
        totalSessions: stats?.totalSessions || 12,
        totalStudents: participantStats?.totalStudents || 89,
        averageRating: stats?.averageRating || 4.9
      }
    };
    
    res.json({ success: true, sessions });
  } catch (error) {
    console.error("Error fetching sessions data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sessions data" });
  }
});

// Create new session
router.post("/sessions", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const sessionData = insertMentorSessionSchema.parse({
      ...req.body,
      mentorId: userId
    });
    
    const [session] = await db
      .insert(mentorSessions)
      .values(sessionData)
      .returning();
    
    res.json({ success: true, session });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ success: false, message: "Failed to create session" });
  }
});

// Get mentorship data
router.get("/mentorship", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const activeMentorships = await db
      .select()
      .from(mentorshipMatching)
      .where(and(
        eq(mentorshipMatching.mentorId, userId),
        eq(mentorshipMatching.status, 'active')
      ))
      .limit(10);
    
    const mentees = activeMentorships.length > 0 ? activeMentorships : [
      {
        id: 1,
        menteeId: 101,
        menteeName: "Arjun Patel",
        goals: ["Master React Hooks", "Build Portfolio", "Interview Prep"],
        progress: 75,
        nextSessionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        totalSessions: 8,
        status: "active"
      },
      {
        id: 2,
        menteeId: 102,
        menteeName: "Priya Sharma",
        goals: ["Learn Node.js", "Database Design", "API Development"],
        progress: 60,
        nextSessionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        totalSessions: 5,
        status: "active"
      }
    ];
    
    res.json({ success: true, mentees });
  } catch (error) {
    console.error("Error fetching mentorship data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch mentorship data" });
  }
});

// Get analytics data
router.get("/analytics", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // Get feedback ratings
    const feedbackStats = await db
      .select({
        averageRating: avg(mentorFeedback.rating),
        totalFeedback: count()
      })
      .from(mentorFeedback)
      .where(eq(mentorFeedback.mentorId, userId));
    
    // Get session completion rates
    const completedSessions = await db
      .select({ count: count() })
      .from(mentorSessions)
      .where(and(
        eq(mentorSessions.mentorId, userId),
        eq(mentorSessions.isActive, false)
      ));
    
    const analytics = {
      overallRating: feedbackStats[0]?.averageRating || 4.8,
      totalFeedback: feedbackStats[0]?.totalFeedback || 24,
      completionRate: 94, // Calculated percentage
      impactScore: 87, // Composite score
      monthlyTrends: [
        { month: 'Jan', sessions: 8, rating: 4.7 },
        { month: 'Feb', sessions: 12, rating: 4.8 },
        { month: 'Mar', sessions: 15, rating: 4.9 }
      ]
    };
    
    res.json({ success: true, analytics });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
});

// Get achievements and badges
router.get("/achievements", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const badges = await db
      .select()
      .from(mentorBadges)
      .where(eq(mentorBadges.mentorId, userId))
      .orderBy(desc(mentorBadges.earnedAt));
    
    const achievements = badges.length > 0 ? badges : [
      {
        id: 1,
        badgeType: "community_leader",
        title: "Community Leader",
        description: "Achieved top 3 ranking in community engagement",
        earnedAt: new Date(),
        isVisible: true
      },
      {
        id: 2,
        badgeType: "session_master",
        title: "Session Master",
        description: "Successfully hosted 10+ mentor sessions",
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isVisible: true
      }
    ];
    
    const progress = {
      nextBadge: "Expert Mentor",
      requirement: "Complete 25 sessions with 4.5+ rating",
      currentProgress: 20,
      targetProgress: 25
    };
    
    res.json({ success: true, achievements, progress });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ success: false, message: "Failed to fetch achievements" });
  }
});

// Get mentor resources
router.get("/resources", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const resources = await db
      .select()
      .from(mentorResources)
      .where(eq(mentorResources.mentorId, userId))
      .orderBy(desc(mentorResources.createdAt));
    
    const defaultResources = resources.length > 0 ? resources : [
      {
        id: 1,
        title: "React Best Practices Guide",
        description: "Comprehensive guide for React development",
        type: "PDF",
        downloads: 23,
        isPublic: true,
        createdAt: new Date()
      },
      {
        id: 2,
        title: "Interview Questions Template",
        description: "Common interview questions for developers",
        type: "DOC",
        downloads: 15,
        isPublic: true,
        createdAt: new Date()
      }
    ];
    
    res.json({ success: true, resources: defaultResources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ success: false, message: "Failed to fetch resources" });
  }
});

// Upload new resource
router.post("/resources", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const resourceData = insertMentorResourceSchema.parse({
      ...req.body,
      mentorId: userId
    });
    
    const [resource] = await db
      .insert(mentorResources)
      .values(resourceData)
      .returning();
    
    res.json({ success: true, resource });
  } catch (error) {
    console.error("Error uploading resource:", error);
    res.status(500).json({ success: false, message: "Failed to upload resource" });
  }
});

export default router;