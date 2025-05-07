import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
export async function generateCareerGuidance(
  userProfile: {
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
  }
): Promise<CareerGuidanceResponse> {
  try {
    const prompt = `
You are an expert career advisor for Indian Gen Z students. I will provide you with a student's profile, and I'd like you to recommend suitable career paths. 
Focus on tech careers that are in high demand in India, with good growth prospects and salary potential.

Student Profile:
- Interests: ${userProfile.interests.join(', ')}
- Skills: ${userProfile.skills.join(', ')}
- Education: ${userProfile.education}
- Experience: ${userProfile.experience}
- Work Style Preference: ${userProfile.preferences.workStyle}
${userProfile.preferences.industry ? `- Preferred Industry: ${userProfile.preferences.industry}` : ''}
${userProfile.preferences.location ? `- Preferred Location: ${userProfile.preferences.location}` : ''}
${userProfile.preferences.workLifeBalance ? `- Work-Life Balance Importance: ${userProfile.preferences.workLifeBalance}` : ''}

Please provide 3 career recommendations in JSON format with the following structure:
{
  "careerSuggestions": [
    {
      "title": "Career title",
      "match": number between 0-100 representing how well it matches their profile,
      "description": "Brief description of the role",
      "skills": ["skill1", "skill2", "skill3"],
      "salary": "Salary range in LPA (Lakhs Per Annum)",
      "growthProspect": "Description of career growth prospects",
      "educationPath": "Recommended education path",
      "certifications": ["certification1", "certification2"]
    }
  ],
  "explanation": "Brief explanation of why these careers were recommended"
}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as CareerGuidanceResponse;
  } catch (error) {
    console.error("Error generating career guidance:", error);
    throw new Error("Failed to generate career recommendations");
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
You are an expert learning path creator for Indian students. Create a personalized learning roadmap for a student with the following parameters:

- Career Goal: ${careerGoal}
- Current Skills: ${userSkills.join(', ')}
- Available Timeframe: ${timeframe}
- Learning Style Preference: ${learningStyle}

Please create a structured learning roadmap specifically tailored for Indian students, with milestones and resources that are accessible in India.
Focus on practical, in-demand skills that will help them achieve their career goal.

Provide your response in JSON format with the following structure:
{
  "title": "Roadmap title",
  "overview": "Brief overview of the roadmap",
  "timeEstimate": "Total time estimate",
  "milestones": [
    {
      "title": "Milestone title",
      "description": "Description of this learning phase",
      "resources": [
        {
          "title": "Resource title",
          "type": "course/book/video/project/etc.",
          "url": "URL if applicable",
          "description": "Brief description of the resource"
        }
      ],
      "timeEstimate": "Time estimate for this milestone",
      "skillsGained": ["skill1", "skill2", "skill3"]
    }
  ]
}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as LearningRoadmapResponse;
  } catch (error) {
    console.error("Error generating learning roadmap:", error);
    throw new Error("Failed to generate learning roadmap");
  }
}

/**
 * Generate a response for the PathFinder chatbot
 */
export async function generatePathFinderResponse(
  userMessage: string,
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>,
  userProfile?: {
    name?: string;
    interests?: string[];
    education?: string;
    skills?: string[];
  }
): Promise<string> {
  try {
    // Prepare system message with context
    const systemMessage = `
You are PathFinder, an AI career guide designed specifically for Indian Gen Z students. 
Your purpose is to help students explore career options, provide guidance on skill development, and create personalized career paths.

${userProfile ? `Information about the student:
- Name: ${userProfile.name || "Unknown"}
- Interests: ${userProfile.interests?.join(", ") || "Unknown"}
- Education: ${userProfile.education || "Unknown"}
- Skills: ${userProfile.skills?.join(", ") || "Unknown"}` : ""}

Guidelines:
1. Be conversational, supportive, and encouraging.
2. Provide specific, actionable advice tailored to the Indian job market and education system.
3. Focus on tech careers and digital skills, but be open to all career paths.
4. Include specific Indian context when relevant (e.g., mention Indian companies, education institutions, industry trends in India).
5. If you don't know something specific about the Indian market, acknowledge that and provide general guidance.
6. When suggesting learning resources, prioritize those available and accessible to Indian students.
7. Be culturally sensitive and aware of the Indian education and career landscape.
8. Keep responses concise yet informative.
`;

    // Prepare complete message history
    const messages = [
      { role: "system" as const, content: systemMessage },
      ...chatHistory,
      { role: "user" as const, content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.8,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request. Please try again.";
  } catch (error) {
    console.error("Error generating PathFinder response:", error);
    throw new Error("Failed to generate a response");
  }
}