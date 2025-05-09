import { Router, Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { authenticateRoute } from "../middleware/auth";

const router = Router();

// Mock data for learning tracks
const mockTracks = [
  {
    id: 1,
    title: "Full Stack Development",
    description: "Comprehensive learning track covering frontend, backend, and DevOps for modern web applications",
    courseCount: 5,
    estimatedHours: 40,
    targetCareer: "Web Developer",
    difficulty: "intermediate",
    image: "https://placehold.co/400x225/4f46e5/ffffff?text=Web+Development"
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    description: "Build your foundation in data analysis, visualization, and machine learning algorithms",
    courseCount: 4,
    estimatedHours: 35,
    targetCareer: "Data Analyst",
    difficulty: "beginner",
    image: "https://placehold.co/400x225/0891b2/ffffff?text=Data+Science"
  },
  {
    id: 3,
    title: "Advanced Frontend Engineering",
    description: "Master modern frontend frameworks, state management, and responsive design techniques",
    courseCount: 3,
    estimatedHours: 30,
    targetCareer: "Frontend Engineer",
    difficulty: "advanced",
    image: "https://placehold.co/400x225/db2777/ffffff?text=Frontend"
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Create cross-platform mobile applications using React Native and related technologies",
    courseCount: 4,
    estimatedHours: 28,
    targetCareer: "Mobile Developer",
    difficulty: "intermediate",
    image: "https://placehold.co/400x225/2563eb/ffffff?text=Mobile+Dev"
  }
];

// Mock data for microlearning bites
const mockBites = [
  {
    id: 1,
    title: "Introduction to TypeScript Generics",
    description: "Learn how to implement type-safe, reusable code patterns with TypeScript generics",
    category: "Programming",
    estimatedMinutes: 10,
    completed: true,
    date: new Date().toISOString(),
    badges: [
      {
        id: 1,
        name: "Quick Learner",
        icon: "trophy",
        earned: true
      },
      {
        id: 2,
        name: "TypeScript Pro",
        icon: "bookmark",
        earned: false
      }
    ]
  },
  {
    id: 2,
    title: "CSS Grid Layout Essentials",
    description: "Master modern layout techniques with CSS Grid for responsive web applications",
    category: "Web Development",
    estimatedMinutes: 8,
    completed: false,
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    badges: [
      {
        id: 3,
        name: "UI Expert",
        icon: "edit",
        earned: true
      }
    ]
  }
];

// Mock data for learning activity
const generateMockActivity = () => {
  const activities = [];
  const now = new Date();
  
  // Generate 90 days of activity data
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random activity count (more likely to have activity in recent days)
    const randomFactor = Math.random() * 10;
    const isRecent = i < 30;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    const count = isRecent 
      ? (isWeekend ? Math.floor(Math.random() * 3) : Math.floor(randomFactor / 3))
      : (Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0);
    
    // Determine if part of a streak (3+ consecutive days with activity)
    const isPartOfStreak = i < 10 && count > 0 && Math.random() > 0.2;
    
    activities.push({
      date: dateStr,
      count,
      streak: isPartOfStreak,
      minutesSpent: count > 0 ? count * 10 + Math.floor(Math.random() * 20) : 0
    });
  }
  
  return activities;
};

const mockActivities = generateMockActivity();

// Mock data for practice items
const mockPracticeItems = [
  {
    id: 1,
    title: "Build a Responsive Navigation Menu",
    description: "Create a fully responsive navigation menu that works on all screen sizes using HTML, CSS, and JavaScript",
    type: "coding",
    difficulty: "medium",
    timeEstimate: 30,
    completionRate: 72,
    language: "JavaScript"
  },
  {
    id: 2,
    title: "JavaScript Arrays and Methods",
    description: "Test your knowledge of JavaScript array methods like map, filter, reduce, and more",
    type: "quiz",
    difficulty: "easy",
    timeEstimate: 15,
    completionRate: 85,
    questionCount: 10
  },
  {
    id: 3,
    title: "Database Schema Design Challenge",
    description: "Design an efficient database schema for an e-commerce platform with specific requirements",
    type: "scenario",
    difficulty: "hard",
    timeEstimate: 45,
    completionRate: 64
  },
  {
    id: 4,
    title: "API Authentication Implementation",
    description: "Implement JWT-based authentication for a REST API using Express.js",
    type: "coding",
    difficulty: "medium",
    timeEstimate: 40,
    completionRate: 68,
    language: "Node.js"
  }
];

// Mock data for course reviews
const mockReviews = [
  {
    id: 1,
    userId: 101,
    username: "Arjun Sharma",
    userAvatar: "",
    courseId: 1,
    rating: 5,
    review: "This course completely transformed my understanding of web development. The instructor explains complex concepts in a clear, concise way. The practical exercises were challenging but incredibly helpful for cementing the knowledge.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    helpfulCount: 24,
    unhelpfulCount: 2,
    isVerifiedPurchase: true,
    completedPercent: 100
  },
  {
    id: 2,
    userId: 102,
    username: "Priya Patel",
    userAvatar: "",
    courseId: 1,
    rating: 4,
    review: "Great content and well-structured curriculum. I would have given 5 stars but I found some of the later sections moved a bit too quickly. Overall, I learned a lot and would recommend to others looking to advance their skills.",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    helpfulCount: 18,
    unhelpfulCount: 3,
    notes: [
      "Pay special attention to the section on authentication - really important concepts!",
      "The state management chapter changed my approach to building applications completely."
    ],
    isVerifiedPurchase: true,
    completedPercent: 85
  },
  {
    id: 3,
    userId: 103,
    username: "Rahul Gupta",
    userAvatar: "",
    courseId: 1,
    rating: 3,
    review: "The course has good information but could use more real-world examples. Some of the code examples were outdated which caused some confusion when trying to implement them with the latest libraries.",
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    helpfulCount: 12,
    unhelpfulCount: 5,
    isVerifiedPurchase: true,
    completedPercent: 70
  }
];

// Mock data for cohort challenges
const mockCohortChallenges = [
  {
    id: 1,
    title: "Full-Stack Portfolio Project",
    description: "Build a complete full-stack portfolio website with authentication, database, and deployment",
    startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: "active",
    participants: [
      { id: 201, name: "Vikram Singh", role: "participant", points: 320, completedTasks: 4 },
      { id: 202, name: "Ananya Desai", role: "participant", points: 290, completedTasks: 3 },
      { id: 203, name: "Ravi Kumar", role: "mentor", points: 0, completedTasks: 0 },
      { id: 204, name: "Neha Sharma", role: "participant", points: 350, completedTasks: 5 }
    ],
    maxParticipants: 10,
    type: "group-project",
    skillLevel: "intermediate",
    totalTasks: 8,
    completedTasks: 3,
    prizesAvailable: true
  },
  {
    id: 2,
    title: "Data Visualization Hackathon",
    description: "Create innovative data visualizations using real-world datasets to reveal insights and tell stories",
    startDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    status: "upcoming",
    participants: [
      { id: 205, name: "Aditya Reddy", role: "participant" },
      { id: 206, name: "Kavita Nair", role: "mentor" }
    ],
    maxParticipants: 15,
    type: "hackathon",
    skillLevel: "beginner",
    totalTasks: 5,
    prizesAvailable: true
  },
  {
    id: 3,
    title: "Mobile App Challenge",
    description: "Develop a mobile app solution for a real-world problem in the education sector",
    startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "completed",
    participants: [
      { id: 207, name: "Rohan Verma", role: "participant", points: 480, completedTasks: 6 },
      { id: 208, name: "Sneha Joshi", role: "participant", points: 520, completedTasks: 7 },
      { id: 209, name: "Kiran Rao", role: "mentor", points: 0, completedTasks: 0 },
      { id: 210, name: "Divya Malhotra", role: "participant", points: 450, completedTasks: 6 }
    ],
    maxParticipants: 12,
    type: "hackathon",
    skillLevel: "advanced",
    totalTasks: 7,
    completedTasks: 7,
    prizesAvailable: true
  }
];

// API Routes for Learning Tracks
router.get("/tracks", async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would fetch from the database
    res.json(mockTracks);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get course tracks", error: error.message });
  }
});

// API Routes for Microlearning Bites
router.get("/microlearning-bites", async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would fetch from the database
    res.json(mockBites);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get microlearning bites", error: error.message });
  }
});

// API Routes for Learning Streak
router.get("/streak", async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would calculate from user activity
    res.json({
      currentStreak: 3,
      longestStreak: 7
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get streak data", error: error.message });
  }
});

// API Routes for Practice Items
router.get("/practice-items", async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would fetch from the database
    res.json(mockPracticeItems);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get practice items", error: error.message });
  }
});

// API Routes for Learning Activity
router.get("/activity", async (req: Request, res: Response) => {
  try {
    const timeframe = req.query.timeframe || "last30";
    
    // Filter activities based on timeframe
    let filteredActivities;
    if (timeframe === "last30") {
      filteredActivities = mockActivities.slice(-30);
    } else {
      filteredActivities = mockActivities;
    }
    
    res.json(filteredActivities);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get activity data", error: error.message });
  }
});

// API Routes for Learning Activity Stats
router.get("/activity-stats", async (req: Request, res: Response) => {
  try {
    const timeframe = req.query.timeframe || "last30";
    
    // Filter activities based on timeframe
    let relevantActivities;
    if (timeframe === "last30") {
      relevantActivities = mockActivities.slice(-30);
    } else {
      relevantActivities = mockActivities;
    }
    
    // Calculate stats
    const totalDays = relevantActivities.filter(a => a.count > 0).length;
    const totalMinutes = relevantActivities.reduce((sum, a) => sum + (a.minutesSpent || 0), 0);
    const averageMinutesPerDay = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    for (let i = relevantActivities.length - 1; i >= 0; i--) {
      if (relevantActivities[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate longest streak (simple version)
    const longestStreak = Math.max(currentStreak, 7); // Mocked for now
    
    res.json({
      currentStreak,
      longestStreak,
      totalDays,
      totalMinutes,
      averageMinutesPerDay
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get activity stats", error: error.message });
  }
});

// API Routes for Course Reviews
router.get("/reviews", async (req: Request, res: Response) => {
  try {
    const sortBy = req.query.sortBy || "most-helpful";
    const filterRating = req.query.filterRating ? parseInt(req.query.filterRating as string) : null;
    
    // Filter reviews based on rating
    let filteredReviews = [...mockReviews];
    if (filterRating) {
      filteredReviews = filteredReviews.filter(review => review.rating === filterRating);
    }
    
    // Sort reviews
    switch (sortBy) {
      case "newest":
        filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "highest":
        filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
      case "most-helpful":
        filteredReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      default:
        // Default to most helpful
        filteredReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }
    
    res.json(filteredReviews);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get course reviews", error: error.message });
  }
});

// API Routes for Cohort Challenges
router.get("/cohort-challenges", async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would fetch from the database
    res.json(mockCohortChallenges);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get cohort challenges", error: error.message });
  }
});

export default router;