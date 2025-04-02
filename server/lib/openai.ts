import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

/**
 * Handles PathFinder chatbot conversations
 * @param userMessage The user's current message
 * @param conversationHistory Previous messages in the conversation
 * @param careerPath Optional career path if already determined
 * @returns AI response message
 */
export async function chatWithPathFinder(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }> = [],
  careerPath?: string
) {
  try {
    // If OpenAI API key is not available, return a friendly message
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found. Cannot process chatbot request.");
      return "I'm having trouble connecting to my knowledge base. Please try again later.";
    }

    // Build system prompt based on whether career path is determined
    let systemPrompt = `You are PathFinder, an AI career guide for Indian Gen Z students. 
    You provide friendly, encouraging guidance to help students discover and explore career paths.
    Your responses should be concise, informal yet professional, and tailored for Indian students.
    Focus on actionable advice relevant to the Indian education system and job market.`;

    // Add career-specific context if a path is already chosen
    if (careerPath) {
      systemPrompt += `\n\nThe student has shown interest in ${careerPath}. 
      Provide specific information about education paths, skills needed, job opportunities in India, 
      and resources to learn more. Be encouraging but realistic about the career prospects.`;
    }

    // Start with system message
    const messages = [{ role: "system", content: systemPrompt }];

    // Add conversation history
    if (conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current user message
    messages.push({ role: "user", content: userMessage });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm not sure how to respond to that. Could you try asking something else?";
  } catch (error) {
    console.error("Error in PathFinder chat:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}

/**
 * Generates career recommendations based on quiz answers
 * @param answers Array of user answers from career quiz
 * @returns Object containing career recommendations
 */
export async function generateCareerRecommendations(answers: { questionId: number; answerId: string }[]) {
  try {
    // If OpenAI API key is not available, return mock data
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found. Using mock recommendations.");
      return getMockRecommendations();
    }

    const prompt = `
      Based on the following career assessment quiz answers, recommend an ideal career path and specific niche areas for an Indian student:
      
      Questions and Answers:
      ${answers.map(a => `Question ID: ${a.questionId}, Answer: ${a.answerId}`).join('\n')}
      
      Please analyze these responses and provide recommendations in JSON format with the following structure:
      {
        "career": "Recommended career path",
        "match": "Percentage match (number between 75-99)",
        "reasoning": "Brief explanation of why this career matches",
        "niches": ["Niche 1", "Niche 2", "Niche 3", "Niche 4"],
        "skills_to_develop": ["Skill 1", "Skill 2", "Skill 3"]
      }
      
      Focus on technology and emerging fields in the Indian job market. The career should be specific (e.g., "Data Science" rather than just "Technology").
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      career: result.career || "Data Science",
      match: result.match || 95,
      reasoning: result.reasoning || "Based on your analytical and problem-solving aptitude",
      niches: result.niches || ["Machine Learning", "Python", "Data Analysis", "Statistics"],
      skills_to_develop: result.skills_to_develop || ["Python Programming", "Statistical Analysis", "Machine Learning Algorithms"]
    };
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    return getMockRecommendations();
  }
}

/**
 * Analyzes student project submission and provides feedback
 * @param projectDescription Description of the project
 * @param submission Student's project submission
 * @returns Object containing feedback and suggestions
 */
export async function analyzeProjectSubmission(projectDescription: string, submission: string) {
  try {
    // If OpenAI API key is not available, return mock data
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found. Using mock feedback.");
      return getMockProjectFeedback();
    }

    const prompt = `
      You are an expert mentor evaluating a student's project submission. 
      
      Project Description:
      ${projectDescription}
      
      Student Submission:
      ${submission}
      
      Please evaluate the submission and provide feedback in JSON format with the following structure:
      {
        "overall_score": "Score out of 10",
        "strengths": ["Strength 1", "Strength 2"],
        "areas_for_improvement": ["Area 1", "Area 2"],
        "specific_feedback": "Detailed feedback including technical aspects",
        "next_steps": ["Suggestion 1", "Suggestion 2"]
      }
      
      Be constructive, specific, and actionable in your feedback. Focus on both technical correctness and good practices.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error analyzing project submission:", error);
    return getMockProjectFeedback();
  }
}

/**
 * Generates personalized learning plan based on student profile and career goals
 * @param profile Student profile information
 * @param careerGoal Desired career path
 * @returns Object containing personalized learning plan
 */
export async function generateLearningPlan(profile: any, careerGoal: string) {
  try {
    // If OpenAI API key is not available, return mock data
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found. Using mock learning plan.");
      return getMockLearningPlan();
    }

    const prompt = `
      You are an expert career counselor creating a personalized learning plan for an Indian student.
      
      Student Profile:
      ${JSON.stringify(profile)}
      
      Career Goal: ${careerGoal}
      
      Please create a detailed learning plan in JSON format with the following structure:
      {
        "short_term_goals": [
          {"timeframe": "1-3 months", "goals": ["Goal 1", "Goal 2"]}
        ],
        "medium_term_goals": [
          {"timeframe": "3-6 months", "goals": ["Goal 1", "Goal 2"]}
        ],
        "long_term_goals": [
          {"timeframe": "6-12 months", "goals": ["Goal 1", "Goal 2"]}
        ],
        "recommended_courses": [
          {"title": "Course Title", "priority": "High/Medium/Low", "type": "Technical/Soft Skill"}
        ],
        "skill_development": [
          {"skill": "Skill Name", "resources": ["Resource 1", "Resource 2"]}
        ],
        "milestones": [
          {"description": "Milestone description", "timeframe": "When to achieve"}
        ]
      }
      
      Make the plan specific, actionable, and tailored to the Indian education and job market.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating learning plan:", error);
    return getMockLearningPlan();
  }
}

/**
 * Generates interview questions based on job description and student profile
 * @param jobDescription Job description
 * @param studentProfile Student profile information
 * @returns Object containing interview questions and tips
 */
export async function generateInterviewQuestions(jobDescription: string, studentProfile: any) {
  try {
    // If OpenAI API key is not available, return mock data
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found. Using mock interview questions.");
      return getMockInterviewQuestions();
    }

    const prompt = `
      You are an experienced technical interviewer helping a student prepare for a job interview.
      
      Job Description:
      ${jobDescription}
      
      Student Profile:
      ${JSON.stringify(studentProfile)}
      
      Generate a set of likely interview questions for this position in JSON format with the following structure:
      {
        "technical_questions": [
          {"question": "Question text", "tips": "Tips for answering", "difficulty": "Easy/Medium/Hard"}
        ],
        "behavioral_questions": [
          {"question": "Question text", "tips": "Tips for answering"}
        ],
        "company_specific_questions": [
          {"question": "Question text", "tips": "Tips for answering"}
        ],
        "questions_to_ask_interviewer": [
          "Question 1", "Question 2"
        ],
        "preparation_tips": [
          "Tip 1", "Tip 2"
        ]
      }
      
      Focus on questions that are commonly asked in Indian tech companies for entry to mid-level positions.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return getMockInterviewQuestions();
  }
}

/**
 * Analyzes resume and provides improvement suggestions
 * @param resumeText Resume content
 * @param jobDescription Optional job description to tailor feedback
 * @returns Object containing resume feedback and suggestions
 */
export async function analyzeResume(resumeText: string, jobDescription?: string) {
  try {
    // If OpenAI API key is not available, return mock data
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found. Using mock resume analysis.");
      return getMockResumeAnalysis();
    }

    const prompt = `
      You are a professional resume reviewer helping an Indian student improve their resume.
      
      Resume:
      ${resumeText}
      
      ${jobDescription ? `Job Description:\n${jobDescription}` : ''}
      
      Please analyze this resume and provide feedback in JSON format with the following structure:
      {
        "overall_score": "Score out of 10",
        "ats_compatibility": "Score out of 10",
        "strengths": ["Strength 1", "Strength 2"],
        "areas_for_improvement": ["Area 1", "Area 2"],
        "section_feedback": {
          "header": "Feedback on the header section",
          "education": "Feedback on education section",
          "experience": "Feedback on experience section",
          "skills": "Feedback on skills section",
          "projects": "Feedback on projects section"
        },
        "formatting_suggestions": ["Suggestion 1", "Suggestion 2"],
        "content_suggestions": ["Suggestion 1", "Suggestion 2"],
        "keywords_to_add": ["Keyword 1", "Keyword 2"]
      }
      
      Provide specific, actionable advice tailored to the Indian job market.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return getMockResumeAnalysis();
  }
}

// Mock data functions for fallback

function getMockRecommendations() {
  return {
    career: "Data Science",
    match: 95,
    reasoning: "Based on your analytical and problem-solving aptitude",
    niches: ["Machine Learning", "Python", "Data Analysis", "Statistics"],
    skills_to_develop: ["Python Programming", "Statistical Analysis", "Machine Learning Algorithms"]
  };
}

function getMockProjectFeedback() {
  return {
    overall_score: 8,
    strengths: [
      "Good code organization and structure",
      "Effective use of data visualization techniques"
    ],
    areas_for_improvement: [
      "Add more comprehensive error handling",
      "Include unit tests for critical functions"
    ],
    specific_feedback: "Your project demonstrates a solid understanding of data analysis principles. The visualization choices effectively communicate the insights from the data. Consider adding more detailed comments and documentation to make your code more maintainable.",
    next_steps: [
      "Implement the suggested error handling improvements",
      "Add unit tests for the data processing functions",
      "Consider expanding the analysis to include trend predictions"
    ]
  };
}

function getMockLearningPlan() {
  return {
    short_term_goals: [
      {
        timeframe: "1-3 months",
        goals: [
          "Complete Python fundamentals course",
          "Build 2 basic data analysis projects",
          "Learn SQL basics"
        ]
      }
    ],
    medium_term_goals: [
      {
        timeframe: "3-6 months",
        goals: [
          "Complete machine learning fundamentals course",
          "Build a prediction model project",
          "Learn data visualization techniques"
        ]
      }
    ],
    long_term_goals: [
      {
        timeframe: "6-12 months",
        goals: [
          "Complete advanced machine learning specialization",
          "Build an end-to-end ML project for portfolio",
          "Prepare for and pass a data science certification"
        ]
      }
    ],
    recommended_courses: [
      {
        title: "Python for Data Science and Machine Learning",
        priority: "High",
        type: "Technical"
      },
      {
        title: "SQL for Data Analysis",
        priority: "Medium",
        type: "Technical"
      },
      {
        title: "Business Communication Skills",
        priority: "Medium",
        type: "Soft Skill"
      }
    ],
    skill_development: [
      {
        skill: "Python Programming",
        resources: ["Codecademy Python Course", "HackerRank Python Challenges"]
      },
      {
        skill: "Data Visualization",
        resources: ["Matplotlib & Seaborn Documentation", "Tableau Public"]
      }
    ],
    milestones: [
      {
        description: "Complete first data analysis project",
        timeframe: "2 months"
      },
      {
        description: "Build machine learning model with 80%+ accuracy",
        timeframe: "5 months"
      }
    ]
  };
}

function getMockInterviewQuestions() {
  return {
    technical_questions: [
      {
        question: "Explain the difference between supervised and unsupervised learning with examples.",
        tips: "Focus on core differences, provide clear examples, and mention when each is appropriate to use.",
        difficulty: "Medium"
      },
      {
        question: "How would you handle missing data in a dataset?",
        tips: "Discuss multiple approaches (deletion, imputation) and their pros/cons in different scenarios.",
        difficulty: "Medium"
      },
      {
        question: "Write a function to remove duplicates from an array without using built-in methods.",
        tips: "Think about time complexity. Mention both hash-based and two-pointer approaches.",
        difficulty: "Hard"
      }
    ],
    behavioral_questions: [
      {
        question: "Tell me about a challenging data project you worked on and how you overcame obstacles.",
        tips: "Use the STAR method (Situation, Task, Action, Result). Focus on your specific contributions."
      },
      {
        question: "How do you stay updated with the latest developments in data science?",
        tips: "Mention specific resources, communities, and habits that demonstrate continuous learning."
      }
    ],
    company_specific_questions: [
      {
        question: "How would you improve our recommendation system based on the available user data?",
        tips: "Research the company's products beforehand. Balance technical knowledge with business understanding."
      }
    ],
    questions_to_ask_interviewer: [
      "What kind of projects would I be working on in the first 3-6 months?",
      "How does the team measure success for this role?",
      "What are the biggest challenges facing the data science team right now?"
    ],
    preparation_tips: [
      "Review basic statistics concepts (mean, median, standard deviation, probability distributions)",
      "Practice implementing common ML algorithms from scratch",
      "Prepare 2-3 strong examples of your data projects to discuss in detail"
    ]
  };
}

function getMockResumeAnalysis() {
  return {
    overall_score: 7,
    ats_compatibility: 6,
    strengths: [
      "Good use of action verbs in experience section",
      "Clear education credentials with relevant coursework",
      "Solid technical skills section"
    ],
    areas_for_improvement: [
      "Lacks quantifiable achievements",
      "Not enough industry keywords for ATS systems",
      "Project descriptions are too general"
    ],
    section_feedback: {
      header: "Contact information is complete, but consider adding LinkedIn profile and GitHub links.",
      education: "Education section is well structured. Consider adding GPA if it's above 3.5.",
      experience: "Experience bullet points need more metrics and results. Focus on what you achieved, not just what you did.",
      skills: "Good range of technical skills, but organize them by proficiency level and relevance to target role.",
      projects: "Project descriptions lack technical depth. Explain technologies used and your specific contributions."
    },
    formatting_suggestions: [
      "Use consistent bullet point formatting throughout",
      "Ensure adequate white space for readability",
      "Limit resume to 1 page for entry-level positions"
    ],
    content_suggestions: [
      "Add metrics to quantify achievements (e.g., 'improved efficiency by 25%')",
      "Include relevant coursework or certifications for fresh graduates",
      "Tailor skills section to match job description keywords"
    ],
    keywords_to_add: [
      "Data analysis",
      "Machine learning",
      "Python",
      "SQL",
      "Tableau",
      "Problem-solving"
    ]
  };
}
