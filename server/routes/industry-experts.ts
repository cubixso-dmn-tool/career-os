import { Router } from "express";
import { db } from "../db.js";
import { industryExperts, expertSessions, expertConnections, expertMessages } from "../../shared/schema.js";
import { eq, sql, and, desc, or } from "drizzle-orm";

// Interfaces for type checking
interface CareerSuccessStory {
  id: number;
  authorId: number | null;
  expertId: number | null;
  title: string;
  story: string;
  careerPath: string;
  industryFrom?: string;
  industryTo: string;
  timeframe?: string;
  keyLearnings: string[];
  challenges: string[];
  advice: string[];
  salaryGrowth?: string;
  companyProgression: string[];
  skillsGained: string[];
  certifications: string[];
  isPublic: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
  createdAt: Date;
}

interface NetworkingEvent {
  id: number;
  title: string;
  description: string;
  eventType: string;
  industry?: string;
  targetAudience: string[];
  organizer: string;
  organizerId?: number;
  expertId?: number;
  scheduledAt: Date;
  endTime: Date;
  timezone: string;
  location?: string;
  meetingLink?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isOnline: boolean;
  isFree: boolean;
  registrationDeadline?: Date;
  tags: string[];
  agenda?: any;
  status: string;
  createdAt: Date;
}

const router = Router();

// INDUSTRY EXPERTS
// Get all experts
router.get("/experts", async (req, res) => {
  try {
    const { industry, expertise, experience, featured } = req.query;
    
    // Build query conditions
    const conditions = [];
    conditions.push(eq(industryExperts.isActive, true));
    
    if (industry) {
      conditions.push(eq(industryExperts.industry, industry as string));
    }
    
    if (experience) {
      const expYears = parseInt(experience as string);
      if (!isNaN(expYears)) {
        conditions.push(sql`${industryExperts.experience} >= ${expYears}`);
      }
    }
    
    if (featured === 'true') {
      conditions.push(sql`${industryExperts}.is_featured = true`);
    }

    // Query experts from database
    let expertsList;
    
    // Sort by featured status first, then by featured order, then by joinedAt
    if (featured === 'true') {
      expertsList = await db
        .select()
        .from(industryExperts)
        .where(and(...conditions))
        .orderBy(
          sql`${industryExperts}.featured_order ASC NULLS LAST`,
          desc(industryExperts.joinedAt)
        );
    } else {
      expertsList = await db
        .select()
        .from(industryExperts)
        .where(and(...conditions))
        .orderBy(
          sql`${industryExperts}.is_featured DESC`,
          sql`${industryExperts}.featured_order ASC NULLS LAST`,
          desc(industryExperts.joinedAt)
        );
    }
    
    if (expertise) {
      const expertiseArr = Array.isArray(expertise) ? expertise : [expertise];
      expertsList = expertsList.filter(expert =>
        expertiseArr.some(exp => 
          expert.expertise.includes(exp as string) || 
          expert.specializations.includes(exp as string)
        )
      );
    }

    res.json({ 
      success: true, 
      experts: expertsList,
      total: expertsList.length 
    });
  } catch (error) {
    console.error("Error fetching experts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch experts" 
    });
  }
});

// Get featured experts
router.get("/featured-experts", async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = parseInt(limit as string);
    
    // Query featured experts
    const featuredExperts = await db
      .select()
      .from(industryExperts)
      .where(and(
        eq(industryExperts.isActive, true),
        sql`${industryExperts}.is_featured = true`
      ))
      .orderBy(
        sql`${industryExperts}.featured_order ASC NULLS LAST`,
        desc(industryExperts.joinedAt)
      )
      .limit(limitNum);

    res.json({ 
      success: true, 
      experts: featuredExperts,
      total: featuredExperts.length 
    });
  } catch (error) {
    console.error("Error fetching featured experts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch featured experts" 
    });
  }
});

// Get expert by ID
router.get("/experts/:id", async (req, res) => {
  try {
    const expertId = parseInt(req.params.id);
    
    if (isNaN(expertId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expert ID"
      });
    }
    
    // Query expert from database
    const expert = await db
      .select()
      .from(industryExperts)
      .where(and(
        eq(industryExperts.id, expertId),
        eq(industryExperts.isActive, true)
      ))
      .limit(1);

    if (expert.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Expert not found"
      });
    }

    res.json({ success: true, expert: expert[0] });
  } catch (error) {
    console.error("Error fetching expert:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch expert" 
    });
  }
});

// EXPERT SESSIONS
// Get upcoming sessions
router.get("/sessions", async (req, res) => {
  try {
    const { category, sessionType, expertId } = req.query;
    
    // Build query conditions
    const conditions = [];
    conditions.push(sql`${expertSessions}.scheduled_at > NOW()`); // Only future sessions
    
    if (category) {
      conditions.push(eq(expertSessions.category, category as string));
    }
    
    if (sessionType) {
      conditions.push(eq(expertSessions.sessionType, sessionType as string));
    }
    
    if (expertId) {
      const expId = parseInt(expertId as string);
      if (!isNaN(expId)) {
        conditions.push(eq(expertSessions.expertId, expId));
      }
    }

    // Query sessions with expert details
    const sessionsList = await db
      .select({
        id: expertSessions.id,
        expertId: expertSessions.expertId,
        title: expertSessions.title,
        description: expertSessions.description,
        sessionType: expertSessions.sessionType,
        category: expertSessions.category,
        scheduledAt: expertSessions.scheduledAt,
        duration: expertSessions.duration,
        maxAttendees: expertSessions.maxAttendees,
        currentAttendees: expertSessions.currentAttendees,
        meetingLink: expertSessions.meetingLink,
        status: expertSessions.status,
        tags: expertSessions.tags,
        isFree: expertSessions.isFree,
        price: expertSessions.price,
        createdAt: expertSessions.createdAt,
        // Expert details
        expertName: industryExperts.name,
        expertTitle: industryExperts.title,
        expertCompany: industryExperts.company,
        expertAvatar: industryExperts.avatar
      })
      .from(expertSessions)
      .leftJoin(industryExperts, eq(expertSessions.expertId, industryExperts.id))
      .where(and(...conditions))
      .orderBy(expertSessions.scheduledAt);

    // Transform the data to match the expected format
    const formattedSessions = sessionsList.map(session => ({
      id: session.id,
      expertId: session.expertId,
      title: session.title,
      description: session.description,
      sessionType: session.sessionType,
      category: session.category,
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      maxAttendees: session.maxAttendees || 100,
      currentAttendees: session.currentAttendees || 0,
      meetingLink: session.meetingLink,
      status: session.status,
      tags: session.tags || [],
      isFree: session.isFree !== false, // default to true if null
      price: session.price || 0,
      createdAt: session.createdAt,
      expert: {
        name: session.expertName || 'Unknown Expert',
        title: session.expertTitle || 'Expert',
        company: session.expertCompany || 'Company',
        avatar: session.expertAvatar
      }
    }));

    res.json({ 
      success: true, 
      sessions: formattedSessions,
      total: formattedSessions.length 
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch sessions" 
    });
  }
});

// Register for a session
router.post("/sessions/:id/register", async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const { questions } = req.body;

    // Simulate registration
    const registration = {
      id: Date.now(),
      sessionId,
      userId,
      registeredAt: new Date(),
      attended: false,
      rating: null,
      feedback: null,
      questions: questions || []
    };

    res.json({ 
      success: true, 
      registration,
      message: "Successfully registered for the session" 
    });
  } catch (error) {
    console.error("Error registering for session:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to register for session" 
    });
  }
});

// CAREER SUCCESS STORIES
// Get success stories
router.get("/success-stories", async (_, res) => {
  try {
    
    const sampleStories: (CareerSuccessStory & { author?: { name: string; avatar?: string } })[] = [
      {
        id: 1,
        authorId: null,
        expertId: 1,
        title: "From Tier-3 College to Google: My 3-Year Journey",
        story: "I graduated from a tier-3 engineering college in 2019 with average grades and no clear direction. Here's how I landed a job at Google in just 3 years...",
        careerPath: "Software Engineer at Google",
        industryFrom: "Student",
        industryTo: "Technology",
        timeframe: "3 years",
        keyLearnings: [
          "Consistent coding practice is more important than college rankings",
          "Open source contributions can make your profile stand out",
          "Mock interviews are crucial for building confidence",
          "Networking through LinkedIn and Twitter helped immensely"
        ],
        challenges: [
          "Lack of proper guidance in college",
          "Imposter syndrome during interviews",
          "Competing with students from premier colleges",
          "Financial constraints for courses and resources"
        ],
        advice: [
          "Start coding early and build projects",
          "Focus on data structures and algorithms",
          "Contribute to open source projects",
          "Build a strong LinkedIn presence",
          "Never give up, rejections are part of the journey"
        ],
        salaryGrowth: "0 LPA to 25 LPA",
        companyProgression: ["Fresher", "Startup", "Google"],
        skillsGained: ["Python", "System Design", "Machine Learning", "Distributed Systems"],
        certifications: ["Google Cloud Professional", "AWS Solutions Architect"],
        isPublic: true,
        isFeatured: true,
        views: 1250,
        likes: 89,
        createdAt: new Date("2024-01-01"),
        author: {
          name: "Priya Sharma",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b69a65bc?w=300"
        }
      },
      {
        id: 2,
        authorId: null,
        expertId: 4,
        title: "From Corporate Job to Successful Startup: The Entrepreneurial Leap",
        story: "After 5 years in consulting, I decided to start my own company. Here's the real story of building a startup from scratch in India...",
        careerPath: "Consultant to Startup Founder",
        industryFrom: "Consulting",
        industryTo: "Entrepreneurship",
        timeframe: "2 years",
        keyLearnings: [
          "Market validation is everything",
          "Building the right team is harder than building the product",
          "Fundraising is a full-time job",
          "Customer feedback should drive product decisions"
        ],
        challenges: [
          "Leaving a stable high-paying job",
          "Finding the right co-founder",
          "Initial funding and bootstrapping",
          "Building credibility with customers"
        ],
        advice: [
          "Validate your idea before quitting your job",
          "Build a minimum viable product first",
          "Network actively in the startup ecosystem",
          "Be prepared for long hours and uncertainty",
          "Learn from failures quickly"
        ],
        salaryGrowth: "12 LPA to Variable (Equity)",
        companyProgression: ["McKinsey", "Founding Team", "CEO"],
        skillsGained: ["Business Strategy", "Fundraising", "Team Building", "Product Development"],
        certifications: ["YCombinator Startup School", "Product Management Certificate"],
        isPublic: true,
        isFeatured: true,
        views: 890,
        likes: 67,
        createdAt: new Date("2024-01-05"),
        author: {
          name: "Vikram Singh",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"
        }
      }
    ];

    res.json({ 
      success: true, 
      stories: sampleStories,
      total: sampleStories.length 
    });
  } catch (error) {
    console.error("Error fetching success stories:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch success stories" 
    });
  }
});

// NETWORKING EVENTS
// Get networking events
router.get("/networking-events", async (_, res) => {
  try {
    
    const sampleEvents: (NetworkingEvent & { expert?: { name: string; title: string; company: string } })[] = [
      {
        id: 1,
        title: "Tech Professionals Meetup - Bangalore",
        description: "Monthly meetup for tech professionals in Bangalore. Network with peers, share experiences, and learn about latest trends in technology.",
        eventType: "virtual_meetup",
        industry: "Technology",
        targetAudience: ["students", "freshers", "experienced"],
        organizer: "TechBangalore Community",
        organizerId: undefined,
        expertId: 1,
        scheduledAt: new Date("2024-01-25T19:00:00Z"),
        endTime: new Date("2024-01-25T21:00:00Z"),
        timezone: "Asia/Kolkata",
        location: "Online",
        meetingLink: "https://meet.google.com/tech-bangalore-meetup",
        maxAttendees: 200,
        currentAttendees: 145,
        isOnline: true,
        isFree: true,
        registrationDeadline: new Date("2024-01-24T23:59:59Z"),
        tags: ["networking", "technology", "bangalore", "career"],
        agenda: {
          "19:00-19:15": "Welcome & Introductions",
          "19:15-19:45": "Panel Discussion: Career Growth in Tech",
          "19:45-20:30": "Networking Breakout Rooms",
          "20:30-21:00": "Q&A and Closing"
        },
        status: "upcoming",
        createdAt: new Date("2024-01-01"),
        expert: {
          name: "Priya Sharma",
          title: "Senior Software Engineer",
          company: "Google India"
        }
      },
      {
        id: 2,
        title: "Product Management Career Fair 2024",
        description: "Connect with product managers from top companies. Learn about open positions, interview processes, and career growth opportunities.",
        eventType: "career_fair",
        industry: "Product Management",
        targetAudience: ["students", "freshers"],
        organizer: "ProductHunt India",
        organizerId: undefined,
        expertId: 2,
        scheduledAt: new Date("2024-01-28T10:00:00Z"),
        endTime: new Date("2024-01-28T16:00:00Z"),
        timezone: "Asia/Kolkata",
        location: "Online",
        meetingLink: "https://zoom.us/j/pm-career-fair-2024",
        maxAttendees: 500,
        currentAttendees: 287,
        isOnline: true,
        isFree: true,
        registrationDeadline: new Date("2024-01-27T23:59:59Z"),
        tags: ["career-fair", "product-management", "hiring", "networking"],
        agenda: {
          "10:00-10:30": "Opening Keynote",
          "10:30-12:00": "Company Presentations",
          "12:00-13:00": "Lunch Break",
          "13:00-15:00": "One-on-One Sessions",
          "15:00-16:00": "Panel: Breaking into Product Management"
        },
        status: "upcoming",
        createdAt: new Date("2024-01-02")
      }
    ];

    res.json({ 
      success: true, 
      events: sampleEvents,
      total: sampleEvents.length 
    });
  } catch (error) {
    console.error("Error fetching networking events:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch networking events" 
    });
  }
});

// Register for networking event
router.post("/networking-events/:id/register", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const { networkingGoals, interests } = req.body;

    // Simulate registration
    const registration = {
      id: Date.now(),
      eventId,
      userId,
      registeredAt: new Date(),
      attended: false,
      rating: null,
      feedback: null,
      networkingGoals: networkingGoals || [],
      interests: interests || []
    };

    res.json({ 
      success: true, 
      registration,
      message: "Successfully registered for the networking event" 
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to register for event" 
    });
  }
});

// Get expert availability
router.get("/experts/:id/availability", async (req, res) => {
  try {
    const expertId = parseInt(req.params.id);
    
    // Sample availability data
    const availability = [
      { dayOfWeek: 1, startTime: "09:00", endTime: "12:00", timezone: "Asia/Kolkata", isAvailable: true, sessionTypes: ["mentoring", "qa"] },
      { dayOfWeek: 3, startTime: "14:00", endTime: "17:00", timezone: "Asia/Kolkata", isAvailable: true, sessionTypes: ["lecture", "workshop"] },
      { dayOfWeek: 5, startTime: "19:00", endTime: "21:00", timezone: "Asia/Kolkata", isAvailable: true, sessionTypes: ["qa", "mentoring"] }
    ];

    res.json({ 
      success: true, 
      availability,
      expertId 
    });
  } catch (error) {
    console.error("Error fetching expert availability:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch expert availability" 
    });
  }
});

// Book mentorship session
router.post("/experts/:id/mentorship", async (req, res) => {
  try {
    const expertId = parseInt(req.params.id);
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const { duration, goals, meetingFrequency, communicationMode } = req.body;

    // Simulate mentorship booking
    const mentorship = {
      id: Date.now(),
      expertId,
      menteeId: userId,
      status: "pending",
      duration,
      goals,
      meetingFrequency,
      communicationMode,
      startDate: null,
      endDate: null,
      notes: null,
      menteeProgress: null,
      createdAt: new Date()
    };

    res.json({ 
      success: true, 
      mentorship,
      message: "Mentorship request submitted successfully. The expert will review and respond soon." 
    });
  } catch (error) {
    console.error("Error booking mentorship:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to book mentorship session" 
    });
  }
});

// EXPERT CONNECTIONS
// Create new connection
router.post("/connect", async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const { expertId, connectionType, purpose, message } = req.body;

    if (!expertId || !connectionType || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Expert ID, connection type, and purpose are required"
      });
    }

    // Check if expert exists and is active
    const expert = await db
      .select()
      .from(industryExperts)
      .where(and(
        eq(industryExperts.id, expertId),
        eq(industryExperts.isActive, true)
      ))
      .limit(1);

    if (expert.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Expert not found or inactive"
      });
    }

    // Check if connection already exists
    const existingConnection = await db
      .select()
      .from(expertConnections)
      .where(and(
        eq(expertConnections.expertId, expertId),
        eq(expertConnections.userId, userId),
        eq(expertConnections.status, 'active')
      ))
      .limit(1);

    if (existingConnection.length > 0) {
      return res.json({
        success: true,
        connectionId: existingConnection[0].id,
        message: "Connection already exists"
      });
    }

    // Create new connection
    const [newConnection] = await db
      .insert(expertConnections)
      .values({
        expertId,
        userId,
        connectionType,
        purpose,
        message
      })
      .returning();

    // Send initial message if provided
    if (message && message.trim()) {
      await db
        .insert(expertMessages)
        .values({
          connectionId: newConnection.id,
          senderId: userId,
          receiverId: expert[0].userId || expertId, // Use expert's user ID if available
          message: message.trim()
        });
    }

    res.json({ 
      success: true, 
      connectionId: newConnection.id,
      connection: newConnection,
      message: "Connection established successfully" 
    });
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create connection" 
    });
  }
});

// Get user's connections
router.get("/connections", async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    // Get connections with expert details
    const connections = await db
      .select({
        id: expertConnections.id,
        expertId: expertConnections.expertId,
        connectionType: expertConnections.connectionType,
        status: expertConnections.status,
        purpose: expertConnections.purpose,
        createdAt: expertConnections.createdAt,
        lastActivityAt: expertConnections.lastActivityAt,
        // Expert details
        expertName: industryExperts.name,
        expertTitle: industryExperts.title,
        expertCompany: industryExperts.company,
        expertAvatar: industryExperts.avatar,
        expertIndustry: industryExperts.industry
      })
      .from(expertConnections)
      .leftJoin(industryExperts, eq(expertConnections.expertId, industryExperts.id))
      .where(eq(expertConnections.userId, userId))
      .orderBy(desc(expertConnections.lastActivityAt));

    res.json({ 
      success: true, 
      connections 
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch connections" 
    });
  }
});

// Get messages for a connection
router.get("/connections/:id/messages", async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const connectionId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    if (isNaN(connectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid connection ID"
      });
    }

    // Verify user has access to this connection
    const connection = await db
      .select()
      .from(expertConnections)
      .where(and(
        eq(expertConnections.id, connectionId),
        or(
          eq(expertConnections.userId, userId),
          eq(expertConnections.expertId, userId) // In case user is an expert
        )
      ))
      .limit(1);

    if (connection.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this connection"
      });
    }

    // Get messages
    const messages = await db
      .select()
      .from(expertMessages)
      .where(eq(expertMessages.connectionId, connectionId))
      .orderBy(expertMessages.createdAt);

    // Mark messages as read for the current user
    await db
      .update(expertMessages)
      .set({ isRead: true })
      .where(and(
        eq(expertMessages.connectionId, connectionId),
        eq(expertMessages.receiverId, userId),
        eq(expertMessages.isRead, false)
      ));

    res.json({ 
      success: true, 
      messages 
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch messages" 
    });
  }
});

// Send message
router.post("/connections/:id/messages", async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const connectionId = parseInt(req.params.id);
    const { message, messageType = 'text' } = req.body;
    
    console.log('POST /messages - connectionId:', connectionId, 'userId:', userId, 'message:', message);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    if (isNaN(connectionId) || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid connection ID or empty message"
      });
    }

    // Verify user has access to this connection
    // First, check if user is the regular user in the connection
    let connection = await db
      .select()
      .from(expertConnections)
      .where(and(
        eq(expertConnections.id, connectionId),
        eq(expertConnections.userId, userId),
        eq(expertConnections.status, 'active')
      ))
      .limit(1);

    // If not found, check if user is the expert (by checking if their userId matches any expert's userId)
    if (connection.length === 0) {
      connection = await db
        .select({
          id: expertConnections.id,
          expertId: expertConnections.expertId,
          userId: expertConnections.userId,
          connectionType: expertConnections.connectionType,
          status: expertConnections.status,
          purpose: expertConnections.purpose,
          message: expertConnections.message,
          createdAt: expertConnections.createdAt,
          lastActivityAt: expertConnections.lastActivityAt
        })
        .from(expertConnections)
        .innerJoin(industryExperts, eq(expertConnections.expertId, industryExperts.id))
        .where(and(
          eq(expertConnections.id, connectionId),
          eq(industryExperts.userId, userId),
          eq(expertConnections.status, 'active')
        ))
        .limit(1);
    }

    if (connection.length === 0) {
      console.log('Connection not found for connectionId:', connectionId, 'userId:', userId);
      return res.status(403).json({
        success: false,
        message: "Connection not found or inactive"
      });
    }
    
    console.log('Found connection:', connection[0]);

    // Determine receiver ID
    let receiverId;
    if (connection[0].userId === userId) {
      // User is sending to expert, get expert's user_id
      const expert = await db
        .select({ userId: industryExperts.userId })
        .from(industryExperts)
        .where(eq(industryExperts.id, connection[0].expertId))
        .limit(1);
      
      if (expert.length === 0 || !expert[0].userId) {
        console.log('Expert not found or not linked to user:', expert);
        return res.status(400).json({
          success: false,
          message: "Expert account not properly linked"
        });
      }
      receiverId = expert[0].userId;
      console.log('User sending to expert, receiverId:', receiverId);
    } else {
      // Expert is sending to user
      receiverId = connection[0].userId;
      console.log('Expert sending to user, receiverId:', receiverId);
    }
    
    console.log('About to insert message with senderId:', userId, 'receiverId:', receiverId);

    // Insert message
    const [newMessage] = await db
      .insert(expertMessages)
      .values({
        connectionId,
        senderId: userId,
        receiverId,
        message: message.trim(),
        messageType
      })
      .returning();

    // Update connection's last activity
    await db
      .update(expertConnections)
      .set({ lastActivityAt: new Date() })
      .where(eq(expertConnections.id, connectionId));

    res.json({ 
      success: true, 
      message: newMessage 
    });
  } catch (error) {
    console.error("Error sending message:", error);
    console.error("Error details:", error?.message, error?.code, error?.detail);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message" 
    });
  }
});

export default router;