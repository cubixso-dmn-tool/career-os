import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

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
    const systemMessage = `
      You are PathFinder, an AI career guide for Indian Gen Z students interested in tech careers.
      You provide personalized guidance, support, and detailed information about tech career paths in India.
      
      Your tone is:
      - Professional but friendly and conversational
      - Encouraging and supportive
      - Informative without being overwhelming
      - Tailored for Indian Gen Z students (17-25 years old)
      
      When answering:
      - Focus on the Indian job market, education system, and tech industry
      - Provide specific, actionable advice for Indian students
      - Mention salary ranges in Lakhs Per Annum (LPA)
      - Reference Indian tech companies and education institutions when relevant
      - Suggest resources and paths accessible in India
      
      ${userProfile ? `The user's profile: ${JSON.stringify(userProfile, null, 2)}` : ""}
      
      Keep responses concise (max 150 words) while being helpful and specific.
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
      temperature: 0.5,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I don't have a specific answer for that at the moment.";
  } catch (error: any) {
    console.error("Error generating PathFinder response:", error);
    throw new Error(`Failed to generate PathFinder response: ${error.message || 'Unknown error'}`);
  }
}