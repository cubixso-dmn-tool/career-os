import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Enhanced interfaces for AI Career Coach
export interface CareerCoachRequest {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant', content: string }>;
  userId?: number;
  coachingType: 'general' | 'interview' | 'resume' | 'learning_path';
  userProfile?: {
    currentRole?: string;
    experience?: string;
    skills?: string[];
    goals?: string[];
    education?: string;
    location?: string;
  };
  contextData?: any;
}

export interface MockInterviewRequest {
  role: string;
  experience: string;
  interviewType: 'technical' | 'behavioral' | 'system_design' | 'hr';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  companyType?: string;
  previousQuestions?: string[];
}

export interface ResumeAnalysisRequest {
  resumeText: string;
  targetRole?: string;
  targetCompany?: string;
  jobDescription?: string;
}

export interface LearningPathRequest {
  currentSkills: string[];
  targetRole: string;
  timeframe: string;
  learningStyle: 'visual' | 'hands-on' | 'theoretical' | 'mixed';
  experience: string;
}

export interface InterviewQuestion {
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'knowledge';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedDuration: string;
  hints?: string[];
  followUpQuestions?: string[];
}

export interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: {
    section: string;
    improvement: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  atsCompatibility: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  keywordOptimization: {
    missing: string[];
    present: string[];
    suggestions: string[];
  };
}

// Response interfaces
export interface CareerGuidanceResponse {
  careerSuggestions: {
    title: string;
    match: number;
    description: string;
    skills: string[];
    salary: string;
    growthProspect: string;
    educationPath: string;
    certifications: string[];
  }[];
  explanation: string;
}

export interface LearningRoadmapResponse {
  title: string;
  overview: string;
  timeEstimate: string;
  milestones: {
    title: string;
    description: string;
    resources: {
      title: string;
      type: string; // "course", "book", "video", "project", etc.
      url?: string;
      description: string;
    }[];
    timeEstimate: string;
    skillsGained: string[];
  }[];
}

/**
 * Generate personalized career recommendations based on user profile and preferences
 */
export async function generateCareerGuidance(userProfile: {
  interests: string[];
  skills: string[];
  education: string;
  experience: string;
  preferences: {
    workStyle: string;
    industry?: string;
    location?: string;
    workLifeBalance?: string;
  };
}): Promise<CareerGuidanceResponse> {
  try {
    const prompt = `
      You are an expert career counselor for Indian Gen Z students.
      Based on the following user profile, suggest 2-3 specific career paths in the tech industry that would be a good match.
      Focus on careers specific to the Indian job market and economy.
      
      User profile:
      - Interests: ${userProfile.interests.join(", ")}
      - Technical skills: ${userProfile.skills.join(", ")}
      - Education: ${userProfile.education}
      - Experience: ${userProfile.experience}
      - Work style preference: ${userProfile.preferences.workStyle}
      ${userProfile.preferences.industry ? `- Industry preference: ${userProfile.preferences.industry}` : ""}
      ${userProfile.preferences.location ? `- Location preference: ${userProfile.preferences.location}` : ""}
      ${userProfile.preferences.workLifeBalance ? `- Work-life balance preference: ${userProfile.preferences.workLifeBalance}` : ""}
      
      For each career suggestion, provide:
      1. Career title
      2. Match percentage (how well it matches their profile)
      3. Short description of the role
      4. Key skills needed
      5. Expected salary range in LPA (Lakhs Per Annum) in India
      6. Growth prospects in India over the next 5 years
      7. Recommended education path
      8. Relevant certifications valuable in India
      
      Also include a brief explanation of why these careers would be a good match for the user.
      
      Return the response in a structured JSON format with the following structure:
      {
        "careerSuggestions": [
          {
            "title": "Career Title",
            "match": match_percentage_number,
            "description": "Role description",
            "skills": ["Skill 1", "Skill 2", ...],
            "salary": "₹X-Y LPA",
            "growthProspect": "Growth description",
            "educationPath": "Education path description",
            "certifications": ["Cert 1", "Cert 2", ...]
          },
          ...
        ],
        "explanation": "Explanation text"
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }] as ChatCompletionMessageParam[],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content) as CareerGuidanceResponse;
  } catch (error: any) {
    console.error("Error generating career guidance:", error);
    throw new Error(`Failed to generate career guidance: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate a personalized learning roadmap based on career goals
 */
export async function generateLearningRoadmap(
  careerGoal: string,
  userSkills: string[],
  timeframe: string,
  learningStyle: string
): Promise<LearningRoadmapResponse> {
  try {
    const prompt = `
      You are an expert education planner specializing in tech careers for Indian students.
      Create a detailed learning roadmap for someone who wants to become a ${careerGoal}.
      
      Details about the user:
      - Current skills: ${userSkills.join(", ")}
      - Available time commitment: ${timeframe}
      - Learning style preference: ${learningStyle}
      
      Create a structured learning path that:
      1. Is tailored for the Indian tech job market
      2. Breaks down the journey into clear milestones
      3. For each milestone, suggest specific learning resources (courses, books, projects) that are accessible to Indian students
      4. Includes both technical skills and soft skills relevant to the Indian workplace
      5. Provides realistic time estimates for each milestone
      
      Return the response in a structured JSON format with the following structure:
      {
        "title": "Learning Roadmap for [Career]",
        "overview": "Brief overview of the roadmap",
        "timeEstimate": "Total time estimate",
        "milestones": [
          {
            "title": "Milestone title",
            "description": "Description of this milestone",
            "resources": [
              {
                "title": "Resource title",
                "type": "course/book/video/project",
                "url": "Optional URL",
                "description": "Why this resource is valuable"
              },
              ...
            ],
            "timeEstimate": "Time estimate for this milestone",
            "skillsGained": ["Skill 1", "Skill 2", ...]
          },
          ...
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }] as ChatCompletionMessageParam[],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content) as LearningRoadmapResponse;
  } catch (error: any) {
    console.error("Error generating learning roadmap:", error);
    throw new Error(`Failed to generate learning roadmap: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate a response for the PathFinder chatbot
 */
export async function generatePathFinderResponse(
  message: string,
  chatHistory: { role: 'user' | 'assistant', content: string }[],
  userProfile?: any
): Promise<string> {
  try {
    // Comprehensive system prompt with Indian career path data
    const systemMessage = `
      You are PathFinder, an advanced AI career guide for Indian Gen Z students.
      You provide personalized guidance about all career paths in India, not just tech.
      
      ## Your Personality
      - Professional yet friendly and conversational
      - Empathetic to the challenges faced by Indian students
      - Encouraging and supportive, recognizing students' potential
      - Informative without overwhelming, presenting information in digestible chunks
      - Tailored for Indian Gen Z students (ages 17-25)
      
      ## Special Knowledge about Indian Education & Career Landscape
      
      ### Top Educational Paths in India:
      - Engineering: IITs, NITs, BITS, and state institutions (BTech/BE, MTech, PhD)
      - Medicine: AIIMS, JIPMER, state medical colleges (MBBS, MD, MS, specializations)
      - Management: IIMs, XLRI, SP Jain, ISB (BBA, MBA, PGDM)
      - Law: NLUs, Faculty of Law Delhi, GLC Mumbai (LLB, LLM)
      - Design: NID, IDC-IIT Bombay, NIFT (Bachelor's and Master's in Design)
      - Pure Sciences: IISc, IISER, TIFR (BSc, MSc, PhD)
      - Humanities: JNU, DU, TISS (BA, MA, MPhil, PhD)
      - Commerce: SRCC, Hindu College, colleges under DU, Mumbai University (BCom, MCom, CA, CS)
      
      ### Competitive Exams:
      - Engineering: JEE Main, JEE Advanced, BITSAT, state-level entrance exams
      - Medicine: NEET-UG, NEET-PG, AIIMS entrance exam
      - Management: CAT, XAT, SNAP, MAT
      - Civil Services: UPSC CSE, state PSCs
      - Law: CLAT, AILET
      - Design: UCEED, NID Entrance, NIFT Entrance
      - Bank/SSC: SBI PO, IBPS, SSC CGL
      
      ### Emerging Career Fields in India with Future Prospects:
      - AI & Machine Learning: 12-30 LPA for specialists, growth in tech, healthcare, finance
      - Sustainable Energy: 8-20 LPA, growing rapidly with India's green initiatives
      - Digital Marketing: 5-18 LPA, essential for India's expanding e-commerce
      - Healthcare Informatics: 10-25 LPA, combining healthcare and tech expertise
      - Fintech: 10-30 LPA, India becoming global fintech hub with UPI and digital banking
      - Cybersecurity: 8-30 LPA, critical need as India digitalizes
      - Data Science: 10-25 LPA, demand across all industries
      - EdTech: 6-20 LPA, revolutionizing education delivery in India
      - Biotechnology: 6-20 LPA, emerging strongly in pharma and agriculture
      - Content Creation: 5-25 LPA, growing creator economy on YouTube, Instagram
      - AR/VR Development: 12-25 LPA, early stage but growing rapidly
      - Drone Technology: 8-18 LPA, applications in agriculture, delivery, security
      - Renewable Energy: 8-16 LPA, aligned with India's sustainability goals
      - IoT Development: 10-20 LPA, smart cities and industrial applications
      - Space Technology: 10-20 LPA, growing with ISRO's expansion and privatization
      
      ### Industry-Specific Information:
      - Provide salary information in LPA (Lakhs Per Annum) with realistic ranges for entry, mid and senior levels in India
      - Mention top Indian companies, startups, and MNCs with operations in India for each field
      - Discuss work culture expectations specific to Indian workplaces
      - Address opportunities in Tier 1 cities vs. Tier 2/3 cities
      - Include information about remote work opportunities for Indian professionals
      
      ### Education Guidance:
      - Refer to Indian education institutions and their specializations
      - Suggest courses/degrees with good ROI in the Indian context
      - Mention online platforms popular in India (upGrad, Great Learning, Coursera)
      - Recommend certifications valued by Indian employers
      - Include government initiatives like Skill India, Digital India, etc.
      
      ### Current Job Market Trends in India:
      - Discuss evolving work culture in Indian companies (hybrid models, startup culture)
      - Mention emerging job roles specific to Indian market needs
      - Address talent gaps in specific industries in India
      - Provide context on which sectors are growing vs. saturated
      - Include recent industry developments affecting career prospects
      
      ## When Responding
      - Start with a warm greeting before directly answering questions
      - Keep responses concise (max 200 words) while remaining helpful and specific
      - Include 1-2 actionable steps the student can take next
      - Use a mix of English and occasional Hindi/regional phrases when appropriate
      - Reference the user's profile data when available to personalize advice
      - End with an encouraging note or follow-up question to maintain conversation
      
      ${userProfile ? `## User Profile Data\n${JSON.stringify(userProfile, null, 2)}` : ""}
    `;

    // Format the chat history for the API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })) as ChatCompletionMessageParam[];

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7, // Slightly increased for more natural conversations
      max_tokens: 800, // Increased to allow for more detailed responses
    });

    return response.choices[0].message.content || "I don't have a specific answer for that at the moment.";
  } catch (error: any) {
    console.error("Error generating PathFinder response:", error);
    throw new Error(`Failed to generate PathFinder response: ${error.message || 'Unknown error'}`);
  }
}

/**
 * AI-Powered Career Coach - Main function for comprehensive career guidance
 */
export async function getCareerCoachResponse(request: CareerCoachRequest): Promise<string> {
  try {
    let systemPrompt = "";
    
    switch (request.coachingType) {
      case 'general':
        systemPrompt = generateGeneralCoachPrompt(request.userProfile);
        break;
      case 'interview':
        systemPrompt = generateInterviewCoachPrompt(request.userProfile);
        break;
      case 'resume':
        systemPrompt = generateResumeCoachPrompt(request.userProfile);
        break;
      case 'learning_path':
        systemPrompt = generateLearningPathPrompt(request.userProfile);
        break;
    }

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...(request.conversationHistory || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: "user", content: request.message }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "I'm having trouble processing your request right now. Please try again.";
  } catch (error: any) {
    console.error("Error in AI Career Coach:", error);
    throw new Error(`Career coaching error: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate Mock Interview Questions with AI
 */
export async function generateMockInterviewQuestions(request: MockInterviewRequest): Promise<InterviewQuestion[]> {
  try {
    const prompt = `
      You are an expert interviewer for Indian tech companies. Generate 5 challenging but fair interview questions for:
      
      Role: ${request.role}
      Experience Level: ${request.experience}
      Interview Type: ${request.interviewType}
      Difficulty: ${request.difficulty}
      ${request.companyType ? `Company Type: ${request.companyType}` : ''}
      
      For each question, provide:
      1. The actual question
      2. Question type (technical/behavioral/situational/knowledge)
      3. Difficulty level (easy/medium/hard)
      4. Expected duration for answer
      5. 2-3 helpful hints
      6. 1-2 potential follow-up questions
      
      Focus on questions commonly asked in Indian tech interviews, including:
      - Technical depth appropriate for the role and experience
      - Cultural fit questions relevant to Indian workplace
      - Problem-solving scenarios common in Indian tech companies
      - Questions about handling pressure and teamwork
      
      ${request.previousQuestions ? `Avoid repeating these questions: ${request.previousQuestions.join(', ')}` : ''}
      
      Return as JSON array with this structure:
      [
        {
          "question": "Interview question text",
          "type": "technical|behavioral|situational|knowledge",
          "difficulty": "easy|medium|hard",
          "expectedDuration": "2-3 minutes",
          "hints": ["Hint 1", "Hint 2", "Hint 3"],
          "followUpQuestions": ["Follow-up 1", "Follow-up 2"]
        }
      ]
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const content = response.choices[0].message.content || "[]";
    const result = JSON.parse(content);
    return Array.isArray(result) ? result : result.questions || [];
  } catch (error: any) {
    console.error("Error generating mock interview questions:", error);
    throw new Error(`Failed to generate interview questions: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Analyze Resume with AI and provide detailed feedback
 */
export async function analyzeResumeWithAI(request: ResumeAnalysisRequest): Promise<ResumeAnalysis> {
  try {
    const prompt = `
      You are an expert resume reviewer and career counselor specializing in the Indian job market.
      Analyze this resume and provide comprehensive feedback for improvement.
      
      Resume Content:
      ${request.resumeText}
      
      ${request.targetRole ? `Target Role: ${request.targetRole}` : ''}
      ${request.targetCompany ? `Target Company: ${request.targetCompany}` : ''}
      ${request.jobDescription ? `Job Description: ${request.jobDescription}` : ''}
      
      Provide analysis in the following areas:
      1. Overall resume score (0-100)
      2. Key strengths of the resume
      3. Major weaknesses that need improvement
      4. Specific suggestions for each section with priority levels
      5. ATS (Applicant Tracking System) compatibility analysis
      6. Keyword optimization for Indian job market
      
      Consider Indian hiring practices:
      - Format preferences of Indian recruiters
      - Skills and qualifications valued in Indian companies
      - Cultural considerations for Indian workplace
      - Industry-specific requirements in India
      
      Return as JSON with this structure:
      {
        "overallScore": 75,
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "suggestions": [
          {
            "section": "Experience",
            "improvement": "Add quantifiable achievements",
            "priority": "high"
          }
        ],
        "atsCompatibility": {
          "score": 80,
          "issues": ["Issue 1", "Issue 2"],
          "recommendations": ["Fix 1", "Fix 2"]
        },
        "keywordOptimization": {
          "missing": ["Keyword 1", "Keyword 2"],
          "present": ["Keyword 3", "Keyword 4"],
          "suggestions": ["Add this", "Emphasize that"]
        }
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content) as ResumeAnalysis;
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    throw new Error(`Resume analysis failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate Personalized Learning Path with AI
 */
export async function generatePersonalizedLearningPath(request: LearningPathRequest): Promise<LearningRoadmapResponse> {
  try {
    const prompt = `
      Create a highly personalized learning roadmap for an Indian student/professional.
      
      Current Profile:
      - Current Skills: ${request.currentSkills.join(', ')}
      - Target Role: ${request.targetRole}
      - Available Time: ${request.timeframe}
      - Learning Style: ${request.learningStyle}
      - Experience Level: ${request.experience}
      
      Design a learning path that:
      1. Bridges the gap between current skills and target role requirements
      2. Is realistic for the Indian context (available resources, typical career progression)
      3. Includes both technical and soft skills
      4. Provides milestone-based progression with clear checkpoints
      5. Suggests resources accessible to Indian learners (free and paid options)
      6. Considers the Indian job market and what employers actually look for
      
      Focus on:
      - Practical, industry-relevant skills
      - Portfolio-building projects
      - Certification and credential opportunities
      - Networking and community engagement
      - Interview preparation specific to the target role
      
      Return as JSON with this structure:
      {
        "title": "Personalized Learning Path: [Current] to [Target Role]",
        "overview": "Path overview with key focus areas",
        "timeEstimate": "Total estimated time",
        "milestones": [
          {
            "title": "Milestone name",
            "description": "What you'll accomplish",
            "resources": [
              {
                "title": "Resource name",
                "type": "course|book|project|certification",
                "url": "URL if available",
                "description": "Why this resource"
              }
            ],
            "timeEstimate": "Time for this milestone",
            "skillsGained": ["Skill 1", "Skill 2"]
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content) as LearningRoadmapResponse;
  } catch (error: any) {
    console.error("Error generating personalized learning path:", error);
    throw new Error(`Learning path generation failed: ${error.message || 'Unknown error'}`);
  }
}

// Helper functions for generating specialized coaching prompts
function generateGeneralCoachPrompt(userProfile?: any): string {
  return `
    You are an AI Career Coach specializing in Indian career development.
    You provide comprehensive career guidance including:
    - Career path exploration and recommendations
    - Skills development advice
    - Industry insights and trends
    - Salary and growth expectations
    - Work-life balance guidance
    
    Keep responses practical, encouraging, and tailored to the Indian job market.
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ''}
    
    Be conversational, supportive, and focus on actionable advice.
  `;
}

function generateInterviewCoachPrompt(userProfile?: any): string {
  return `
    You are an expert Interview Coach for Indian job seekers.
    You help with:
    - Mock interview practice and feedback
    - Common interview questions and answers
    - Technical interview preparation
    - Behavioral interview strategies
    - Company-specific interview insights
    - Salary negotiation advice
    
    Focus on Indian hiring practices and cultural expectations.
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ''}
    
    Provide detailed, actionable interview advice.
  `;
}

function generateResumeCoachPrompt(userProfile?: any): string {
  return `
    You are a Resume Writing Expert for the Indian job market.
    You help with:
    - Resume content optimization
    - ATS-friendly formatting
    - Keywords and skills highlighting
    - Achievement quantification
    - Industry-specific customization
    - Cover letter writing
    
    Focus on what Indian recruiters and ATS systems look for.
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ''}
    
    Provide specific, actionable resume improvement advice.
  `;
}

function generateLearningPathPrompt(userProfile?: any): string {
  return `
    You are a Learning Path Designer for Indian professionals and students.
    You help with:
    - Skill gap analysis
    - Personalized learning roadmaps
    - Resource recommendations (courses, books, projects)
    - Certification guidance
    - Portfolio building strategies
    - Timeline and milestone planning
    
    Focus on practical skills valued in the Indian job market.
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ''}
    
    Create detailed, step-by-step learning guidance.
  `;
}

/**
 * Generate a career assessment based on a short conversation
 * This is used for quick career recommendations without the full questionnaire
 */
export async function generateQuickCareerAssessment(
  conversation: { role: 'user' | 'assistant', content: string }[]
): Promise<CareerGuidanceResponse> {
  try {
    const systemMessage = `
      You are an expert career counselor for Indian students. Based on the conversation history,
      extract relevant information about the user's interests, skills, and preferences.
      Then suggest 2-3 specific career paths that would be a good match for them in the Indian context.
      
      Use the conversation to infer:
      - Areas of interest
      - Technical and soft skills
      - Education background (if mentioned)
      - Personality traits
      - Work style preferences
      
      For each career suggestion, provide:
      1. Career title
      2. Match percentage (how well it matches their profile)
      3. Short description of the role
      4. Key skills needed
      5. Expected salary range in LPA (Lakhs Per Annum) in India
      6. Growth prospects in India over the next 5 years
      7. Recommended education path
      8. Relevant certifications valuable in India
      
      Include a brief explanation of why these careers would be a good match for the user.
      
      Return the response in JSON format following this structure:
      {
        "careerSuggestions": [
          {
            "title": "Career Title",
            "match": match_percentage_number,
            "description": "Role description",
            "skills": ["Skill 1", "Skill 2", ...],
            "salary": "₹X-Y LPA",
            "growthProspect": "Growth description",
            "educationPath": "Education path description",
            "certifications": ["Cert 1", "Cert 2", ...]
          },
          ...
        ],
        "explanation": "Explanation text"
      }
    `;

    // Format the chat history for the API
    const formattedHistory = conversation.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })) as ChatCompletionMessageParam[];

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
      ...formattedHistory,
      { role: "user", content: "Based on our conversation, what careers would you recommend for me?" }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content) as CareerGuidanceResponse;
  } catch (error: any) {
    console.error("Error generating quick career assessment:", error);
    throw new Error(`Failed to generate career assessment: ${error.message || 'Unknown error'}`);
  }
}