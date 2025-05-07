import { TipCategory } from "@/components/ui/career-tip-tooltip";

// Define the structure of a career tip
interface CareerTip {
  id: string;
  tip: string;
  category: TipCategory;
  contexts: string[]; // Contexts where this tip is relevant
}

// Collection of career tips organized by context
const careerTips: CareerTip[] = [
  // PathFinder related tips
  {
    id: "pf-interest",
    tip: "Choose interests that genuinely excite you rather than what seems popular. Authentic interest leads to better career satisfaction in the long term.",
    category: "general",
    contexts: ["pathfinder", "questionnaire", "interests"]
  },
  {
    id: "pf-skills",
    tip: "In India's tech industry, both technical skills and communication abilities are highly valued. Consider developing both for career advancement.",
    category: "skill",
    contexts: ["pathfinder", "questionnaire", "skills"]
  },
  {
    id: "pf-education",
    tip: "While degrees are important in India, many employers now value practical skills and certifications. Consider supplementing formal education with hands-on projects.",
    category: "general",
    contexts: ["pathfinder", "questionnaire", "education"]
  },
  {
    id: "pf-career-match",
    tip: "Your top match isn't the only option! Consider exploring your second and third matches too, especially if they align with emerging job markets in India.",
    category: "general",
    contexts: ["pathfinder", "results"]
  },

  // Resume related tips
  {
    id: "resume-overview",
    tip: "Most Indian recruiters spend less than 30 seconds reviewing a resume. Make your key qualifications visible at first glance.",
    category: "resume",
    contexts: ["resume", "builder"]
  },
  {
    id: "resume-skills",
    tip: "For tech roles in India, include both technical skills (languages, frameworks) and soft skills (communication, teamwork) that are relevant to the position.",
    category: "resume",
    contexts: ["resume", "skills"]
  },
  {
    id: "resume-experience",
    tip: "When listing experience, focus on quantifiable achievements rather than just responsibilities. Numbers and metrics stand out to Indian recruiters.",
    category: "resume",
    contexts: ["resume", "experience"]
  },
  {
    id: "resume-education",
    tip: "For entry-level positions in India, education is important. Include relevant coursework, projects, and academic achievements.",
    category: "resume",
    contexts: ["resume", "education"]
  },

  // Course related tips
  {
    id: "course-selection",
    tip: "Consider how a course aligns with industry requirements in India before enrolling. Research which certificates and skills are most valued by employers.",
    category: "course",
    contexts: ["courses", "browse"]
  },
  {
    id: "course-completion",
    tip: "Completing the course is just the first step. Building a project portfolio to showcase your skills is equally important for Indian tech employers.",
    category: "course",
    contexts: ["courses", "enrolled"]
  },

  // Soft skills related tips
  {
    id: "soft-skills-importance",
    tip: "In the Indian workplace, soft skills like adaptability and teamwork are often as important as technical knowledge, especially for leadership roles.",
    category: "skill",
    contexts: ["softskills"]
  },
  {
    id: "soft-skills-communication",
    tip: "Strong English communication skills significantly improve your job prospects with multinational companies and startups in India's tech hubs.",
    category: "skill",
    contexts: ["softskills", "communication"]
  },

  // Interview related tips
  {
    id: "interview-prep",
    tip: "Research shows that candidates who research the company and prepare 5+ specific examples of past work perform better in Indian tech interviews.",
    category: "interview",
    contexts: ["career", "interview"]
  },
  {
    id: "interview-questions",
    tip: "For technical roles in India, be prepared to demonstrate problem-solving skills through coding challenges and algorithmic questions.",
    category: "interview",
    contexts: ["career", "interview", "technical"]
  },

  // Salary related tips
  {
    id: "salary-negotiation",
    tip: "In India, many tech companies expect candidates to negotiate. Research average salaries for your role, experience, and location before discussions.",
    category: "salary",
    contexts: ["career", "salary"]
  },
  {
    id: "salary-benefits",
    tip: "Beyond base salary, consider other aspects like health insurance, flexible working, and learning opportunities that are gaining importance in Indian tech companies.",
    category: "salary",
    contexts: ["career", "salary", "benefits"]
  },

  // Industry trends
  {
    id: "industry-trends",
    tip: "India's fastest growing tech sectors include AI/ML, cloud computing, cybersecurity, and fintech. Consider how your skills align with these areas.",
    category: "industry",
    contexts: ["career", "industry"]
  },
  {
    id: "industry-startups",
    tip: "India's startup ecosystem offers unique opportunities for rapid growth and responsibility early in your career compared to established companies.",
    category: "industry",
    contexts: ["career", "industry", "startups"]
  },

  // General career tips
  {
    id: "networking",
    tip: "In India's tech industry, personal connections remain valuable. Engage with professional communities both online and offline to expand your network.",
    category: "general",
    contexts: ["career", "networking"]
  },
  {
    id: "continuous-learning",
    tip: "The half-life of technical skills is shrinking. Allocate time weekly for learning new technologies to stay relevant in India's competitive job market.",
    category: "skill",
    contexts: ["career", "learning"]
  }
];

/**
 * Get a relevant career tip based on the current context
 * @param context - The current context where the tip will be displayed
 * @param secondaryContext - Optional secondary context for more specific tips
 * @returns A relevant career tip or undefined if none found
 */
export function getContextualCareerTip(
  context: string,
  secondaryContext?: string
): CareerTip | undefined {
  // Filter tips that match the primary context
  let relevantTips = careerTips.filter(tip => 
    tip.contexts.includes(context.toLowerCase())
  );
  
  // If secondary context provided, refine the results
  if (secondaryContext) {
    const refinedTips = relevantTips.filter(tip => 
      tip.contexts.includes(secondaryContext.toLowerCase())
    );
    
    // If we have refined tips, use those, otherwise keep the primary context tips
    if (refinedTips.length > 0) {
      relevantTips = refinedTips;
    }
  }
  
  // If no relevant tips found, return undefined
  if (relevantTips.length === 0) {
    return undefined;
  }
  
  // Return a random tip from the relevant ones
  return relevantTips[Math.floor(Math.random() * relevantTips.length)];
}

/**
 * Get a specific career tip by ID
 * @param tipId - The ID of the tip to retrieve
 * @returns The career tip or undefined if not found
 */
export function getCareerTipById(tipId: string): CareerTip | undefined {
  return careerTips.find(tip => tip.id === tipId);
}

/**
 * Get career tips by category
 * @param category - The category to filter by
 * @returns Array of career tips in the specified category
 */
export function getCareerTipsByCategory(category: TipCategory): CareerTip[] {
  return careerTips.filter(tip => tip.category === category);
}