import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage.js";
import { 
  insertIndustryExpertSchema,
  insertExpertSessionSchema,
  insertSessionRegistrationSchema,
  insertExpertQnaSessionSchema,
  insertCareerSuccessStorySchema,
  insertNetworkingEventSchema,
  insertEventRegistrationSchema,
  insertExpertMentorshipSchema,
  type IndustryExpert,
  type ExpertSession,
  type SessionRegistration,
  type CareerSuccessStory,
  type NetworkingEvent
} from "@shared/schema.js";

const router = Router();

// INDUSTRY EXPERTS
// Get all experts
router.get("/experts", async (req, res) => {
  try {
    const { industry, expertise, experience } = req.query;
    
    // For now, return sample data until database methods are implemented
    const sampleExperts: IndustryExpert[] = [
      {
        id: 1,
        userId: null,
        name: "Priya Sharma",
        title: "Senior Software Engineer",
        company: "Google India",
        industry: "Technology",
        specializations: ["Machine Learning", "Backend Development", "System Design"],
        experience: 8,
        bio: "Senior Software Engineer at Google with 8+ years of experience in ML and distributed systems. Previously worked at Flipkart and Swiggy. Passionate about mentoring and helping students transition into tech careers.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b69a65bc?w=300",
        linkedinUrl: "https://linkedin.com/in/priyasharma",
        expertise: ["Machine Learning", "System Design", "Career Transition"],
        rating: 95,
        totalSessions: 45,
        isActive: true,
        joinedAt: new Date("2023-01-15")
      },
      {
        id: 2,
        userId: null,
        name: "Rahul Gupta",
        title: "VP of Product",
        company: "Zomato",
        industry: "Product Management",
        specializations: ["Product Strategy", "Growth", "User Experience"],
        experience: 12,
        bio: "VP of Product at Zomato with 12+ years in product management. Led products from 0-1 and scaled to millions of users. Expert in product strategy, growth hacking, and building teams.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
        linkedinUrl: "https://linkedin.com/in/rahulgupta",
        expertise: ["Product Management", "Growth Strategy", "Leadership"],
        rating: 92,
        totalSessions: 38,
        isActive: true,
        joinedAt: new Date("2023-02-20")
      },
      {
        id: 3,
        userId: null,
        name: "Anjali Desai",
        title: "Data Science Manager",
        company: "Microsoft India",
        industry: "Data Science",
        specializations: ["Data Analytics", "AI/ML", "Team Leadership"],
        experience: 10,
        bio: "Data Science Manager at Microsoft with expertise in AI/ML, analytics, and team building. Transitioned from software engineering to data science and now leads a team of 15+ data scientists.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300",
        linkedinUrl: "https://linkedin.com/in/anjalidesai",
        expertise: ["Data Science", "Career Transition", "Team Management"],
        rating: 96,
        totalSessions: 52,
        isActive: true,
        joinedAt: new Date("2023-03-10")
      },
      {
        id: 4,
        userId: null,
        name: "Vikram Singh",
        title: "Founder & CEO",
        company: "TechStart Solutions",
        industry: "Entrepreneurship",
        specializations: ["Startup Building", "Fundraising", "Business Strategy"],
        experience: 15,
        bio: "Serial entrepreneur with 3 successful exits. Currently building TechStart Solutions. Expert in startup strategy, fundraising, and scaling businesses. Mentor at multiple accelerators.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
        linkedinUrl: "https://linkedin.com/in/vikramsingh",
        expertise: ["Entrepreneurship", "Fundraising", "Business Strategy"],
        rating: 94,
        totalSessions: 41,
        isActive: true,
        joinedAt: new Date("2023-01-25")
      }
    ];

    res.json({ 
      success: true, 
      experts: sampleExperts,
      total: sampleExperts.length 
    });
  } catch (error) {
    console.error("Error fetching experts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch experts" 
    });
  }
});

// Get expert by ID
router.get("/experts/:id", async (req, res) => {
  try {
    const expertId = parseInt(req.params.id);
    
    // Sample expert data
    const expert = {
      id: expertId,
      userId: null,
      name: "Priya Sharma",
      title: "Senior Software Engineer",
      company: "Google India",
      industry: "Technology",
      specializations: ["Machine Learning", "Backend Development", "System Design"],
      experience: 8,
      bio: "Senior Software Engineer at Google with 8+ years of experience in ML and distributed systems. Previously worked at Flipkart and Swiggy. Passionate about mentoring and helping students transition into tech careers.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b69a65bc?w=300",
      linkedinUrl: "https://linkedin.com/in/priyasharma",
      expertise: ["Machine Learning", "System Design", "Career Transition"],
      rating: 95,
      totalSessions: 45,
      isActive: true,
      joinedAt: new Date("2023-01-15")
    };

    res.json({ success: true, expert });
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
    
    const sampleSessions: (ExpertSession & { expert: Pick<IndustryExpert, 'name' | 'title' | 'company' | 'avatar'> })[] = [
      {
        id: 1,
        expertId: 1,
        title: "Breaking into Tech: From Engineering to Google",
        description: "Learn how I transitioned from a tier-2 college to Google. I'll share my journey, challenges, and practical tips for landing your dream tech job.",
        sessionType: "lecture",
        category: "career_guidance",
        scheduledAt: new Date("2024-01-15T18:30:00Z"),
        duration: 90,
        maxAttendees: 100,
        currentAttendees: 67,
        meetingLink: "https://meet.google.com/abc-defg-hij",
        recordingUrl: null,
        status: "scheduled",
        tags: ["career-transition", "google", "interview-tips"],
        isRecorded: true,
        isFree: true,
        price: 0,
        createdAt: new Date("2024-01-01"),
        expert: {
          name: "Priya Sharma",
          title: "Senior Software Engineer",
          company: "Google India",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b69a65bc?w=300"
        }
      },
      {
        id: 2,
        expertId: 2,
        title: "Product Management 101: Building Your First Product",
        description: "Interactive workshop on product management fundamentals. Learn about user research, roadmapping, and working with engineering teams.",
        sessionType: "workshop",
        category: "technical",
        scheduledAt: new Date("2024-01-18T19:00:00Z"),
        duration: 120,
        maxAttendees: 50,
        currentAttendees: 32,
        meetingLink: "https://zoom.us/j/123456789",
        recordingUrl: null,
        status: "scheduled",
        tags: ["product-management", "workshop", "beginner"],
        isRecorded: true,
        isFree: true,
        price: 0,
        createdAt: new Date("2024-01-02"),
        expert: {
          name: "Rahul Gupta",
          title: "VP of Product",
          company: "Zomato",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300"
        }
      },
      {
        id: 3,
        expertId: 3,
        title: "Q&A: Data Science Career Paths in India",
        description: "Open Q&A session about data science careers, skill requirements, and industry trends in India. Bring your questions!",
        sessionType: "qa",
        category: "career_guidance",
        scheduledAt: new Date("2024-01-20T17:00:00Z"),
        duration: 60,
        maxAttendees: 75,
        currentAttendees: 41,
        meetingLink: "https://teams.microsoft.com/l/meetup-join/abc",
        recordingUrl: null,
        status: "scheduled",
        tags: ["data-science", "qa-session", "career-guidance"],
        isRecorded: true,
        isFree: true,
        price: 0,
        createdAt: new Date("2024-01-03"),
        expert: {
          name: "Anjali Desai",
          title: "Data Science Manager",
          company: "Microsoft India",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300"
        }
      }
    ];

    res.json({ 
      success: true, 
      sessions: sampleSessions,
      total: sampleSessions.length 
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
router.get("/success-stories", async (req, res) => {
  try {
    const { industry, careerPath, featured } = req.query;
    
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
router.get("/networking-events", async (req, res) => {
  try {
    const { eventType, industry, upcoming } = req.query;
    
    const sampleEvents: (NetworkingEvent & { expert?: { name: string; title: string; company: string } })[] = [
      {
        id: 1,
        title: "Tech Professionals Meetup - Bangalore",
        description: "Monthly meetup for tech professionals in Bangalore. Network with peers, share experiences, and learn about latest trends in technology.",
        eventType: "virtual_meetup",
        industry: "Technology",
        targetAudience: ["students", "freshers", "experienced"],
        organizer: "TechBangalore Community",
        organizerId: null,
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
        organizerId: null,
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

export default router;