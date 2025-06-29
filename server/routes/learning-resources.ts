import { Router } from "express";
import { z } from "zod";

const router = Router();

// Learning resources data organized by career phase
const learningResourcesData = {
  "programming-fundamentals": {
    phase: "Programming Fundamentals",
    description: "Master core programming concepts and basic development tools",
    courses: [
      {
        id: 1,
        title: "JavaScript Fundamentals Bootcamp",
        provider: "CodeMaster Academy",
        duration: "6 weeks",
        level: "Beginner",
        rating: 4.8,
        students: "24.3K",
        price: "₹1,499",
        nextLesson: "Variables and Data Types",
        roadmapAlignment: "Essential foundation for all web development"
      },
      {
        id: 2,
        title: "Git & GitHub Complete Guide",
        provider: "DevOps Institute",
        duration: "3 weeks",
        level: "Beginner",
        rating: 4.9,
        students: "18.7K",
        price: "₹999",
        nextLesson: "Introduction to Version Control",
        roadmapAlignment: "Critical for collaborative development"
      },
      {
        id: 3,
        title: "Data Structures & Algorithms",
        provider: "Algorithm Academy",
        duration: "8 weeks",
        level: "Intermediate",
        rating: 4.7,
        students: "15.2K",
        price: "₹2,499",
        nextLesson: "Arrays and Linked Lists",
        roadmapAlignment: "Foundation for technical interviews"
      }
    ],
    projects: [
      {
        id: 1,
        title: "Personal Portfolio Website",
        description: "Create a responsive portfolio website showcasing your skills and projects",
        difficulty: "Beginner",
        duration: "1-2 weeks",
        tech: ["HTML", "CSS", "JavaScript"],
        roadmapAlignment: "Demonstrates basic web development skills"
      },
      {
        id: 2,
        title: "To-Do List Application",
        description: "Build a functional to-do list with CRUD operations and local storage",
        difficulty: "Beginner",
        duration: "1 week",
        tech: ["JavaScript", "DOM", "Local Storage"],
        roadmapAlignment: "Practices fundamental programming concepts"
      },
      {
        id: 3,
        title: "Calculator with Advanced Functions",
        description: "Develop a calculator with scientific functions and history tracking",
        difficulty: "Intermediate",
        duration: "2 weeks",
        tech: ["JavaScript", "CSS Grid", "Event Handling"],
        roadmapAlignment: "Complex logic and UI interaction skills"
      }
    ]
  },
  "framework-tools-mastery": {
    phase: "Framework & Tools Mastery",
    description: "Learn frameworks, libraries, and development tools",
    courses: [
      {
        id: 4,
        title: "React Complete Developer Course",
        provider: "Modern Web Academy",
        duration: "10 weeks",
        level: "Intermediate",
        rating: 4.9,
        students: "32.1K",
        price: "₹3,999",
        nextLesson: "JSX and Components",
        roadmapAlignment: "Industry-standard React development"
      },
      {
        id: 5,
        title: "Node.js Backend Development",
        provider: "Backend Masters",
        duration: "8 weeks",
        level: "Intermediate",
        rating: 4.8,
        students: "19.5K",
        price: "₹3,499",
        nextLesson: "Express.js Fundamentals",
        roadmapAlignment: "Full-stack development capabilities"
      },
      {
        id: 6,
        title: "TypeScript for Modern Development",
        provider: "Type Safety Institute",
        duration: "5 weeks",
        level: "Intermediate",
        rating: 4.7,
        students: "12.8K",
        price: "₹2,299",
        nextLesson: "Type Annotations and Interfaces",
        roadmapAlignment: "Industry best practices for large applications"
      }
    ],
    projects: [
      {
        id: 4,
        title: "E-commerce Product Catalog",
        description: "Build a full-featured product catalog with search, filters, and shopping cart",
        difficulty: "Intermediate",
        duration: "3-4 weeks",
        tech: ["React", "Node.js", "MongoDB", "Express"],
        roadmapAlignment: "Demonstrates full-stack development skills"
      },
      {
        id: 5,
        title: "Real-time Weather Dashboard",
        description: "Create a weather dashboard with API integration and location services",
        difficulty: "Intermediate",
        duration: "2 weeks",
        tech: ["React", "Weather API", "Geolocation", "Charts"],
        roadmapAlignment: "API integration and data visualization"
      },
      {
        id: 6,
        title: "Task Management System",
        description: "Develop a collaborative task management system with user authentication",
        difficulty: "Advanced",
        duration: "4-5 weeks",
        tech: ["React", "Node.js", "JWT", "Socket.io"],
        roadmapAlignment: "Authentication and real-time features"
      }
    ]
  },
  "advanced-development": {
    phase: "Advanced Development",
    description: "Dive into advanced concepts and specialization areas",
    courses: [
      {
        id: 7,
        title: "System Design Interview Prep",
        provider: "Tech Interview Pro",
        duration: "8 weeks",
        level: "Advanced",
        rating: 4.9,
        students: "12.5K",
        price: "₹2,999",
        nextLesson: "Designing Netflix Architecture",
        roadmapAlignment: "Essential for senior developer roles"
      },
      {
        id: 8,
        title: "Performance Optimization in React",
        provider: "Advanced React Academy",
        duration: "4 weeks",
        level: "Intermediate",
        rating: 4.8,
        students: "8.2K",
        price: "₹1,999",
        nextLesson: "Introduction to React Profiler",
        roadmapAlignment: "Production-ready application development"
      },
      {
        id: 9,
        title: "Microservices Architecture",
        provider: "Cloud Native Institute",
        duration: "6 weeks",
        level: "Advanced",
        rating: 4.7,
        students: "5.8K",
        price: "₹3,499",
        nextLesson: "Service Discovery Patterns",
        roadmapAlignment: "Scalable system architecture"
      }
    ],
    projects: [
      {
        id: 7,
        title: "Build a Scalable Chat Application",
        description: "Create a real-time chat app using WebSockets, Redis, and microservices architecture",
        difficulty: "Advanced",
        duration: "3-4 weeks",
        tech: ["Node.js", "Redis", "WebSockets", "Docker"],
        roadmapAlignment: "Real-time systems and scalability"
      },
      {
        id: 8,
        title: "Performance Monitoring Dashboard",
        description: "Build a comprehensive dashboard to monitor application performance metrics",
        difficulty: "Intermediate",
        duration: "2-3 weeks",
        tech: ["React", "D3.js", "Monitoring APIs"],
        roadmapAlignment: "Performance optimization and monitoring"
      },
      {
        id: 9,
        title: "Distributed File Storage System",
        description: "Implement a distributed file storage system with replication and fault tolerance",
        difficulty: "Expert",
        duration: "4-6 weeks",
        tech: ["Go", "gRPC", "Distributed Systems"],
        roadmapAlignment: "Advanced system design concepts"
      }
    ]
  },
  "professional-readiness": {
    phase: "Professional Readiness",
    description: "Prepare for the job market and career advancement",
    courses: [
      {
        id: 10,
        title: "Technical Interview Mastery",
        provider: "Interview Success Academy",
        duration: "6 weeks",
        level: "Intermediate",
        rating: 4.9,
        students: "28.4K",
        price: "₹2,799",
        nextLesson: "Behavioral Interview Strategies",
        roadmapAlignment: "Job interview preparation"
      },
      {
        id: 11,
        title: "Software Engineering Leadership",
        provider: "Tech Leadership Institute",
        duration: "8 weeks",
        level: "Advanced",
        rating: 4.8,
        students: "7.3K",
        price: "₹4,999",
        nextLesson: "Leading Technical Teams",
        roadmapAlignment: "Career advancement and leadership"
      },
      {
        id: 12,
        title: "Open Source Contribution Guide",
        provider: "Community Code Academy",
        duration: "4 weeks",
        level: "Intermediate",
        rating: 4.7,
        students: "11.2K",
        price: "₹1,799",
        nextLesson: "Finding Your First Project",
        roadmapAlignment: "Professional network and portfolio building"
      }
    ],
    projects: [
      {
        id: 10,
        title: "Comprehensive Developer Portfolio",
        description: "Create a professional portfolio showcasing your best work with detailed case studies",
        difficulty: "Intermediate",
        duration: "2-3 weeks",
        tech: ["React", "Next.js", "Portfolio Design"],
        roadmapAlignment: "Professional presentation of skills"
      },
      {
        id: 11,
        title: "Open Source Library Contribution",
        description: "Contribute meaningful features or fixes to popular open source projects",
        difficulty: "Advanced",
        duration: "4-6 weeks",
        tech: ["Git", "Open Source", "Community Collaboration"],
        roadmapAlignment: "Professional development and networking"
      },
      {
        id: 12,
        title: "Technical Blog and Documentation",
        description: "Write technical articles and comprehensive documentation for your projects",
        difficulty: "Intermediate",
        duration: "3-4 weeks",
        tech: ["Technical Writing", "Documentation", "SEO"],
        roadmapAlignment: "Communication and thought leadership"
      }
    ]
  }
};

// Career-specific learning paths
const careerLearningPaths = {
  "Software Developer": ["programming-fundamentals", "framework-tools-mastery", "advanced-development", "professional-readiness"],
  "Frontend Developer": ["programming-fundamentals", "framework-tools-mastery", "advanced-development", "professional-readiness"],
  "Full Stack Developer": ["programming-fundamentals", "framework-tools-mastery", "advanced-development", "professional-readiness"],
  "Data Analyst": ["programming-fundamentals", "framework-tools-mastery", "advanced-development", "professional-readiness"],
  "UX/UI Designer": ["programming-fundamentals", "framework-tools-mastery", "advanced-development", "professional-readiness"],
  "Product Manager": ["programming-fundamentals", "framework-tools-mastery", "advanced-development", "professional-readiness"]
};

/**
 * Get complete learning path for a career
 * GET /api/learning-resources/:career/complete-path
 */
router.get("/:career/complete-path", (req, res) => {
  try {
    const { career } = req.params;
    
    // Define the learning phases for the career
    const phases = [
      {
        phaseKey: "programming-fundamentals",
        phase: "Programming Fundamentals",
        description: "Master core programming concepts and basic development tools",
        coursesCount: 3,
        projectsCount: 3
      },
      {
        phaseKey: "framework-tools-mastery", 
        phase: "Framework & Tools Mastery",
        description: "Learn frameworks, libraries, and development tools",
        coursesCount: 3,
        projectsCount: 3
      },
      {
        phaseKey: "advanced-development",
        phase: "Advanced Development", 
        description: "Dive into advanced concepts and specialization areas",
        coursesCount: 3,
        projectsCount: 3
      },
      {
        phaseKey: "professional-readiness",
        phase: "Professional Readiness",
        description: "Prepare for the job market and career advancement", 
        coursesCount: 3,
        projectsCount: 3
      }
    ];

    // Calculate totals
    const totalCourses = phases.reduce((sum, phase) => sum + phase.coursesCount, 0);
    const totalProjects = phases.reduce((sum, phase) => sum + phase.projectsCount, 0);

    res.json({
      success: true,
      data: {
        career,
        phases,
        totalCourses,
        totalProjects
      }
    });
  } catch (error: any) {
    console.error("Error fetching complete learning path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complete learning path",
      error: error.message
    });
  }
});

/**
 * Get learning resources for a specific career and phase
 * GET /api/learning-resources/:career/:phase
 */
router.get("/:career/:phase", (req, res) => {
  try {
    const { career, phase } = req.params;
    
    const phaseKey = phase.toLowerCase().replace(/\s+/g, '-');
    const resources = learningResourcesData[phaseKey as keyof typeof learningResourcesData];
    
    if (!resources) {
      return res.status(404).json({
        success: false,
        message: "Learning resources not found for this phase"
      });
    }

    res.json({
      success: true,
      data: {
        career,
        phase: resources.phase,
        description: resources.description,
        courses: resources.courses,
        projects: resources.projects
      }
    });
  } catch (error: any) {
    console.error("Error fetching learning resources:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning resources",
      error: error.message
    });
  }
});

/**
 * Get complete learning path for a career
 * GET /api/learning-resources/:career/complete-path
 */
router.get("/:career/complete-path", (req, res) => {
  try {
    const { career } = req.params;
    
    const learningPath = careerLearningPaths[career as keyof typeof careerLearningPaths] || 
                        careerLearningPaths["Software Developer"];
    
    const completePath = learningPath.map(phaseKey => {
      const resources = learningResourcesData[phaseKey as keyof typeof learningResourcesData];
      return {
        phaseKey,
        phase: resources.phase,
        description: resources.description,
        coursesCount: resources.courses.length,
        projectsCount: resources.projects.length,
        courses: resources.courses.slice(0, 2), // Preview only
        projects: resources.projects.slice(0, 2) // Preview only
      };
    });

    res.json({
      success: true,
      data: {
        career,
        phases: completePath,
        totalCourses: learningPath.reduce((acc, phaseKey) => 
          acc + learningResourcesData[phaseKey as keyof typeof learningResourcesData].courses.length, 0),
        totalProjects: learningPath.reduce((acc, phaseKey) => 
          acc + learningResourcesData[phaseKey as keyof typeof learningResourcesData].projects.length, 0)
      }
    });
  } catch (error: any) {
    console.error("Error fetching complete learning path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complete learning path",
      error: error.message
    });
  }
});

/**
 * Get current phase resources based on user progress
 * GET /api/learning-resources/current/:career
 */
router.get("/current/:career", (req, res) => {
  try {
    const { career } = req.params;
    
    // For now, assume user is in "advanced-development" phase
    // In real implementation, this would check user's actual progress
    const currentPhase = "advanced-development";
    
    const resources = learningResourcesData[currentPhase as keyof typeof learningResourcesData];
    
    if (!resources) {
      return res.status(404).json({
        success: false,
        message: "Current phase resources not found"
      });
    }

    // Add status to courses and projects based on user progress
    const coursesWithStatus = resources.courses.map(course => ({
      ...course,
      progress: Math.floor(Math.random() * 100), // Mock progress
      status: Math.random() > 0.5 ? 'in_progress' : 'recommended'
    }));

    const projectsWithStatus = resources.projects.map(project => ({
      ...project,
      progress: Math.floor(Math.random() * 100), // Mock progress
      status: Math.random() > 0.7 ? 'in_progress' : Math.random() > 0.4 ? 'recommended' : 'upcoming'
    }));

    res.json({
      success: true,
      data: {
        career,
        currentPhase: resources.phase,
        description: resources.description,
        courses: coursesWithStatus,
        projects: projectsWithStatus,
        progressOverall: 65 // Mock overall progress
      }
    });
  } catch (error: any) {
    console.error("Error fetching current phase resources:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch current phase resources",
      error: error.message
    });
  }
});

/**
 * Get featured/trending courses across all phases
 * GET /api/learning-resources/featured/courses
 */
router.get("/featured/courses", (req, res) => {
  try {
    const allCourses = Object.values(learningResourcesData)
      .flatMap(phase => phase.courses)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);

    res.json({
      success: true,
      data: allCourses
    });
  } catch (error: any) {
    console.error("Error fetching featured courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured courses",
      error: error.message
    });
  }
});

/**
 * Get featured/trending projects across all phases
 * GET /api/learning-resources/featured/projects
 */
router.get("/featured/projects", (req, res) => {
  try {
    const allProjects = Object.values(learningResourcesData)
      .flatMap(phase => phase.projects)
      .slice(0, 6);

    res.json({
      success: true,
      data: allProjects
    });
  } catch (error: any) {
    console.error("Error fetching featured projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured projects",
      error: error.message
    });
  }
});



export default router;