import { storage } from "../storage";

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Seed courses with real Indian tech education content
    const courses = [
      {
        title: "Full Stack Web Development with MERN",
        description: "Master MongoDB, Express.js, React, and Node.js to build complete web applications. Learn industry-standard practices used by top Indian startups.",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
        price: 2999,
        isFree: false,
        rating: 4,
        enrolledCount: 1247,
        category: "Web Development",
        tags: ["JavaScript", "React", "Node.js", "MongoDB", "Full Stack"],
        isFeatured: true
      },
      {
        title: "Python for Data Science & Machine Learning",
        description: "Complete Python course covering NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow. Build real ML projects used in Indian tech companies.",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
        price: 3499,
        isFree: false,
        rating: 5,
        enrolledCount: 892,
        category: "Data Science",
        tags: ["Python", "Machine Learning", "Data Analysis", "TensorFlow"],
        isFeatured: true
      },
      {
        title: "Android App Development with Kotlin",
        description: "Learn Android development using Kotlin. Build real apps for Indian market including payment integration with Razorpay and UPI.",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
        price: 2799,
        isFree: false,
        rating: 4,
        enrolledCount: 634,
        category: "Mobile Development",
        tags: ["Android", "Kotlin", "Mobile Apps", "Firebase"],
        isFeatured: false
      },
      {
        title: "DevOps Engineering with AWS",
        description: "Master DevOps practices with AWS, Docker, Kubernetes, and CI/CD pipelines. Learn cloud deployment strategies for Indian businesses.",
        thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400",
        price: 4299,
        isFree: false,
        rating: 5,
        enrolledCount: 423,
        category: "DevOps",
        tags: ["AWS", "Docker", "Kubernetes", "DevOps", "Cloud"],
        isFeatured: true
      },
      {
        title: "Digital Marketing & Growth Hacking",
        description: "Learn digital marketing strategies that work in Indian market. SEO, social media marketing, and growth hacking techniques.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
        price: 1999,
        isFree: false,
        rating: 4,
        enrolledCount: 1156,
        category: "Marketing",
        tags: ["Digital Marketing", "SEO", "Social Media", "Growth"],
        isFeatured: false
      },
      {
        title: "Introduction to Programming",
        description: "Free introductory course to programming concepts using Python. Perfect for absolute beginners starting their tech journey.",
        thumbnail: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400",
        price: 0,
        isFree: true,
        rating: 4,
        enrolledCount: 3247,
        category: "Programming Basics",
        tags: ["Python", "Programming", "Beginner", "Fundamentals"],
        isFeatured: false
      }
    ];

    console.log("Seeding courses...");
    for (const course of courses) {
      await storage.createCourse(course);
    }

    // Seed projects with real-world applications
    const projects = [
      {
        title: "E-commerce Platform for Indian SMEs",
        description: "Build a complete e-commerce platform with features like product catalog, cart, payment integration with Razorpay, and order management.",
        difficulty: "Intermediate",
        duration: "4-6 weeks",
        skills: ["React", "Node.js", "MongoDB", "Payment Integration"],
        category: "Web Development"
      },
      {
        title: "Stock Market Analysis Dashboard",
        description: "Create a real-time dashboard for Indian stock market analysis using NSE/BSE APIs. Include data visualization and trend prediction.",
        difficulty: "Advanced",
        duration: "3-4 weeks",
        skills: ["Python", "Data Analysis", "APIs", "Visualization"],
        category: "Data Science"
      },
      {
        title: "Food Delivery App Clone",
        description: "Build a mobile app similar to Zomato/Swiggy with restaurant listings, ordering, and delivery tracking features.",
        difficulty: "Intermediate",
        duration: "5-7 weeks",
        skills: ["React Native", "Firebase", "Maps API", "Real-time Updates"],
        category: "Mobile Development"
      },
      {
        title: "Personal Finance Tracker",
        description: "Create a web application to track expenses, set budgets, and analyze spending patterns. Include Indian banking integration.",
        difficulty: "Beginner",
        duration: "2-3 weeks",
        skills: ["JavaScript", "Chart.js", "Local Storage", "Forms"],
        category: "Web Development"
      },
      {
        title: "AI Chatbot for Customer Support",
        description: "Build an intelligent chatbot using NLP that can handle customer queries in both English and Hindi languages.",
        difficulty: "Advanced",
        duration: "4-5 weeks",
        skills: ["Python", "NLP", "Machine Learning", "API Integration"],
        category: "Artificial Intelligence"
      }
    ];

    console.log("Seeding projects...");
    for (const project of projects) {
      await storage.createProject(project);
    }

    // Seed soft skills
    const softSkills = [
      {
        title: "Effective Communication",
        description: "Master the art of clear and confident communication in professional settings, presentations, and team collaborations.",
        type: "Communication",
        content: "Learn verbal and non-verbal communication techniques, active listening, and presentation skills essential for career growth."
      },
      {
        title: "Leadership & Team Management",
        description: "Develop leadership qualities and learn how to effectively manage and motivate teams in diverse work environments.",
        type: "Leadership",
        content: "Understand different leadership styles, conflict resolution, delegation, and team building strategies."
      },
      {
        title: "Problem Solving & Critical Thinking",
        description: "Enhance your analytical skills and learn structured approaches to solve complex problems in work and life.",
        type: "Analytical",
        content: "Learn problem-solving frameworks, root cause analysis, and decision-making techniques used by successful professionals."
      },
      {
        title: "Time Management & Productivity",
        description: "Master time management techniques and productivity systems to achieve more while maintaining work-life balance.",
        type: "Productivity",
        content: "Learn prioritization methods, goal setting, and productivity tools to maximize your efficiency and effectiveness."
      }
    ];

    console.log("Seeding soft skills...");
    for (const softSkill of softSkills) {
      await storage.createSoftSkill(softSkill);
    }

    // Seed achievements
    const achievements = [
      {
        title: "First Steps",
        description: "Completed your career assessment quiz",
        icon: "🎯",
        category: "Career"
      },
      {
        title: "Course Completion",
        description: "Successfully completed your first course",
        icon: "📚",
        category: "Learning"
      },
      {
        title: "Project Builder",
        description: "Built and submitted your first project",
        icon: "🔨",
        category: "Projects"
      },
      {
        title: "Community Contributor",
        description: "Made your first post in the community",
        icon: "👥",
        category: "Community"
      },
      {
        title: "Streak Master",
        description: "Maintained a 7-day learning streak",
        icon: "🔥",
        category: "Consistency"
      }
    ];

    console.log("Seeding achievements...");
    for (const achievement of achievements) {
      await storage.createAchievement(achievement);
    }

    // Seed events
    const events = [
      {
        title: "Tech Career Fair 2024",
        description: "Virtual career fair featuring top Indian startups and MNCs. Network with recruiters and explore opportunities.",
        type: "Career Fair",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        duration: 480, // 8 hours in minutes
        isRegistrationRequired: true
      },
      {
        title: "AI/ML Workshop by IIT Alumni",
        description: "Hands-on workshop on Machine Learning applications in Indian industry. Led by IIT graduates working at FAANG companies.",
        type: "Workshop",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 180, // 3 hours
        isRegistrationRequired: true
      },
      {
        title: "Startup Pitch Competition",
        description: "Pitch your startup ideas to successful entrepreneurs and VCs. Winners get funding opportunities and mentorship.",
        type: "Competition",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        duration: 360, // 6 hours
        isRegistrationRequired: true
      }
    ];

    console.log("Seeding events...");
    for (const event of events) {
      await storage.createEvent(event);
    }

    // Seed daily bytes for the current week
    const dailyBytes = [
      {
        title: "JavaScript Tip: Array Methods",
        content: "Did you know? The Array.reduce() method is one of the most powerful array methods in JavaScript. It can be used for summing, filtering, and even flattening arrays!",
        type: "tip",
        category: "JavaScript",
        forDate: new Date(),
        active: true
      },
      {
        title: "Quick Quiz: React Concepts",
        content: "What is the difference between state and props in React?",
        type: "quiz",
        category: "React",
        forDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        active: true
      },
      {
        title: "Industry Insight: Remote Work",
        content: "85% of Indian tech companies now offer hybrid or fully remote work options. Remote work skills are becoming essential for career growth.",
        type: "insight",
        category: "Career",
        forDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        active: true
      }
    ];

    console.log("Seeding daily bytes...");
    for (const dailyByte of dailyBytes) {
      await storage.createDailyByte(dailyByte);
    }

    // Create some sample posts for community
    const sampleUser = await storage.getUser(1);
    if (sampleUser) {
      const posts = [
        {
          userId: sampleUser.id,
          content: "Just completed my first React project! Building a todo app taught me so much about state management and component lifecycle. What was your first React project? 🚀"
        },
        {
          userId: sampleUser.id,
          content: "Looking for advice: Should I focus on frontend or backend development as a beginner? I enjoy both but want to specialize. What factors should I consider?"
        }
      ];

      console.log("Seeding community posts...");
      for (const post of posts) {
        await storage.createPost(post);
      }
    }

    console.log("Database seeding completed successfully! ✅");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };