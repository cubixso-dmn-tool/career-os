import { db } from "../db.js";
import { careerOptions, careerAssessmentQuestions, careerMatchingRules } from "../../shared/schema.js";

const initialCareerOptions = [
  {
    title: "Full Stack Developer",
    category: "Software Development",
    description: "Design and develop both front-end and back-end components of web applications",
    salaryMin: 400000,
    salaryMax: 2000000,
    difficultyLevel: "Intermediate",
    requiredSkills: ["JavaScript", "HTML/CSS", "Node.js", "React", "Databases", "Git"],
    growthOutlook: "Excellent - High demand across all industries with remote work opportunities"
  },
  {
    title: "Data Scientist",
    category: "Data & AI",
    description: "Analyze complex data to derive insights and build predictive models",
    salaryMin: 600000,
    salaryMax: 3000000,
    difficultyLevel: "Advanced",
    requiredSkills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Mathematics"],
    growthOutlook: "Excellent - AI/ML boom creating massive opportunities in India and globally"
  },
  {
    title: "UI/UX Designer",
    category: "Design & Product",
    description: "Design user interfaces and experiences for digital products",
    salaryMin: 350000,
    salaryMax: 1500000,
    difficultyLevel: "Intermediate",
    requiredSkills: ["Figma", "User Research", "Prototyping", "Design Systems", "HTML/CSS", "Psychology"],
    growthOutlook: "Very Good - Growing focus on user experience across industries"
  },
  {
    title: "DevOps Engineer",
    category: "Software Development",
    description: "Manage infrastructure and deployment pipelines for applications",
    salaryMin: 500000,
    salaryMax: 2500000,
    difficultyLevel: "Advanced",
    requiredSkills: ["Docker", "Kubernetes", "AWS/Azure", "CI/CD", "Linux", "Scripting"],
    growthOutlook: "Excellent - Critical for modern software development and cloud adoption"
  },
  {
    title: "Product Manager",
    category: "Design & Product",
    description: "Define product strategy and coordinate development efforts",
    salaryMin: 800000,
    salaryMax: 4000000,
    difficultyLevel: "Advanced",
    requiredSkills: ["Product Strategy", "Analytics", "User Research", "Project Management", "Communication", "Business Acumen"],
    growthOutlook: "Excellent - High-growth startups and tech companies need strong PMs"
  },
  {
    title: "Mobile App Developer",
    category: "Software Development",
    description: "Develop native and cross-platform mobile applications",
    salaryMin: 400000,
    salaryMax: 2000000,
    difficultyLevel: "Intermediate",
    requiredSkills: ["React Native", "Flutter", "iOS/Android", "API Integration", "Mobile UI", "App Store"],
    growthOutlook: "Very Good - Mobile-first approach driving demand across sectors"
  },
  {
    title: "Cybersecurity Analyst",
    category: "Cybersecurity",
    description: "Protect organizations from cyber threats and security vulnerabilities",
    salaryMin: 450000,
    salaryMax: 2200000,
    difficultyLevel: "Advanced",
    requiredSkills: ["Network Security", "Penetration Testing", "Risk Assessment", "Security Tools", "Compliance", "Incident Response"],
    growthOutlook: "Excellent - Rising cyber threats creating urgent need for security professionals"
  },
  {
    title: "Digital Marketing Specialist",
    category: "Marketing & Growth",
    description: "Plan and execute digital marketing campaigns across multiple channels",
    salaryMin: 300000,
    salaryMax: 1200000,
    difficultyLevel: "Beginner",
    requiredSkills: ["Google Ads", "Social Media Marketing", "SEO", "Content Marketing", "Analytics", "Email Marketing"],
    growthOutlook: "Very Good - Digital transformation driving marketing spend online"
  },
  {
    title: "Cloud Architect",
    category: "Web & Cloud",
    description: "Design and implement cloud infrastructure solutions",
    salaryMin: 800000,
    salaryMax: 3500000,
    difficultyLevel: "Advanced",
    requiredSkills: ["AWS/Azure/GCP", "System Architecture", "Security", "Microservices", "Infrastructure as Code", "Cost Optimization"],
    growthOutlook: "Excellent - Cloud adoption accelerating across all business sizes"
  },
  {
    title: "Business Intelligence Developer",
    category: "Data & AI",
    description: "Build data warehouses and reporting solutions for business insights",
    salaryMin: 500000,
    salaryMax: 2000000,
    difficultyLevel: "Intermediate",
    requiredSkills: ["SQL", "ETL", "Power BI", "Tableau", "Data Warehousing", "Business Analysis"],
    growthOutlook: "Very Good - Data-driven decision making becoming standard practice"
  }
];

const assessmentQuestions = [
  {
    question: "What type of work environment do you prefer?",
    questionType: "multiple_choice",
    category: "work_style",
    options: [
      { value: "remote", label: "Remote/Work from home", weight: 1 },
      { value: "office", label: "Traditional office environment", weight: 1 },
      { value: "hybrid", label: "Mix of remote and office", weight: 1 },
      { value: "travel", label: "Travel frequently for work", weight: 1 }
    ],
    weight: 2
  },
  {
    question: "How comfortable are you with technology and learning new tools?",
    questionType: "scale",
    category: "tech_comfort",
    options: [
      { value: 1, label: "Not comfortable - prefer minimal tech use" },
      { value: 2, label: "Somewhat comfortable - basic tech skills" },
      { value: 3, label: "Comfortable - can learn new tools when needed" },
      { value: 4, label: "Very comfortable - enjoy working with technology" },
      { value: 5, label: "Expert level - love cutting-edge technology" }
    ],
    weight: 3
  },
  {
    question: "What motivates you most in your career?",
    questionType: "multiple_choice",
    category: "motivation",
    options: [
      { value: "salary", label: "High salary and financial rewards", weight: 2 },
      { value: "impact", label: "Making a positive impact on society", weight: 1 },
      { value: "creativity", label: "Creative expression and innovation", weight: 1 },
      { value: "stability", label: "Job security and stability", weight: 1 },
      { value: "growth", label: "Rapid career advancement", weight: 2 }
    ],
    weight: 3
  },
  {
    question: "Do you prefer working independently or as part of a team?",
    questionType: "multiple_choice",
    category: "work_style",
    options: [
      { value: "independent", label: "Independently - I work best alone", weight: 1 },
      { value: "small_team", label: "Small team (2-5 people)", weight: 1 },
      { value: "large_team", label: "Large team (6+ people)", weight: 1 },
      { value: "mixed", label: "Mix of both depending on the project", weight: 1 }
    ],
    weight: 2
  },
  {
    question: "What's your approach to problem-solving?",
    questionType: "multiple_choice",
    category: "problem_solving",
    options: [
      { value: "analytical", label: "Systematic and analytical approach", weight: 2 },
      { value: "creative", label: "Creative and innovative solutions", weight: 1 },
      { value: "collaborative", label: "Collaborative brainstorming", weight: 1 },
      { value: "research", label: "Research-based and data-driven", weight: 2 }
    ],
    weight: 3
  },
  {
    question: "How do you feel about continuous learning and upskilling?",
    questionType: "scale",
    category: "learning_attitude",
    options: [
      { value: 1, label: "Prefer stable skills - don't like constant change" },
      { value: 2, label: "Learn when required for job" },
      { value: 3, label: "Enjoy learning new things occasionally" },
      { value: 4, label: "Love learning - regularly upskill" },
      { value: 5, label: "Passionate learner - always exploring new technologies" }
    ],
    weight: 3
  },
  {
    question: "What type of impact do you want to have?",
    questionType: "multiple_choice",
    category: "impact",
    options: [
      { value: "products", label: "Build products used by millions", weight: 2 },
      { value: "business", label: "Drive business growth and revenue", weight: 2 },
      { value: "society", label: "Solve important social problems", weight: 1 },
      { value: "education", label: "Help others learn and grow", weight: 1 },
      { value: "innovation", label: "Pioneer new technologies", weight: 2 }
    ],
    weight: 2
  },
  {
    question: "How important is work-life balance to you?",
    questionType: "scale",
    category: "work_life_balance",
    options: [
      { value: 1, label: "Work is my priority - long hours are fine" },
      { value: 2, label: "Can work long hours when needed" },
      { value: 3, label: "Balanced approach - 40-45 hours per week" },
      { value: 4, label: "Work-life balance is important" },
      { value: 5, label: "Work-life balance is my top priority" }
    ],
    weight: 2
  }
];

export async function populateCareerOptions() {
  console.log("Populating career options and assessment questions...");
  
  try {
    // Insert career options
    let careerCount = 0;
    for (const career of initialCareerOptions) {
      const [insertedCareer] = await db
        .insert(careerOptions)
        .values(career)
        .returning();
      
      console.log(`✅ Created career option: ${career.title}`);
      careerCount++;
    }

    // Insert assessment questions
    let questionCount = 0;
    for (const question of assessmentQuestions) {
      await db
        .insert(careerAssessmentQuestions)
        .values({
          question: question.question,
          questionType: question.questionType as "multiple_choice" | "scale",
          category: question.category,
          options: question.options,
          weight: question.weight,
          isActive: true
        });
      
      console.log(`✅ Created assessment question: ${question.question.substring(0, 50)}...`);
      questionCount++;
    }

    console.log(`\n🎉 Successfully populated:`);
    console.log(`- ${careerCount} career options`);
    console.log(`- ${questionCount} assessment questions`);
    console.log(`\nThe Career Guide now has dynamic data and can provide personalized recommendations!`);

  } catch (error) {
    console.error("❌ Failed to populate career options:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateCareerOptions()
    .then(() => {
      console.log("Population script completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Population script failed:", error);
      process.exit(1);
    });
}