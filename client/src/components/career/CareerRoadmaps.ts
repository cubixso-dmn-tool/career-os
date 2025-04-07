// Types for roadmap data
export interface RoadmapData {
  title: string;
  description: string;
  overview: {
    intro: string;
    successStories: string[];
  };
  dayInLife: string[];
  skills: {
    technical: string[];
    soft: string[];
  };
  courses: {
    name: string;
    level: string;
    link: string;
  }[];
  projects: {
    name: string;
    level: string;
    skills: string[];
  }[];
  networking: {
    communities: string[];
    tips: string[];
  };
}

// Career roadmap data
const careerRoadmaps: Record<string, RoadmapData> = {
  // 🔧 Software Development & Engineering
  "full-stack-developer": {
    title: "Full Stack Developer",
    description: "Design and develop both front-end and back-end components of web applications",
    overview: {
      intro: "Full Stack Developers are versatile tech professionals who can work on all aspects of application development. In India's rapidly growing tech industry, full stack developers are highly sought after for their ability to handle end-to-end development.",
      successStories: [
        "Arjun Reddy transitioned from a backend role to full stack and now works remotely for a US-based company at 3x his previous salary.",
        "Many Indian full stack developers have successfully launched their own startups or work as high-earning freelancers serving global clients."
      ]
    },
    dayInLife: [
      "Develop user-facing features using front-end technologies (HTML, CSS, JavaScript)",
      "Build server-side applications using backend technologies (Node.js, Python, etc.)",
      "Design and manage databases (SQL/NoSQL)",
      "Troubleshoot and debug across the entire stack",
      "Collaborate with designers, product managers, and other developers"
    ],
    skills: {
      technical: ["JavaScript/TypeScript", "React/Angular/Vue", "Node.js/Django/Flask", "SQL/NoSQL Databases", "REST/GraphQL APIs", "Git", "DevOps basics"],
      soft: ["Problem-solving", "Time management", "Communication", "Adaptability", "Continuous learning"]
    },
    courses: [
      {
        name: "MERN Stack Bootcamp",
        level: "Beginner to Intermediate",
        link: "/courses?category=web-development"
      },
      {
        name: "Full Stack Development with JavaScript",
        level: "Intermediate",
        link: "/courses?category=web-development"
      },
      {
        name: "Advanced Web Applications Architecture",
        level: "Advanced",
        link: "/courses?category=web-development"
      }
    ],
    projects: [
      {
        name: "Personal Portfolio Website",
        level: "Beginner",
        skills: ["HTML/CSS", "JavaScript", "Responsive Design"]
      },
      {
        name: "E-commerce Platform",
        level: "Intermediate",
        skills: ["React/Angular", "Node.js/Django", "MongoDB/PostgreSQL"]
      },
      {
        name: "Social Media Application",
        level: "Advanced",
        skills: ["Full Stack Development", "Real-time Features", "Cloud Deployment"]
      }
    ],
    networking: {
      communities: [
        "Full Stack Developers India",
        "Stack Overflow",
        "GitHub",
        "Dev.to"
      ],
      tips: [
        "Create a portfolio showcasing full-stack projects",
        "Contribute to open-source projects",
        "Attend hackathons and coding competitions",
        "Join developer meetups both online and offline"
      ]
    }
  },

  "mobile-app-developer": {
    title: "Mobile App Developer",
    description: "Create applications for iOS and Android mobile devices",
    overview: {
      intro: "With India having over 500 million smartphone users, mobile app development has become one of the most in-demand tech skills. Mobile developers create applications that millions use daily, from banking to entertainment.",
      successStories: [
        "Neha Gupta started learning mobile development during college and now has a popular fitness app with over 1 million downloads.",
        "Many Indian developers have found success with apps on the Play Store and App Store, generating substantial passive income."
      ]
    },
    dayInLife: [
      "Write clean, maintainable code for mobile applications",
      "Test applications on different devices and screen sizes",
      "Fix bugs and optimize application performance",
      "Collaborate with UI/UX designers and backend developers",
      "Keep up with platform updates and new mobile technologies"
    ],
    skills: {
      technical: ["Java/Kotlin (Android)", "Swift (iOS)", "React Native/Flutter", "RESTful APIs", "SQLite", "Git", "CI/CD for mobile"],
      soft: ["Attention to detail", "User empathy", "Problem-solving", "Time management", "Communication"]
    },
    courses: [
      {
        name: "Android Development for Beginners",
        level: "Beginner",
        link: "/courses?category=mobile-development"
      },
      {
        name: "iOS App Development with Swift",
        level: "Intermediate",
        link: "/courses?category=mobile-development"
      },
      {
        name: "Cross-Platform Development with Flutter",
        level: "Intermediate",
        link: "/courses?category=mobile-development"
      }
    ],
    projects: [
      {
        name: "Weather App",
        level: "Beginner",
        skills: ["API Integration", "UI Design", "Local Storage"]
      },
      {
        name: "Food Delivery App Clone",
        level: "Intermediate",
        skills: ["Maps Integration", "Payment Gateway", "User Authentication"]
      },
      {
        name: "Social Networking App",
        level: "Advanced",
        skills: ["Real-time Data", "Media Handling", "Push Notifications"]
      }
    ],
    networking: {
      communities: [
        "Flutter India",
        "Android Developers India",
        "iOS Developers",
        "Stack Overflow"
      ],
      tips: [
        "Publish your apps on Google Play Store and App Store",
        "Create a portfolio with screenshots and videos of your apps",
        "Participate in app development hackathons",
        "Join mobile developer forums and Telegram/Discord groups"
      ]
    }
  },

  "devops-engineer": {
    title: "DevOps Engineer",
    description: "Bridge development and operations to improve deployment speed and reliability",
    overview: {
      intro: "DevOps Engineers are critical in modern software development, automating and streamlining the development pipeline. In India's growing tech ecosystem, DevOps skills command premium salaries as companies recognize their value in improving efficiency.",
      successStories: [
        "Rajesh Kumar pivoted from system administration to DevOps and now works for a major fintech company, doubling his previous salary.",
        "Several Indian DevOps professionals have become highly sought-after consultants, helping companies improve their deployment processes."
      ]
    },
    dayInLife: [
      "Implement CI/CD pipelines for automated testing and deployment",
      "Manage cloud infrastructure using Infrastructure as Code",
      "Monitor system performance and troubleshoot issues",
      "Optimize system resources and costs",
      "Collaborate with development and operations teams"
    ],
    skills: {
      technical: ["Linux/Unix", "Docker/Kubernetes", "AWS/Azure/GCP", "CI/CD Tools (Jenkins, GitHub Actions)", "Infrastructure as Code (Terraform)", "Scripting (Bash, Python)", "Monitoring Tools"],
      soft: ["Problem-solving", "Communication", "Collaboration", "Systems thinking", "Continuous improvement mindset"]
    },
    courses: [
      {
        name: "DevOps Fundamentals",
        level: "Beginner",
        link: "/courses?category=devops"
      },
      {
        name: "Cloud Infrastructure and DevOps",
        level: "Intermediate",
        link: "/courses?category=devops"
      },
      {
        name: "Advanced Kubernetes for Production",
        level: "Advanced",
        link: "/courses?category=devops"
      }
    ],
    projects: [
      {
        name: "Automated Deployment Pipeline",
        level: "Beginner",
        skills: ["CI/CD", "Git", "Basic Scripting"]
      },
      {
        name: "Containerized Microservices Deployment",
        level: "Intermediate",
        skills: ["Docker", "Kubernetes", "Cloud Services"]
      },
      {
        name: "Infrastructure as Code Implementation",
        level: "Advanced",
        skills: ["Terraform", "Ansible", "Cloud Architecture"]
      }
    ],
    networking: {
      communities: [
        "DevOps India",
        "Kubernetes India Community",
        "AWS User Group India",
        "GitHub"
      ],
      tips: [
        "Get certified in cloud platforms (AWS, Azure, GCP)",
        "Create GitHub repositories demonstrating automation solutions",
        "Write technical blogs about DevOps best practices",
        "Attend tech conferences and DevOps Days events"
      ]
    }
  },

  "blockchain-developer": {
    title: "Blockchain Developer",
    description: "Create decentralized applications and smart contracts on blockchain platforms",
    overview: {
      intro: "Blockchain technology is revolutionizing industries beyond cryptocurrency. In India, blockchain skills are increasingly in demand, especially in finance, supply chain, and healthcare sectors. It's an emerging field with high growth potential.",
      successStories: [
        "Vikram Singh self-taught blockchain development and now leads the blockchain division at a major Indian crypto exchange.",
        "Several Indian blockchain developers have launched successful Web3 startups and raised significant funding."
      ]
    },
    dayInLife: [
      "Develop and test smart contracts",
      "Build decentralized applications (dApps)",
      "Implement security measures for blockchain applications",
      "Work with blockchain protocols and frameworks",
      "Research and stay updated on blockchain technology advancements"
    ],
    skills: {
      technical: ["Solidity", "Web3.js/ethers.js", "Blockchain Fundamentals", "JavaScript/TypeScript", "Smart Contract Security", "Truffle/Hardhat", "IPFS"],
      soft: ["Analytical thinking", "Innovation", "Security mindset", "Communication", "Research skills"]
    },
    courses: [
      {
        name: "Blockchain Fundamentals",
        level: "Beginner",
        link: "/courses?category=blockchain"
      },
      {
        name: "Ethereum and Smart Contract Development",
        level: "Intermediate",
        link: "/courses?category=blockchain"
      },
      {
        name: "Advanced dApp Architecture",
        level: "Advanced",
        link: "/courses?category=blockchain"
      }
    ],
    projects: [
      {
        name: "Simple Token Contract",
        level: "Beginner",
        skills: ["Solidity", "Web3.js", "Basic Frontend"]
      },
      {
        name: "Decentralized Marketplace",
        level: "Intermediate",
        skills: ["Smart Contracts", "IPFS", "React"]
      },
      {
        name: "DeFi Application",
        level: "Advanced",
        skills: ["Complex Smart Contracts", "Security Auditing", "Web3 Integration"]
      }
    ],
    networking: {
      communities: [
        "Blockchain Developers India",
        "Ethereum India",
        "Web3 India Community",
        "Discord communities for various blockchain platforms"
      ],
      tips: [
        "Create a GitHub portfolio with blockchain projects",
        "Participate in hackathons like ETHIndia",
        "Contribute to open-source blockchain projects",
        "Join Web3 conferences and meetups"
      ]
    }
  },

  "game-developer": {
    title: "Game Developer",
    description: "Design and program interactive games for various platforms",
    overview: {
      intro: "Game development is growing rapidly in India, with the country now having over 400 gaming companies. From mobile casual games to complex console titles, there are diverse opportunities for game developers with creative and technical skills.",
      successStories: [
        "Anand Prakash started by creating simple mobile games and now runs a successful game studio with titles having millions of downloads.",
        "Several Indian indie game developers have published successful games on Steam and mobile app stores."
      ]
    },
    dayInLife: [
      "Write game logic and mechanics using languages like C# or C++",
      "Implement game physics, AI, and other systems",
      "Collaborate with artists, designers, and sound engineers",
      "Test, debug, and optimize game performance",
      "Iterate based on player feedback and analytics"
    ],
    skills: {
      technical: ["C#/C++/JavaScript", "Unity/Unreal Engine", "3D Mathematics", "Game Physics", "Mobile/Console/PC Development", "Animation Integration", "Performance Optimization"],
      soft: ["Creativity", "Problem-solving", "Collaboration", "Time management", "Player empathy"]
    },
    courses: [
      {
        name: "Introduction to Game Development with Unity",
        level: "Beginner",
        link: "/courses?category=game-development"
      },
      {
        name: "C# Programming for Unity Game Development",
        level: "Intermediate",
        link: "/courses?category=game-development"
      },
      {
        name: "Advanced Game Development with Unreal Engine",
        level: "Advanced",
        link: "/courses?category=game-development"
      }
    ],
    projects: [
      {
        name: "2D Arcade Game",
        level: "Beginner",
        skills: ["Unity/Godot", "Basic Scripting", "Game Design"]
      },
      {
        name: "Mobile Puzzle Game",
        level: "Intermediate",
        skills: ["Mobile Development", "UI/UX", "Monetization"]
      },
      {
        name: "3D Action Game",
        level: "Advanced",
        skills: ["3D Modeling", "Advanced AI", "Performance Optimization"]
      }
    ],
    networking: {
      communities: [
        "Game Developers India",
        "IGDA (International Game Developers Association) India",
        "Unity/Unreal Engine communities",
        "itch.io and GameJolt"
      ],
      tips: [
        "Build a portfolio with playable game demos",
        "Participate in game jams like Global Game Jam",
        "Publish small games to build credibility",
        "Network with other developers and artists at gaming events"
      ]
    }
  },

  // 📊 Data & AI
  "data-analyst": {
    title: "Data Analyst",
    description: "Collect, process, and analyze data to help organizations make informed decisions",
    overview: {
      intro: "Data Analysts turn raw data into actionable insights that drive business decisions. In India's data-driven business landscape, analysts are essential across industries like e-commerce, finance, healthcare, and more.",
      successStories: [
        "Kavita Patel started as a junior analyst at a retail company and now leads the analytics team at a major e-commerce platform.",
        "Many finance and business graduates have successfully transitioned to data analyst roles, significantly increasing their earning potential."
      ]
    },
    dayInLife: [
      "Collect and clean data from various sources",
      "Perform statistical analysis to identify patterns and trends",
      "Create visualizations and dashboards",
      "Present findings and recommendations to stakeholders",
      "Collaborate with teams to implement data-driven strategies"
    ],
    skills: {
      technical: ["SQL", "Excel/Google Sheets", "Python/R", "Data Visualization Tools (Tableau, Power BI)", "Statistical Analysis", "Data Cleaning", "Business Intelligence"],
      soft: ["Analytical thinking", "Attention to detail", "Communication", "Problem-solving", "Business acumen"]
    },
    courses: [
      {
        name: "Data Analysis Fundamentals",
        level: "Beginner",
        link: "/courses?category=data-analysis"
      },
      {
        name: "SQL for Data Analysis",
        level: "Intermediate",
        link: "/courses?category=data-analysis"
      },
      {
        name: "Advanced Data Visualization",
        level: "Advanced",
        link: "/courses?category=data-analysis"
      }
    ],
    projects: [
      {
        name: "Sales Data Analysis",
        level: "Beginner",
        skills: ["Excel", "Basic Visualizations", "Data Cleaning"]
      },
      {
        name: "Customer Segmentation Project",
        level: "Intermediate",
        skills: ["Python/R", "Statistical Analysis", "Data Visualization"]
      },
      {
        name: "Interactive Business Dashboard",
        level: "Advanced",
        skills: ["Tableau/Power BI", "SQL", "Business Metrics"]
      }
    ],
    networking: {
      communities: [
        "Analytics Vidhya",
        "Data Science India Community",
        "Tableau User Groups",
        "LinkedIn Data Groups"
      ],
      tips: [
        "Create a portfolio showcasing your analysis projects",
        "Get certified in tools like SQL, Tableau, or Power BI",
        "Practice with public datasets on Kaggle",
        "Attend data-focused webinars and workshops"
      ]
    }
  },

  "data-scientist": {
    title: "Data Scientist",
    description: "Apply advanced analytics and machine learning to solve complex business problems",
    overview: {
      intro: "Data Science combines statistics, programming, and domain expertise to extract meaningful insights from data. With India's digital transformation and growing tech sector, Data Scientists are in high demand across industries.",
      successStories: [
        "Priya Sharma, IIT graduate, now leads the AI team at Flipkart after starting as a junior data analyst.",
        "Over 40% of Indian startups are now incorporating data science into their business models."
      ]
    },
    dayInLife: [
      "Analyze datasets using Python, R, or SQL",
      "Build and optimize machine learning models",
      "Present insights to non-technical stakeholders",
      "Collaborate with engineers to implement solutions",
      "Stay updated with the latest research and techniques"
    ],
    skills: {
      technical: ["Python", "R", "SQL", "Statistics", "Machine Learning", "Data Visualization", "Big Data Tools"],
      soft: ["Problem-solving", "Communication", "Business Acumen", "Critical Thinking", "Teamwork"]
    },
    courses: [
      {
        name: "Data Science Specialization by IIT Madras",
        level: "Beginner",
        link: "/courses?category=data-science"
      },
      {
        name: "Machine Learning by Andrew Ng",
        level: "Intermediate",
        link: "/courses?category=data-science"
      },
      {
        name: "Deep Learning Specialization",
        level: "Advanced",
        link: "/courses?category=data-science"
      }
    ],
    projects: [
      {
        name: "Customer Segmentation Analysis",
        level: "Beginner",
        skills: ["Python", "Pandas", "Data Visualization"]
      },
      {
        name: "Predictive Analytics Dashboard",
        level: "Intermediate",
        skills: ["Machine Learning", "SQL", "Dashboard Tools"]
      },
      {
        name: "Natural Language Processing Application",
        level: "Advanced",
        skills: ["NLP", "Deep Learning", "Cloud Deployment"]
      }
    ],
    networking: {
      communities: [
        "Kaggle",
        "Data Science India Community",
        "Analytics Vidhya",
        "LinkedIn Data Science Groups"
      ],
      tips: [
        "Create a GitHub portfolio showcasing your projects",
        "Participate in hackathons and competitions",
        "Attend industry conferences and local meetups",
        "Connect with alumni working in data science roles"
      ]
    }
  },

  "machine-learning-engineer": {
    title: "Machine Learning Engineer",
    description: "Build and deploy machine learning systems to production environments",
    overview: {
      intro: "Machine Learning Engineers bridge the gap between data science and software engineering. They focus on taking ML models from research to production, making them crucial in AI-driven companies across India's tech landscape.",
      successStories: [
        "Ramesh Subramaniam transitioned from software engineering to ML engineering and now works at a leading AI startup in Bangalore.",
        "Several ML engineers from India have published research papers and contributed to open-source ML frameworks."
      ]
    },
    dayInLife: [
      "Design and implement machine learning algorithms",
      "Build scalable data pipelines for model training",
      "Deploy ML models to production environments",
      "Monitor and optimize model performance",
      "Collaborate with data scientists and software engineers"
    ],
    skills: {
      technical: ["Python", "TensorFlow/PyTorch", "MLOps", "Cloud Services (AWS, Azure, GCP)", "Data Engineering", "Distributed Computing", "Software Engineering"],
      soft: ["Problem-solving", "Systems thinking", "Communication", "Collaboration", "Continuous learning"]
    },
    courses: [
      {
        name: "Machine Learning Fundamentals",
        level: "Beginner",
        link: "/courses?category=machine-learning"
      },
      {
        name: "Deep Learning Specialization",
        level: "Intermediate",
        link: "/courses?category=machine-learning"
      },
      {
        name: "MLOps: Machine Learning Operations",
        level: "Advanced",
        link: "/courses?category=machine-learning"
      }
    ],
    projects: [
      {
        name: "Image Classification System",
        level: "Beginner",
        skills: ["Python", "Basic ML Algorithms", "Model Evaluation"]
      },
      {
        name: "Real-time Recommendation Engine",
        level: "Intermediate",
        skills: ["Deep Learning", "API Development", "Data Pipelines"]
      },
      {
        name: "End-to-End ML Pipeline Deployment",
        level: "Advanced",
        skills: ["MLOps", "Cloud Infrastructure", "Monitoring Systems"]
      }
    ],
    networking: {
      communities: [
        "Machine Learning India",
        "PyTorch/TensorFlow Communities",
        "Kaggle",
        "GitHub ML Projects"
      ],
      tips: [
        "Build an ML portfolio on GitHub with deployed projects",
        "Contribute to open-source ML libraries",
        "Participate in ML competitions and hackathons",
        "Attend ML conferences and workshops"
      ]
    }
  },

  "ai-researcher": {
    title: "AI Researcher",
    description: "Advance the field of artificial intelligence through innovative research",
    overview: {
      intro: "AI Researchers push the boundaries of what's possible in artificial intelligence. In India, AI research is growing rapidly with research labs from major tech companies and academic institutions focusing on solving complex AI challenges.",
      successStories: [
        "Dr. Sunita Verma completed her PhD in AI and now leads research initiatives at a Google AI lab in Bangalore.",
        "Several Indian AI researchers have had papers accepted at prestigious conferences like NeurIPS, ICML, and CVPR."
      ]
    },
    dayInLife: [
      "Design and implement novel AI algorithms and models",
      "Run experiments to validate research hypotheses",
      "Read and analyze latest research papers",
      "Write research papers and present at conferences",
      "Collaborate with interdisciplinary teams on complex challenges"
    ],
    skills: {
      technical: ["Deep Learning", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Mathematics (Linear Algebra, Calculus, Statistics)", "Advanced Python", "Research Methodologies"],
      soft: ["Critical thinking", "Creativity", "Scientific writing", "Perseverance", "Presentation skills"]
    },
    courses: [
      {
        name: "Deep Learning Specialization",
        level: "Beginner",
        link: "/courses?category=artificial-intelligence"
      },
      {
        name: "Natural Language Processing with Deep Learning",
        level: "Intermediate",
        link: "/courses?category=artificial-intelligence"
      },
      {
        name: "Advanced AI: Research Methods",
        level: "Advanced",
        link: "/courses?category=artificial-intelligence"
      }
    ],
    projects: [
      {
        name: "Implementing Recent AI Research Papers",
        level: "Beginner",
        skills: ["PyTorch/TensorFlow", "Research Understanding", "Experiment Design"]
      },
      {
        name: "Novel Neural Network Architecture",
        level: "Intermediate",
        skills: ["Deep Learning", "Algorithmic Innovation", "Performance Analysis"]
      },
      {
        name: "Original AI Research Project",
        level: "Advanced",
        skills: ["Research Methodology", "Model Design", "Academic Writing"]
      }
    ],
    networking: {
      communities: [
        "AI Research India",
        "Research Paper Discussion Groups",
        "ArXiv/Papers With Code",
        "Academic and Industry Labs"
      ],
      tips: [
        "Publish research papers in conferences and journals",
        "Create a Google Scholar profile",
        "Contribute implementations of research papers to GitHub",
        "Attend AI research conferences and workshops"
      ]
    }
  },

  "bi-developer": {
    title: "Business Intelligence Developer",
    description: "Create data visualization solutions that help businesses understand and analyze their data",
    overview: {
      intro: "BI Developers translate complex data into intuitive visualizations and dashboards. In India's increasingly data-driven business environment, BI skills are highly valued across industries for enabling data-informed decision making.",
      successStories: [
        "Karthik Rao transitioned from being a database administrator to a BI Developer at a major consulting firm, increasing his salary by 70%.",
        "Many BI professionals in India have become independent consultants, helping businesses establish data visualization practices."
      ]
    },
    dayInLife: [
      "Design and build interactive dashboards and reports",
      "Transform and model data for visualization",
      "Collaborate with stakeholders to understand reporting needs",
      "Optimize queries for dashboard performance",
      "Train users on how to leverage BI tools effectively"
    ],
    skills: {
      technical: ["SQL", "Power BI/Tableau/Looker", "ETL Processes", "Data Modeling", "DAX/M/MDX", "Excel", "Database Design"],
      soft: ["Data storytelling", "Business understanding", "Communication", "User empathy", "Problem-solving"]
    },
    courses: [
      {
        name: "Data Visualization Fundamentals",
        level: "Beginner",
        link: "/courses?category=business-intelligence"
      },
      {
        name: "Power BI Desktop to Dashboard",
        level: "Intermediate",
        link: "/courses?category=business-intelligence"
      },
      {
        name: "Advanced Data Modeling for Business Intelligence",
        level: "Advanced",
        link: "/courses?category=business-intelligence"
      }
    ],
    projects: [
      {
        name: "Sales Performance Dashboard",
        level: "Beginner",
        skills: ["Data Visualization", "Basic SQL", "Dashboard Design"]
      },
      {
        name: "Multi-source Data Integration Project",
        level: "Intermediate",
        skills: ["ETL", "Data Modeling", "Advanced Visualizations"]
      },
      {
        name: "Enterprise-wide BI Solution",
        level: "Advanced",
        skills: ["Data Architecture", "Performance Optimization", "Security Implementation"]
      }
    ],
    networking: {
      communities: [
        "Power BI User Group India",
        "Tableau Community India",
        "Data Visualization Society",
        "LinkedIn BI Groups"
      ],
      tips: [
        "Create a portfolio of dashboard designs and visualizations",
        "Get certified in major BI tools (Power BI, Tableau)",
        "Participate in visualization challenges",
        "Connect with other BI professionals through user groups"
      ]
    }
  },

  // 🌐 Web & Cloud
  "cloud-solutions-architect": {
    title: "Cloud Solutions Architect",
    description: "Design scalable, secure, and resilient cloud infrastructure for organizations",
    overview: {
      intro: "Cloud Architects design and oversee cloud computing strategies. With India's accelerating cloud adoption across industries, skilled cloud architects are essential for organizations transitioning to and optimizing cloud infrastructure.",
      successStories: [
        "Arun Mehta transitioned from network administration to cloud architecture and now leads cloud strategy for a major Indian conglomerate.",
        "Many Indian cloud architects have become highly paid consultants, helping businesses migrate to the cloud."
      ]
    },
    dayInLife: [
      "Design cloud-native architecture solutions",
      "Develop migration strategies from on-premise to cloud",
      "Implement security and compliance measures",
      "Optimize cloud resources for performance and cost",
      "Consult with stakeholders on cloud strategy"
    ],
    skills: {
      technical: ["AWS/Azure/GCP Services", "Infrastructure as Code", "Cloud Security", "Networking", "Containers & Orchestration", "Serverless Computing", "Disaster Recovery"],
      soft: ["Strategic thinking", "Communication", "Project management", "Problem-solving", "Customer focus"]
    },
    courses: [
      {
        name: "Cloud Computing Fundamentals",
        level: "Beginner",
        link: "/courses?category=cloud-computing"
      },
      {
        name: "AWS/Azure/GCP Architect Certification Preparation",
        level: "Intermediate",
        link: "/courses?category=cloud-computing"
      },
      {
        name: "Enterprise Cloud Architecture",
        level: "Advanced",
        link: "/courses?category=cloud-computing"
      }
    ],
    projects: [
      {
        name: "Cloud Migration Plan",
        level: "Beginner",
        skills: ["Cloud Basics", "Migration Strategies", "Cost Analysis"]
      },
      {
        name: "Scalable Microservices Architecture",
        level: "Intermediate",
        skills: ["Containerization", "Service Mesh", "CI/CD"]
      },
      {
        name: "Multi-cloud Enterprise Solution",
        level: "Advanced",
        skills: ["Hybrid Cloud", "Governance", "Complex Architectures"]
      }
    ],
    networking: {
      communities: [
        "AWS User Group India",
        "Azure India Community",
        "Google Cloud Developer Community India",
        "Cloud Native Computing Foundation"
      ],
      tips: [
        "Earn cloud architect certifications from major providers",
        "Create architecture diagrams and case studies for your portfolio",
        "Contribute to cloud open-source projects",
        "Speak at cloud computing events and webinars"
      ]
    }
  },

  "backend-engineer": {
    title: "Backend Engineer",
    description: "Develop server-side logic, databases, and APIs that power web applications",
    overview: {
      intro: "Backend Engineers build the 'brain' behind web applications. In India's tech industry, backend skills are foundational for many tech roles, and specialized backend engineers are invaluable for creating robust, scalable systems.",
      successStories: [
        "Aarav Patel specialized in Node.js backend development and now works remotely for a European tech company at 2x the local market rate.",
        "Several Indian backend engineers have founded successful SaaS startups based on their technical expertise."
      ]
    },
    dayInLife: [
      "Write clean, maintainable server-side code",
      "Design and implement database schemas",
      "Build RESTful or GraphQL APIs",
      "Optimize applications for performance and scalability",
      "Collaborate with frontend developers and DevOps teams"
    ],
    skills: {
      technical: ["Python/Node.js/Java/Go", "SQL and NoSQL Databases", "API Design", "Caching Strategies", "Authentication/Authorization", "Message Queues", "Testing"],
      soft: ["Problem-solving", "Attention to detail", "Communication", "Teamwork", "System design thinking"]
    },
    courses: [
      {
        name: "Backend Development with Node.js",
        level: "Beginner",
        link: "/courses?category=backend-development"
      },
      {
        name: "API Design and Development",
        level: "Intermediate",
        link: "/courses?category=backend-development"
      },
      {
        name: "Scalable Backend Architecture",
        level: "Advanced",
        link: "/courses?category=backend-development"
      }
    ],
    projects: [
      {
        name: "RESTful API Service",
        level: "Beginner",
        skills: ["Express/Django/Flask", "Basic Database Design", "Authentication"]
      },
      {
        name: "E-commerce Backend",
        level: "Intermediate",
        skills: ["API Design", "Payment Integration", "Database Optimization"]
      },
      {
        name: "Scalable Microservices Architecture",
        level: "Advanced",
        skills: ["Microservices", "Message Queues", "Caching"]
      }
    ],
    networking: {
      communities: [
        "Node.js India",
        "Python Developers India",
        "Backend Developers Community",
        "Stack Overflow"
      ],
      tips: [
        "Create GitHub repositories with well-documented backend projects",
        "Contribute to open-source backend frameworks",
        "Demonstrate your understanding of scalability and performance",
        "Join backend-focused developer groups"
      ]
    }
  },

  "frontend-developer": {
    title: "Frontend Developer",
    description: "Create the user interfaces and experiences for web applications",
    overview: {
      intro: "Frontend Developers craft the visible parts of websites and applications that users interact with. In India's digital landscape, skilled frontend developers are essential for creating engaging user experiences that drive business success.",
      successStories: [
        "Meera Joshi became a frontend specialist and now works as a UI engineer at a major e-commerce platform.",
        "Many Indian frontend developers have built successful careers as freelancers serving international clients."
      ]
    },
    dayInLife: [
      "Write clean, efficient frontend code using HTML, CSS, and JavaScript",
      "Implement responsive designs that work across devices",
      "Collaborate with designers and backend developers",
      "Test and debug across multiple browsers",
      "Optimize web applications for performance"
    ],
    skills: {
      technical: ["HTML/CSS", "JavaScript/TypeScript", "React/Angular/Vue", "Responsive Design", "CSS Frameworks", "State Management", "Web Performance"],
      soft: ["Attention to detail", "Creativity", "User empathy", "Communication", "Problem-solving"]
    },
    courses: [
      {
        name: "Modern Frontend Development",
        level: "Beginner",
        link: "/courses?category=frontend-development"
      },
      {
        name: "React.js Development Masterclass",
        level: "Intermediate",
        link: "/courses?category=frontend-development"
      },
      {
        name: "Advanced Frontend Architecture",
        level: "Advanced",
        link: "/courses?category=frontend-development"
      }
    ],
    projects: [
      {
        name: "Personal Portfolio Website",
        level: "Beginner",
        skills: ["HTML/CSS", "JavaScript", "Responsive Design"]
      },
      {
        name: "Interactive Web Application",
        level: "Intermediate",
        skills: ["React/Vue", "State Management", "API Integration"]
      },
      {
        name: "Enterprise-level Frontend System",
        level: "Advanced",
        skills: ["Component Architecture", "Performance Optimization", "Advanced State Management"]
      }
    ],
    networking: {
      communities: [
        "React India",
        "JavaScript Developers India",
        "Frontend Developers Community",
        "CSS Tricks Forums"
      ],
      tips: [
        "Build a portfolio showcasing your frontend skills",
        "Share your UI components on platforms like CodePen",
        "Contribute to popular frontend open-source projects",
        "Participate in frontend hackathons and challenges"
      ]
    }
  },

  "site-reliability-engineer": {
    title: "Site Reliability Engineer (SRE)",
    description: "Ensure application reliability, performance, and scalability in production",
    overview: {
      intro: "SREs bridge development and operations, focusing on system reliability and automation. In India's growing tech ecosystem, SREs are vital for companies that need to maintain high-availability services and infrastructure.",
      successStories: [
        "Vivek Sharma transitioned from a system administrator role to an SRE at a major Indian fintech company, doubling his salary.",
        "Several Indian SREs have moved to global tech companies through their expertise in maintaining large-scale systems."
      ]
    },
    dayInLife: [
      "Monitor and maintain production systems",
      "Implement automation to reduce manual operations",
      "Respond to and resolve system incidents",
      "Design and implement reliability improvements",
      "Collaborate with development teams on system architecture"
    ],
    skills: {
      technical: ["Linux/Unix Systems", "Cloud Platforms", "Monitoring Tools", "Automation/Scripting", "CI/CD", "Infrastructure as Code", "Incident Response"],
      soft: ["Problem-solving under pressure", "Communication", "Systems thinking", "On-call management", "Documentation"]
    },
    courses: [
      {
        name: "Introduction to Site Reliability Engineering",
        level: "Beginner",
        link: "/courses?category=devops"
      },
      {
        name: "Cloud Reliability and Resilience",
        level: "Intermediate",
        link: "/courses?category=devops"
      },
      {
        name: "Advanced SRE Practices",
        level: "Advanced",
        link: "/courses?category=devops"
      }
    ],
    projects: [
      {
        name: "Monitoring and Alerting System",
        level: "Beginner",
        skills: ["Prometheus/Grafana", "Basic Scripting", "Alerting Rules"]
      },
      {
        name: "Automated Recovery System",
        level: "Intermediate",
        skills: ["Kubernetes", "Incident Response Automation", "SLO Implementation"]
      },
      {
        name: "Chaos Engineering Framework",
        level: "Advanced",
        skills: ["Chaos Testing", "Resilience Engineering", "Complex System Design"]
      }
    ],
    networking: {
      communities: [
        "SRE India Community",
        "DevOps India",
        "Cloud Native Computing Foundation",
        "LinkedIn SRE Groups"
      ],
      tips: [
        "Get certified in cloud platforms and SRE tools",
        "Create case studies of reliability improvements you've implemented",
        "Contribute to infrastructure automation tools",
        "Participate in on-call and incident management workshops"
      ]
    }
  },

  "web3-smart-contract-auditor": {
    title: "Web3 Smart Contract Auditor",
    description: "Review and secure blockchain smart contracts to prevent vulnerabilities and hacks",
    overview: {
      intro: "Smart Contract Auditors are security specialists who ensure blockchain applications are secure and free from vulnerabilities. In India's growing Web3 ecosystem, these specialists are crucial for protecting millions in digital assets.",
      successStories: [
        "Rajat Verma became a self-taught smart contract auditor and now works remotely for security firms, earning significantly more than traditional security roles.",
        "Several Indian auditors have started their own security audit firms serving global blockchain projects."
      ]
    },
    dayInLife: [
      "Review smart contract code for security vulnerabilities",
      "Perform static analysis and dynamic testing",
      "Document findings and suggest improvements",
      "Stay updated with latest security threats and exploits",
      "Consult with development teams on secure coding practices"
    ],
    skills: {
      technical: ["Solidity", "Smart Contract Architecture", "Security Vulnerabilities", "Blockchain Fundamentals", "Audit Tools", "Formal Verification", "Testing Frameworks"],
      soft: ["Attention to detail", "Security mindset", "Technical writing", "Communication", "Ethical thinking"]
    },
    courses: [
      {
        name: "Blockchain Security Fundamentals",
        level: "Beginner",
        link: "/courses?category=blockchain"
      },
      {
        name: "Smart Contract Security & Auditing",
        level: "Intermediate",
        link: "/courses?category=blockchain"
      },
      {
        name: "Advanced Security Analysis for DeFi",
        level: "Advanced",
        link: "/courses?category=blockchain"
      }
    ],
    projects: [
      {
        name: "Simple Token Contract Audit",
        level: "Beginner",
        skills: ["Solidity", "Basic Security Patterns", "Testing"]
      },
      {
        name: "DeFi Protocol Security Review",
        level: "Intermediate",
        skills: ["Vulnerability Identification", "Economic Analysis", "Audit Documentation"]
      },
      {
        name: "Custom Security Tools Development",
        level: "Advanced",
        skills: ["Automated Analysis", "Formal Verification", "Advanced Attack Vectors"]
      }
    ],
    networking: {
      communities: [
        "Immunefi",
        "Code4rena",
        "Secureum",
        "Ethereum India Alliance"
      ],
      tips: [
        "Participate in bug bounty programs on platforms like Immunefi",
        "Create security analysis reports of known exploits",
        "Contribute to security tools and libraries",
        "Join audit competitions and contests"
      ]
    }
  },

  // 🔐 Cybersecurity
  "security-analyst": {
    title: "Security Analyst",
    description: "Monitor and protect information systems from security threats and breaches",
    overview: {
      intro: "Security Analysts are the frontline defenders of organizational data and systems. In India's rapidly digitalizing economy, the demand for security professionals is growing across banking, healthcare, IT, and government sectors.",
      successStories: [
        "Aditi Sharma moved from network administration to security analysis and now leads the security operations team at a major Indian bank.",
        "Many Indian security analysts have transitioned to international roles through remote work opportunities."
      ]
    },
    dayInLife: [
      "Monitor security systems for potential threats",
      "Investigate security alerts and incidents",
      "Implement security tools and controls",
      "Conduct vulnerability assessments",
      "Develop security documentation and training materials"
    ],
    skills: {
      technical: ["Network Security", "Endpoint Security", "SIEM Tools", "Vulnerability Assessment", "Security Frameworks", "Basic Scripting", "Incident Response"],
      soft: ["Analytical thinking", "Attention to detail", "Communication", "Continuous learning", "Calm under pressure"]
    },
    courses: [
      {
        name: "Cybersecurity Fundamentals",
        level: "Beginner",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Security Operations Center (SOC) Analyst Training",
        level: "Intermediate",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Advanced Threat Hunting",
        level: "Advanced",
        link: "/courses?category=cybersecurity"
      }
    ],
    projects: [
      {
        name: "Home Lab Security Setup",
        level: "Beginner",
        skills: ["Network Security", "Basic Monitoring", "Firewall Configuration"]
      },
      {
        name: "Security Monitoring System",
        level: "Intermediate",
        skills: ["SIEM Implementation", "Log Analysis", "Alert Creation"]
      },
      {
        name: "Comprehensive Security Assessment",
        level: "Advanced",
        skills: ["Vulnerability Assessment", "Risk Analysis", "Security Documentation"]
      }
    ],
    networking: {
      communities: [
        "OWASP India",
        "Null Community",
        "InfoSecGirls India",
        "DSCI (Data Security Council of India)"
      ],
      tips: [
        "Earn industry certifications like CompTIA Security+, CISSP, or CEH",
        "Create a home lab for practicing security concepts",
        "Document case studies of security incidents you've analyzed",
        "Attend security conferences and workshops"
      ]
    }
  },

  "ethical-hacker": {
    title: "Ethical Hacker (Penetration Tester)",
    description: "Identify and exploit security vulnerabilities to help organizations improve their security posture",
    overview: {
      intro: "Ethical Hackers use the same techniques as malicious hackers but with permission to help organizations find and fix security weaknesses. In India, this role is seeing increased demand as companies prioritize proactive security measures.",
      successStories: [
        "Rahul Verma built his ethical hacking skills through bug bounty programs and now runs a successful penetration testing consultancy.",
        "Several Indian ethical hackers have been recognized on global bug bounty leaderboards, earning substantial rewards."
      ]
    },
    dayInLife: [
      "Conduct penetration tests against applications, networks, and systems",
      "Identify and exploit security vulnerabilities",
      "Document findings and develop remediation recommendations",
      "Present results to technical and non-technical stakeholders",
      "Stay updated with the latest hacking techniques and tools"
    ],
    skills: {
      technical: ["Network Penetration Testing", "Web Application Security", "Social Engineering", "Exploitation Tools", "Scripting (Python, Bash)", "Mobile Application Testing", "Cloud Security"],
      soft: ["Ethical judgment", "Analytical thinking", "Attention to detail", "Communication", "Creative problem-solving"]
    },
    courses: [
      {
        name: "Ethical Hacking Fundamentals",
        level: "Beginner",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Web Application Penetration Testing",
        level: "Intermediate",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Advanced Exploitation Techniques",
        level: "Advanced",
        link: "/courses?category=cybersecurity"
      }
    ],
    projects: [
      {
        name: "Vulnerable Application Testing",
        level: "Beginner",
        skills: ["OWASP Top 10", "Basic Exploitation", "Reporting"]
      },
      {
        name: "Network Penetration Test",
        level: "Intermediate",
        skills: ["Network Scanning", "Exploitation", "Privilege Escalation"]
      },
      {
        name: "Red Team Operation Simulation",
        level: "Advanced",
        skills: ["Advanced Persistence", "Custom Exploit Development", "Evasion Techniques"]
      }
    ],
    networking: {
      communities: [
        "HackTheBox",
        "TryHackMe",
        "Bugcrowd",
        "HackerOne"
      ],
      tips: [
        "Practice on legal platforms like HackTheBox and TryHackMe",
        "Participate in bug bounty programs on HackerOne or Bugcrowd",
        "Earn certifications like CEH, OSCP, or SANS GPEN",
        "Document your findings in a portfolio (without disclosing sensitive information)"
      ]
    }
  },

  "soc-analyst": {
    title: "Security Operations Center (SOC) Analyst",
    description: "Monitor and respond to security incidents in real-time within a security operations center",
    overview: {
      intro: "SOC Analysts are the first line of defense against cyber attacks, monitoring systems 24/7 to detect and respond to security threats. In India, many global companies have established SOCs, creating growing opportunities in this field.",
      successStories: [
        "Preeti Singh started as a junior SOC analyst and now manages a team at a major security services provider in Pune.",
        "Several Indian SOC analysts have moved into specialized roles in threat intelligence and incident response."
      ]
    },
    dayInLife: [
      "Monitor security alerts from various security tools",
      "Investigate and triage security incidents",
      "Escalate significant security events to appropriate teams",
      "Document incident response procedures",
      "Analyze trends to improve security monitoring"
    ],
    skills: {
      technical: ["SIEM Tools (Splunk, QRadar, etc.)", "Log Analysis", "Network Security Monitoring", "Threat Intelligence", "Incident Response", "Security Frameworks", "Basic Forensics"],
      soft: ["Alert mindset", "Communication", "Team collaboration", "Critical thinking", "Working under pressure"]
    },
    courses: [
      {
        name: "Introduction to SOC Operations",
        level: "Beginner",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Security Information and Event Management (SIEM)",
        level: "Intermediate",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Advanced Incident Response",
        level: "Advanced",
        link: "/courses?category=cybersecurity"
      }
    ],
    projects: [
      {
        name: "SIEM Lab Setup and Configuration",
        level: "Beginner",
        skills: ["SIEM Basics", "Log Sources", "Alert Creation"]
      },
      {
        name: "Incident Response Playbook Development",
        level: "Intermediate",
        skills: ["Incident Handling", "Documentation", "Process Development"]
      },
      {
        name: "Threat Hunting Exercise",
        level: "Advanced",
        skills: ["Advanced Queries", "Pattern Recognition", "Threat Intelligence Application"]
      }
    ],
    networking: {
      communities: [
        "SOC Analysts India Group",
        "SANS Blue Team Forums",
        "Splunk User Groups",
        "LinkedIn Security Groups"
      ],
      tips: [
        "Get certified in SIEM technologies (Splunk, QRadar, etc.)",
        "Participate in blue team security exercises",
        "Create a portfolio demonstrating your SIEM and analysis skills",
        "Join incident response workshops and training"
      ]
    }
  },

  "cryptography-engineer": {
    title: "Cryptography Engineer",
    description: "Design and implement secure cryptographic systems and protocols",
    overview: {
      intro: "Cryptography Engineers protect sensitive data and communications through mathematical algorithms and security protocols. In India, this specialized role is growing in importance across financial services, government, and technology sectors.",
      successStories: [
        "Dr. Anand Sharma, with a PhD in mathematics, transitioned to cryptography and now leads security protocol design at a major Indian payment gateway.",
        "Several Indian cryptographers have contributed to international security standards and protocols."
      ]
    },
    dayInLife: [
      "Design and implement cryptographic algorithms and protocols",
      "Review code for cryptographic vulnerabilities",
      "Research and evaluate cryptographic solutions",
      "Document security implementations and standards",
      "Keep updated with advances in cryptographic research"
    ],
    skills: {
      technical: ["Applied Cryptography", "Mathematics (Number Theory, Abstract Algebra)", "Security Engineering", "Programming (C/C++, Rust, Python)", "PKI Systems", "Security Protocol Design", "Cryptanalysis"],
      soft: ["Rigorous thinking", "Attention to detail", "Research skills", "Technical writing", "Critical analysis"]
    },
    courses: [
      {
        name: "Introduction to Cryptography",
        level: "Beginner",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Applied Cryptography",
        level: "Intermediate",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Advanced Cryptographic Systems",
        level: "Advanced",
        link: "/courses?category=cybersecurity"
      }
    ],
    projects: [
      {
        name: "Implementation of Basic Cryptographic Algorithms",
        level: "Beginner",
        skills: ["Symmetric Encryption", "Hashing", "Basic Protocols"]
      },
      {
        name: "Secure Communication System",
        level: "Intermediate",
        skills: ["Public Key Infrastructure", "Protocol Design", "Security Analysis"]
      },
      {
        name: "Zero-Knowledge Proof Application",
        level: "Advanced",
        skills: ["Advanced Cryptography", "Protocol Development", "Formal Verification"]
      }
    ],
    networking: {
      communities: [
        "International Association for Cryptologic Research",
        "Cryptography Research Society of India",
        "IEEE Security & Privacy",
        "Academic Cryptography Groups"
      ],
      tips: [
        "Build a strong foundation in mathematics",
        "Contribute to cryptographic libraries and open-source projects",
        "Attend academic and industry cryptography conferences",
        "Publish research papers or technical articles on cryptographic topics"
      ]
    }
  },

  "compliance-risk-analyst": {
    title: "Compliance & Risk Analyst",
    description: "Ensure organizational adherence to security regulations and manage information security risks",
    overview: {
      intro: "Compliance & Risk Analysts help organizations navigate complex security regulations and manage information security risks. In India, with increasing data protection laws and global compliance requirements, these roles are crucial across industries.",
      successStories: [
        "Deepa Nair transitioned from legal compliance to IT compliance and now heads governance, risk, and compliance for a major IT services company.",
        "Several risk professionals from India have moved into global roles managing compliance for multinational companies."
      ]
    },
    dayInLife: [
      "Conduct risk assessments and compliance audits",
      "Develop and maintain security policies and procedures",
      "Monitor regulatory changes and update compliance frameworks",
      "Prepare compliance documentation and reports",
      "Coordinate with internal and external auditors"
    ],
    skills: {
      technical: ["Compliance Frameworks (ISO 27001, GDPR, etc.)", "Risk Assessment Methodologies", "Security Controls", "Audit Processes", "GRC Tools", "Data Privacy Regulations", "Security Documentation"],
      soft: ["Analytical thinking", "Attention to detail", "Communication", "Diplomacy", "Organizational skills"]
    },
    courses: [
      {
        name: "Information Security Governance",
        level: "Beginner",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "IT Risk Management and Compliance",
        level: "Intermediate",
        link: "/courses?category=cybersecurity"
      },
      {
        name: "Advanced GRC Implementation",
        level: "Advanced",
        link: "/courses?category=cybersecurity"
      }
    ],
    projects: [
      {
        name: "Security Policy Development",
        level: "Beginner",
        skills: ["Policy Writing", "Best Practices", "Documentation"]
      },
      {
        name: "Compliance Gap Assessment",
        level: "Intermediate",
        skills: ["Audit Techniques", "Control Mapping", "Remediation Planning"]
      },
      {
        name: "Enterprise Risk Management Program",
        level: "Advanced",
        skills: ["Risk Frameworks", "Risk Quantification", "Board Reporting"]
      }
    ],
    networking: {
      communities: [
        "ISACA Chapter India",
        "Data Security Council of India",
        "(ISC)² Chapter",
        "GRC Professionals Network"
      ],
      tips: [
        "Earn certifications like CISA, CRISC, or CISSP",
        "Develop knowledge of both international and Indian compliance requirements",
        "Create case studies of compliance implementations",
        "Attend governance and compliance conferences"
      ]
    }
  },

  // 🎨 Product, Design & Marketing
  "ui-ux-designer": {
    title: "UI/UX Designer",
    description: "Create user-centered designs and experiences for digital products",
    overview: {
      intro: "UI/UX designers focus on creating intuitive, enjoyable user experiences for websites and applications. As India's digital economy grows, companies increasingly value designers who can create products that users love.",
      successStories: [
        "Nisha Patel transitioned from graphic design to UI/UX and now leads the design team at a fintech startup after just 3 years.",
        "Several Indian designers have gained international recognition on platforms like Dribbble and Behance, opening doors to global opportunities."
      ]
    },
    dayInLife: [
      "Create wireframes, prototypes, and mockups",
      "Conduct user research and usability testing",
      "Collaborate with product managers and developers",
      "Design UI elements and user flows",
      "Iterate based on user feedback"
    ],
    skills: {
      technical: ["Figma/Adobe XD", "Wireframing", "Prototyping", "Visual Design", "Information Architecture", "User Research", "Usability Testing"],
      soft: ["Empathy", "Communication", "Critical Thinking", "Collaboration", "Adaptability"]
    },
    courses: [
      {
        name: "UI/UX Design Fundamentals",
        level: "Beginner",
        link: "/courses?category=design"
      },
      {
        name: "User Research and Testing Methods",
        level: "Intermediate",
        link: "/courses?category=design"
      },
      {
        name: "Advanced Interaction Design",
        level: "Advanced",
        link: "/courses?category=design"
      }
    ],
    projects: [
      {
        name: "Mobile App Redesign",
        level: "Beginner",
        skills: ["UI Design", "Wireframing", "Usability"]
      },
      {
        name: "E-commerce User Experience Project",
        level: "Intermediate",
        skills: ["User Research", "Information Architecture", "Prototyping"]
      },
      {
        name: "Design System Creation",
        level: "Advanced",
        skills: ["Design Systems", "Component Design", "Documentation"]
      }
    ],
    networking: {
      communities: [
        "Dribbble",
        "Behance",
        "Design Buddies",
        "Indian Design Community"
      ],
      tips: [
        "Create a standout portfolio showcasing your process",
        "Share redesigns of existing products with your improvements",
        "Follow and engage with designers you admire",
        "Attend design workshops and conferences"
      ]
    }
  },

  "product-manager": {
    title: "Product Manager (Tech)",
    description: "Lead the development of products from conception to launch and beyond",
    overview: {
      intro: "Product Managers are the bridge between business strategy, user needs, and technical implementation. They work closely with all teams to ensure products solve real problems and deliver value.",
      successStories: [
        "Rohit Mehta started as a software developer but switched to product management at Paytm, now leading their core payment product.",
        "The demand for product managers in India has grown by 250% in the last 3 years across startups and established companies."
      ]
    },
    dayInLife: [
      "Define product vision and strategy",
      "Gather and prioritize user requirements",
      "Work with designers and engineers on implementation",
      "Analyze metrics and user feedback",
      "Present to stakeholders and leadership"
    ],
    skills: {
      technical: ["Product Analytics", "Basic Programming Knowledge", "Wireframing", "Project Management", "A/B Testing"],
      soft: ["Communication", "Leadership", "Strategic Thinking", "Empathy", "Negotiation"]
    },
    courses: [
      {
        name: "Product Management Fundamentals",
        level: "Beginner",
        link: "/courses?category=business"
      },
      {
        name: "User Research and Validation",
        level: "Intermediate",
        link: "/courses?category=business"
      },
      {
        name: "Strategic Product Leadership",
        level: "Advanced",
        link: "/courses?category=business"
      }
    ],
    projects: [
      {
        name: "Feature Specification Document",
        level: "Beginner",
        skills: ["Documentation", "User Stories", "Wireframing"]
      },
      {
        name: "Product Roadmap Creation",
        level: "Intermediate",
        skills: ["Strategy", "Prioritization", "Stakeholder Management"]
      },
      {
        name: "Product Launch Campaign",
        level: "Advanced",
        skills: ["Marketing", "Analytics", "Cross-functional Coordination"]
      }
    ],
    networking: {
      communities: [
        "Product Management Club India",
        "ProductHunt",
        "Mind the Product",
        "Product Coalition"
      ],
      tips: [
        "Create case studies of products you use and how you would improve them",
        "Network with existing product managers on LinkedIn",
        "Attend product conferences and meetups",
        "Join online communities and contribute to discussions"
      ]
    }
  },

  "digital-marketing-analyst": {
    title: "Digital Marketing Analyst",
    description: "Analyze digital marketing campaigns and optimize strategies based on data",
    overview: {
      intro: "Digital Marketing Analysts use data to improve marketing performance across channels. In India's rapidly growing digital landscape, companies are investing heavily in data-driven marketing, creating strong demand for these analytical skills.",
      successStories: [
        "Shreya Gupta began her career tracking basic website metrics and now leads growth analytics at a major Indian e-commerce platform.",
        "Many marketing analysts in India have successfully transitioned to international remote roles with global companies."
      ]
    },
    dayInLife: [
      "Analyze marketing campaign performance across channels",
      "Build and maintain reporting dashboards",
      "Identify trends and optimization opportunities",
      "Conduct A/B tests to improve conversion rates",
      "Collaborate with marketing and product teams"
    ],
    skills: {
      technical: ["Google Analytics", "Marketing Automation Tools", "SQL", "Data Visualization", "A/B Testing", "Attribution Modeling", "Excel/Google Sheets"],
      soft: ["Analytical thinking", "Communication", "Problem-solving", "Business acumen", "Attention to detail"]
    },
    courses: [
      {
        name: "Digital Marketing Analytics Fundamentals",
        level: "Beginner",
        link: "/courses?category=marketing"
      },
      {
        name: "Advanced Google Analytics and Tag Manager",
        level: "Intermediate",
        link: "/courses?category=marketing"
      },
      {
        name: "Conversion Rate Optimization Mastery",
        level: "Advanced",
        link: "/courses?category=marketing"
      }
    ],
    projects: [
      {
        name: "Marketing Dashboard Creation",
        level: "Beginner",
        skills: ["Data Visualization", "Basic Metrics", "Reporting"]
      },
      {
        name: "Multi-channel Campaign Analysis",
        level: "Intermediate",
        skills: ["Attribution Modeling", "Channel Performance", "ROI Calculation"]
      },
      {
        name: "Predictive Marketing Analytics",
        level: "Advanced",
        skills: ["Statistical Analysis", "Predictive Modeling", "Advanced Segmentation"]
      }
    ],
    networking: {
      communities: [
        "Digital Marketing Analytics India",
        "Growth Hackers Community",
        "Analytics India Community",
        "Marketing Measurement Strategy Forum"
      ],
      tips: [
        "Get certified in Google Analytics, Google Ads, and other marketing platforms",
        "Create case studies showing how your analysis improved marketing performance",
        "Build dashboards that showcase your data visualization skills",
        "Contribute to discussions about marketing measurement and attribution"
      ]
    }
  },

  "tech-content-writer": {
    title: "Tech Content Writer/Creator",
    description: "Create engaging technical content that educates and informs audiences",
    overview: {
      intro: "Tech Content Writers explain complex technical concepts in clear, accessible ways. In India's growing tech ecosystem, there's high demand for writers who can create tutorials, documentation, blogs, and educational content across technical domains.",
      successStories: [
        "Divya Verma started a technical blog while learning to code and now earns a full-time income creating programming tutorials and courses.",
        "Many Indian tech writers have built successful freelance careers working with international clients and publications."
      ]
    },
    dayInLife: [
      "Research technical topics and stay updated with trends",
      "Create blog posts, tutorials, documentation, or videos",
      "Collaborate with developers and subject matter experts",
      "Edit and refine content for clarity and accuracy",
      "Analyze content performance and audience engagement"
    ],
    skills: {
      technical: ["Technical Knowledge (Programming, Tech Domains)", "SEO", "Content Management Systems", "Basic HTML/Markdown", "Technical Documentation Tools", "Visual Content Creation", "Analytics"],
      soft: ["Clear communication", "Research skills", "Curiosity", "Time management", "Empathy for audience"]
    },
    courses: [
      {
        name: "Technical Writing Fundamentals",
        level: "Beginner",
        link: "/courses?category=content-creation"
      },
      {
        name: "SEO for Technical Content",
        level: "Intermediate",
        link: "/courses?category=content-creation"
      },
      {
        name: "Advanced Developer Documentation",
        level: "Advanced",
        link: "/courses?category=content-creation"
      }
    ],
    projects: [
      {
        name: "Technical Blog Series",
        level: "Beginner",
        skills: ["Writing", "Basic Technical Knowledge", "Content Structure"]
      },
      {
        name: "Interactive Technical Tutorial",
        level: "Intermediate",
        skills: ["Code Examples", "Technical Accuracy", "User Engagement"]
      },
      {
        name: "Comprehensive Technical Documentation",
        level: "Advanced",
        skills: ["Documentation Systems", "API References", "Advanced Technical Concepts"]
      }
    ],
    networking: {
      communities: [
        "Technical Writers of India",
        "Dev.to",
        "Hashnode",
        "Write the Docs"
      ],
      tips: [
        "Create a portfolio showcasing various types of technical content",
        "Start a blog or contribute to publications in your technical area",
        "Engage with developer communities to understand their content needs",
        "Learn the basics of SEO to make your content discoverable"
      ]
    }
  },

  "growth-hacker": {
    title: "Growth Hacker (SaaS/Apps)",
    description: "Drive user acquisition, activation, and retention through data-driven experimentation",
    overview: {
      intro: "Growth Hackers blend marketing, product, and data skills to drive rapid user growth. In India's startup ecosystem, growth hackers play a vital role in scaling products efficiently with limited resources.",
      successStories: [
        "Amit Kumar implemented growth strategies that took his startup from 10,000 to 1 million users in 18 months without massive marketing budgets.",
        "Several Indian growth professionals have become independent consultants helping SaaS startups scale globally."
      ]
    },
    dayInLife: [
      "Analyze user acquisition, activation, and retention metrics",
      "Design and run growth experiments across channels",
      "Optimize conversion funnels and user journeys",
      "Collaborate with product and engineering on growth features",
      "Report on key metrics and growth initiatives"
    ],
    skills: {
      technical: ["Analytics Tools", "A/B Testing", "Marketing Automation", "Basic Coding (HTML/CSS/JS)", "SQL", "Funnel Optimization", "User Behavior Analysis"],
      soft: ["Creativity", "Data-driven decision making", "Adaptability", "Persistence", "Cross-functional collaboration"]
    },
    courses: [
      {
        name: "Growth Hacking Fundamentals",
        level: "Beginner",
        link: "/courses?category=marketing"
      },
      {
        name: "User Acquisition and Conversion Optimization",
        level: "Intermediate",
        link: "/courses?category=marketing"
      },
      {
        name: "Advanced Growth Strategies for SaaS",
        level: "Advanced",
        link: "/courses?category=marketing"
      }
    ],
    projects: [
      {
        name: "Viral Referral Program",
        level: "Beginner",
        skills: ["Referral Mechanics", "Basic Analytics", "Messaging"]
      },
      {
        name: "Multi-channel User Acquisition Campaign",
        level: "Intermediate",
        skills: ["Channel Strategy", "Conversion Optimization", "ROI Analysis"]
      },
      {
        name: "Full-funnel Growth System",
        level: "Advanced",
        skills: ["Retention Strategies", "Product-led Growth", "Experimentation Framework"]
      }
    ],
    networking: {
      communities: [
        "Growth Hackers Community",
        "Product-Led Growth Collective",
        "SaaS Growth Community India",
        "GrowthX Community"
      ],
      tips: [
        "Document case studies of growth experiments you've run",
        "Build a personal brand by sharing growth insights on LinkedIn/Twitter",
        "Network with other growth professionals and founders",
        "Stay updated with the latest acquisition channels and tactics"
      ]
    }
  },

  // ⚙️ Hardware, IoT & Robotics
  "iot-developer": {
    title: "IoT Developer",
    description: "Create connected devices and systems that communicate over the internet",
    overview: {
      intro: "IoT Developers build the technology behind smart devices that are transforming homes, cities, and industries. In India, IoT adoption is growing rapidly across manufacturing, agriculture, healthcare, and smart cities initiatives.",
      successStories: [
        "Rajan Patel developed IoT solutions for agriculture that now help thousands of Indian farmers optimize irrigation and crop management.",
        "Several Indian IoT professionals have founded successful startups in areas like industrial automation and smart home technology."
      ]
    },
    dayInLife: [
      "Program embedded systems and microcontrollers",
      "Develop software for IoT devices and gateways",
      "Implement communication protocols and APIs",
      "Test device connectivity and performance",
      "Collaborate with hardware engineers and cloud developers"
    ],
    skills: {
      technical: ["Embedded Programming (C/C++)", "IoT Protocols (MQTT, CoAP)", "Microcontrollers (Arduino, ESP32)", "Cloud Platforms (AWS IoT, Azure IoT)", "Networking", "Security", "Basic Electronics"],
      soft: ["Problem-solving", "System thinking", "Patience", "Attention to detail", "Cross-discipline collaboration"]
    },
    courses: [
      {
        name: "Introduction to IoT Development",
        level: "Beginner",
        link: "/courses?category=iot"
      },
      {
        name: "Connected Devices and Protocols",
        level: "Intermediate",
        link: "/courses?category=iot"
      },
      {
        name: "Industrial IoT Applications",
        level: "Advanced",
        link: "/courses?category=iot"
      }
    ],
    projects: [
      {
        name: "Home Automation System",
        level: "Beginner",
        skills: ["Microcontroller Programming", "Basic Sensors", "Simple Mobile App"]
      },
      {
        name: "Environmental Monitoring Network",
        level: "Intermediate",
        skills: ["Multiple Sensors", "Wireless Communication", "Cloud Integration"]
      },
      {
        name: "Industrial IoT Monitoring System",
        level: "Advanced",
        skills: ["Industrial Protocols", "Edge Computing", "Data Analytics"]
      }
    ],
    networking: {
      communities: [
        "IoT Forum India",
        "Arduino India Community",
        "Raspberry Pi Foundation",
        "IEEE IoT Community"
      ],
      tips: [
        "Build your own IoT projects and document them thoroughly",
        "Contribute to open-source IoT platforms and libraries",
        "Participate in IoT hackathons and challenges",
        "Join maker spaces and hardware communities"
      ]
    }
  },

  "embedded-systems-engineer": {
    title: "Embedded Systems Engineer",
    description: "Develop software for specialized computing systems built into hardware devices",
    overview: {
      intro: "Embedded Systems Engineers create the software that powers everything from medical devices to automotive systems. In India, this field offers opportunities in automotive, consumer electronics, industrial automation, and defense sectors.",
      successStories: [
        "Vijay Singh specialized in automotive embedded systems and now works with a major Indian automotive R&D center developing next-generation vehicle systems.",
        "Many embedded systems engineers from India have found opportunities with multinational electronics manufacturers."
      ]
    },
    dayInLife: [
      "Write and optimize code for embedded microcontrollers",
      "Design firmware and low-level software",
      "Test and debug using specialized equipment",
      "Optimize for performance, memory, and power constraints",
      "Collaborate with hardware engineers and system architects"
    ],
    skills: {
      technical: ["C/C++", "Microcontroller Architecture", "Real-time Operating Systems", "Digital Signal Processing", "Communication Protocols", "Debugging Tools", "Hardware Interfaces"],
      soft: ["Attention to detail", "Methodical approach", "Problem-solving", "Patience", "Technical documentation"]
    },
    courses: [
      {
        name: "Embedded C Programming",
        level: "Beginner",
        link: "/courses?category=embedded-systems"
      },
      {
        name: "Real-time Operating Systems",
        level: "Intermediate",
        link: "/courses?category=embedded-systems"
      },
      {
        name: "Advanced Embedded System Design",
        level: "Advanced",
        link: "/courses?category=embedded-systems"
      }
    ],
    projects: [
      {
        name: "Digital Thermometer/Timer",
        level: "Beginner",
        skills: ["Microcontroller Basics", "Sensors", "Simple UI"]
      },
      {
        name: "Wireless Sensor Network",
        level: "Intermediate",
        skills: ["Power Management", "Wireless Protocols", "Data Processing"]
      },
      {
        name: "Real-time Control System",
        level: "Advanced",
        skills: ["RTOS", "Complex Algorithms", "Performance Optimization"]
      }
    ],
    networking: {
      communities: [
        "Embedded Systems Engineers India",
        "IEEE Embedded Systems",
        "ARM Developer Community",
        "Electronics For You Community"
      ],
      tips: [
        "Build a portfolio with documented embedded projects",
        "Get hands-on experience with different microcontroller families",
        "Learn about hardware interfaces and communication protocols",
        "Stay updated with embedded industry trends and standards"
      ]
    }
  },

  "robotics-engineer": {
    title: "Robotics Engineer",
    description: "Design, build, and program robots for various applications",
    overview: {
      intro: "Robotics Engineers combine mechanical, electrical, and software skills to create autonomous or semi-autonomous machines. In India, robotics is growing in manufacturing, healthcare, agriculture, and education sectors.",
      successStories: [
        "Anjali Desai began with DIY robotics projects and now leads a team developing medical robots at a Pune-based robotics startup.",
        "Several Indian robotics engineers have joined global robotics companies or started innovative robotics ventures."
      ]
    },
    dayInLife: [
      "Design robot systems and components",
      "Program robot behaviors and movements",
      "Implement computer vision and sensor integration",
      "Test and debug robotic systems",
      "Collaborate with mechanical and electrical engineers"
    ],
    skills: {
      technical: ["C++/Python", "ROS (Robot Operating System)", "Computer Vision", "Control Systems", "Sensor Integration", "Machine Learning", "CAD Software"],
      soft: ["Problem-solving", "Creativity", "Teamwork", "Patience", "System thinking"]
    },
    courses: [
      {
        name: "Introduction to Robotics",
        level: "Beginner",
        link: "/courses?category=robotics"
      },
      {
        name: "Robot Operating System (ROS)",
        level: "Intermediate",
        link: "/courses?category=robotics"
      },
      {
        name: "Advanced Robotics and AI",
        level: "Advanced",
        link: "/courses?category=robotics"
      }
    ],
    projects: [
      {
        name: "Line Following Robot",
        level: "Beginner",
        skills: ["Basic Programming", "Sensors", "Motor Control"]
      },
      {
        name: "Robotic Arm with Computer Vision",
        level: "Intermediate",
        skills: ["Computer Vision", "Inverse Kinematics", "Control Algorithms"]
      },
      {
        name: "Autonomous Mobile Robot",
        level: "Advanced",
        skills: ["SLAM", "Path Planning", "Multi-sensor Fusion"]
      }
    ],
    networking: {
      communities: [
        "Robotics Society of India",
        "ROS India Community",
        "IEEE Robotics and Automation Society",
        "Maker Spaces with Robotics Focus"
      ],
      tips: [
        "Build robots and document your projects in detail",
        "Participate in robotics competitions like Robocon",
        "Contribute to open-source robotics projects",
        "Join robotics workshops and collaborative projects"
      ]
    }
  },

  "ar-vr-developer": {
    title: "AR/VR Developer",
    description: "Create immersive augmented and virtual reality experiences",
    overview: {
      intro: "AR/VR Developers build immersive experiences that blend digital content with the real world or create entirely virtual environments. In India, this emerging field offers opportunities in gaming, education, healthcare, real estate, and enterprise training.",
      successStories: [
        "Kiran Shah learned AR development while in college and now creates AR applications for major Indian retail brands.",
        "Several Indian AR/VR developers have founded startups focusing on immersive learning and training solutions."
      ]
    },
    dayInLife: [
      "Develop AR/VR applications using specialized platforms",
      "Create 3D models and environments",
      "Implement user interactions and experiences",
      "Optimize performance for AR/VR hardware",
      "Test usability and comfort of immersive experiences"
    ],
    skills: {
      technical: ["Unity/Unreal Engine", "C#/C++", "3D Modeling", "AR SDKs (ARCore, ARKit)", "VR SDKs (OpenXR, SteamVR)", "Computer Vision", "Spatial Computing"],
      soft: ["Creativity", "Spatial thinking", "User empathy", "Problem-solving", "Multidisciplinary collaboration"]
    },
    courses: [
      {
        name: "AR/VR Development Fundamentals",
        level: "Beginner",
        link: "/courses?category=ar-vr"
      },
      {
        name: "Interactive 3D Content Creation",
        level: "Intermediate",
        link: "/courses?category=ar-vr"
      },
      {
        name: "Advanced Immersive Experience Design",
        level: "Advanced",
        link: "/courses?category=ar-vr"
      }
    ],
    projects: [
      {
        name: "AR Product Visualization App",
        level: "Beginner",
        skills: ["AR Foundation", "3D Models", "User Interface"]
      },
      {
        name: "Interactive VR Environment",
        level: "Intermediate",
        skills: ["VR Interactions", "3D Environments", "Physics"]
      },
      {
        name: "Multi-user AR/VR Experience",
        level: "Advanced",
        skills: ["Networking", "Spatial Anchoring", "Complex Interactions"]
      }
    ],
    networking: {
      communities: [
        "ARVR Association India",
        "Unity/Unreal Engine Communities",
        "Metaverse India",
        "XR Creators India"
      ],
      tips: [
        "Create a portfolio showcasing AR/VR applications you've developed",
        "Share your work on platforms that support 3D content",
        "Attend XR (Extended Reality) meetups and conferences",
        "Follow the latest AR/VR hardware and SDK developments"
      ]
    }
  }
};

export default careerRoadmaps;