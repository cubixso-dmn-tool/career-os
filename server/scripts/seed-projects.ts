import { db } from "../db";
import { projects } from "@shared/schema";

/**
 * Seed script for projects with career tracks
 */
async function main() {
  console.log("Seeding projects...");

  // Frontend Development Projects
  const frontendProjects = [
    {
      title: "Responsive Portfolio Website",
      description: "Build a personal portfolio website that showcases your skills and projects. Implement responsive design principles to ensure it looks great on all devices.",
      difficulty: "Beginner",
      duration: "2-3 weeks",
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      category: "Web Development",
      careerTrack: "frontend",
      thumbnail: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop",
      isPopular: true,
      estimatedHours: 20
    },
    {
      title: "Interactive Quiz App",
      description: "Create a quiz application with multiple categories, timer functionality, and a scoring system. Focus on creating an engaging UI/UX experience.",
      difficulty: "Intermediate",
      duration: "3-4 weeks",
      skills: ["React", "CSS Animations", "State Management", "API Integration"],
      category: "Web Development",
      careerTrack: "frontend",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
      estimatedHours: 35
    },
    {
      title: "E-commerce Product Page",
      description: "Implement a product page with image gallery, product variations, shopping cart functionality, and checkout process.",
      difficulty: "Intermediate",
      duration: "2-3 weeks",
      skills: ["HTML", "CSS", "JavaScript", "State Management"],
      category: "Web Development",
      careerTrack: "frontend",
      thumbnail: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop",
      estimatedHours: 25
    },
    {
      title: "Animation Library",
      description: "Build a reusable animation library with various effects and transitions. Document usage examples and create a showcase page.",
      difficulty: "Advanced",
      duration: "4-6 weeks",
      skills: ["CSS Animations", "JavaScript", "Documentation", "Performance Optimization"],
      category: "Web Development",
      careerTrack: "frontend",
      githubRepo: "https://github.com/example/animation-library",
      estimatedHours: 50
    }
  ];

  // Backend Development Projects
  const backendProjects = [
    {
      title: "RESTful API for Todo App",
      description: "Build a simple but complete RESTful API for a todo application with user authentication, task management, and filtering capabilities.",
      difficulty: "Beginner",
      duration: "2-3 weeks",
      skills: ["Node.js", "Express", "MongoDB", "API Design"],
      category: "Backend Development",
      careerTrack: "backend",
      thumbnail: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=2070&auto=format&fit=crop",
      isPopular: true,
      estimatedHours: 20
    },
    {
      title: "Authentication System",
      description: "Create a robust authentication system with registration, login, password recovery, and social login integration.",
      difficulty: "Intermediate",
      duration: "3-4 weeks",
      skills: ["Node.js", "Express", "JWT", "OAuth", "Security"],
      category: "Backend Development",
      careerTrack: "backend",
      thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop",
      estimatedHours: 30
    },
    {
      title: "Content Management API",
      description: "Develop a content management API with role-based access control, content versioning, and media handling.",
      difficulty: "Advanced",
      duration: "5-6 weeks",
      skills: ["Node.js", "Express", "PostgreSQL", "RBAC", "File Storage"],
      category: "Backend Development",
      careerTrack: "backend",
      githubRepo: "https://github.com/example/cms-api",
      estimatedHours: 60
    }
  ];

  // Full-Stack Development Projects
  const fullstackProjects = [
    {
      title: "Blog Platform",
      description: "Build a complete blog platform with user authentication, post creation/editing, comments, and basic analytics.",
      difficulty: "Beginner",
      duration: "3-4 weeks",
      skills: ["React", "Node.js", "Express", "MongoDB"],
      category: "Full-Stack",
      careerTrack: "fullstack",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop",
      isPopular: true,
      estimatedHours: 35
    },
    {
      title: "Task Management System",
      description: "Create a project management tool with task boards, assignments, deadlines, and team collaboration features.",
      difficulty: "Intermediate",
      duration: "4-6 weeks",
      skills: ["React", "Node.js", "Express", "PostgreSQL", "Socket.io"],
      category: "Full-Stack",
      careerTrack: "fullstack",
      thumbnail: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop",
      estimatedHours: 50
    },
    {
      title: "Real-time Collaborative Editor",
      description: "Build a Google Docs-like collaborative text editor with real-time synchronization and version history.",
      difficulty: "Advanced",
      duration: "6-8 weeks",
      skills: ["React", "Node.js", "WebSockets", "MongoDB", "Operational Transformation"],
      category: "Full-Stack",
      careerTrack: "fullstack",
      githubRepo: "https://github.com/example/collab-editor",
      estimatedHours: 80
    }
  ];

  // Mobile Development Projects
  const mobileProjects = [
    {
      title: "Weather App",
      description: "Create a mobile weather application that shows current conditions, forecasts, and location-based weather alerts.",
      difficulty: "Beginner",
      duration: "2-3 weeks",
      skills: ["React Native", "API Integration", "Location Services", "UI Design"],
      category: "Mobile Development",
      careerTrack: "mobile",
      thumbnail: "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?q=80&w=2075&auto=format&fit=crop",
      isPopular: true,
      estimatedHours: 25
    },
    {
      title: "Fitness Tracker App",
      description: "Build a fitness tracking application with workout logging, progress charts, and social sharing features.",
      difficulty: "Intermediate",
      duration: "4-5 weeks",
      skills: ["React Native", "Local Storage", "Charts", "Health API Integration"],
      category: "Mobile Development",
      careerTrack: "mobile",
      thumbnail: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?q=80&w=2027&auto=format&fit=crop",
      estimatedHours: 45
    },
    {
      title: "E-commerce Mobile App",
      description: "Develop a full-featured e-commerce application with product browsing, cart functionality, and secure checkout.",
      difficulty: "Advanced",
      duration: "6-8 weeks",
      skills: ["React Native", "State Management", "Payment Integration", "Push Notifications"],
      category: "Mobile Development",
      careerTrack: "mobile",
      githubRepo: "https://github.com/example/ecommerce-app",
      estimatedHours: 70
    }
  ];

  // Data Science Projects
  const dataProjects = [
    {
      title: "Data Visualization Dashboard",
      description: "Create an interactive dashboard to visualize and explore a dataset of your choice using modern data visualization libraries.",
      difficulty: "Beginner",
      duration: "2-3 weeks",
      skills: ["Python", "Pandas", "Matplotlib", "Plotly"],
      category: "Data Science",
      careerTrack: "data",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      isPopular: true,
      estimatedHours: 20
    },
    {
      title: "Predictive Analysis Model",
      description: "Build a machine learning model to predict outcomes based on historical data, with feature engineering and model evaluation.",
      difficulty: "Intermediate",
      duration: "3-4 weeks",
      skills: ["Python", "Scikit-learn", "Feature Engineering", "Model Evaluation"],
      category: "Data Science",
      careerTrack: "data",
      thumbnail: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=2074&auto=format&fit=crop",
      estimatedHours: 35
    },
    {
      title: "Recommendation System",
      description: "Develop a recommendation engine using collaborative filtering and content-based approaches for a specific domain.",
      difficulty: "Advanced",
      duration: "5-6 weeks",
      skills: ["Python", "Machine Learning", "Recommendation Algorithms", "Data Processing"],
      category: "Data Science",
      careerTrack: "data",
      githubRepo: "https://github.com/example/recommendation-system",
      estimatedHours: 55
    }
  ];

  // AI Projects
  const aiProjects = [
    {
      title: "Chatbot with NLP",
      description: "Build a simple chatbot using natural language processing to understand and respond to user queries.",
      difficulty: "Beginner",
      duration: "2-3 weeks",
      skills: ["Python", "NLP", "API Integration", "Dialog Management"],
      category: "Artificial Intelligence",
      careerTrack: "ai",
      thumbnail: "https://images.unsplash.com/photo-1677442135910-a319be507ff6?q=80&w=2070&auto=format&fit=crop",
      isPopular: true,
      estimatedHours: 25
    },
    {
      title: "Image Classification System",
      description: "Create a machine learning model to classify images into different categories with training and evaluation components.",
      difficulty: "Intermediate",
      duration: "3-4 weeks",
      skills: ["Python", "TensorFlow/PyTorch", "CNN", "Data Augmentation"],
      category: "Artificial Intelligence",
      careerTrack: "ai",
      thumbnail: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=2070&auto=format&fit=crop",
      estimatedHours: 40
    },
    {
      title: "Generative AI Art Project",
      description: "Develop a system that creates original artwork using generative adversarial networks or other generative AI approaches.",
      difficulty: "Advanced",
      duration: "5-6 weeks",
      skills: ["Python", "GANs", "Deep Learning", "Creative AI"],
      category: "Artificial Intelligence",
      careerTrack: "ai",
      githubRepo: "https://github.com/example/generative-art",
      estimatedHours: 60
    }
  ];

  // DevOps Projects
  const devopsProjects = [
    {
      title: "CI/CD Pipeline Setup",
      description: "Set up a continuous integration and deployment pipeline for a sample application using modern DevOps tools.",
      difficulty: "Beginner",
      duration: "2-3 weeks",
      skills: ["Git", "Jenkins/GitHub Actions", "Docker", "Bash Scripting"],
      category: "DevOps",
      careerTrack: "devops",
      thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop",
      estimatedHours: 20
    },
    {
      title: "Infrastructure as Code Project",
      description: "Create infrastructure as code templates for provisioning a complete application environment.",
      difficulty: "Intermediate",
      duration: "3-4 weeks",
      skills: ["Terraform", "AWS/Azure", "Configuration Management", "Networking"],
      category: "DevOps",
      careerTrack: "devops",
      thumbnail: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop",
      estimatedHours: 35
    },
    {
      title: "Container Orchestration Platform",
      description: "Set up a Kubernetes cluster with monitoring, logging, and automated scaling for a microservices application.",
      difficulty: "Advanced",
      duration: "5-6 weeks",
      skills: ["Kubernetes", "Helm", "Monitoring", "Microservices"],
      category: "DevOps",
      careerTrack: "devops",
      githubRepo: "https://github.com/example/k8s-platform",
      estimatedHours: 60
    }
  ];

  // Security Projects
  const securityProjects = [
    {
      title: "Security Vulnerability Scanner",
      description: "Build a tool that scans web applications for common security vulnerabilities and generates reports.",
      difficulty: "Beginner",
      duration: "2-3 weeks",
      skills: ["Python", "Web Security", "Vulnerability Detection", "Reporting"],
      category: "Security",
      careerTrack: "security",
      thumbnail: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=2069&auto=format&fit=crop",
      estimatedHours: 25
    },
    {
      title: "Authentication System Audit",
      description: "Create a tool to audit authentication systems for security issues, including password policies and implementation flaws.",
      difficulty: "Intermediate",
      duration: "3-4 weeks",
      skills: ["Security Testing", "Authentication", "Audit Methodologies", "Penetration Testing"],
      category: "Security",
      careerTrack: "security",
      thumbnail: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?q=80&w=2074&auto=format&fit=crop",
      estimatedHours: 35
    },
    {
      title: "Secure Coding Practices Framework",
      description: "Develop a framework and guidelines for implementing secure coding practices in modern web applications.",
      difficulty: "Advanced",
      duration: "4-6 weeks",
      skills: ["Secure Coding", "Code Analysis", "OWASP", "Threat Modeling"],
      category: "Security",
      careerTrack: "security",
      githubRepo: "https://github.com/example/secure-coding-framework",
      estimatedHours: 50
    }
  ];

  // Combine all projects
  const allProjects = [
    ...frontendProjects,
    ...backendProjects,
    ...fullstackProjects,
    ...mobileProjects,
    ...dataProjects,
    ...aiProjects,
    ...devopsProjects,
    ...securityProjects
  ];

  // Insert all projects into the database
  try {
    for (const project of allProjects) {
      await db.insert(projects).values({
        ...project,
        createdAt: new Date()
      });
    }
    console.log(`Successfully inserted ${allProjects.length} projects`);
  } catch (error) {
    console.error("Error inserting projects:", error);
  }
}

main()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });