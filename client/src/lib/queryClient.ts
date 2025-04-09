import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Cache key namespaces that can be used across the app
export const QueryKeys = {
  // User related queries
  USER_PROFILE: '/api/user',
  USER_ACHIEVEMENTS: (userId: number) => [`/api/users/${userId}/achievements`],
  
  // Course related queries
  COURSES: '/api/courses',
  COURSE_DETAIL: (courseId: number) => [`/api/courses/${courseId}`],
  USER_COURSES: (userId: number) => [`/api/users/${userId}/recommended-courses`],
  USER_ENROLLMENTS: (userId: number) => [`/api/users/${userId}/enrollments`],
  
  // Project related queries
  PROJECTS: '/api/projects',
  PROJECT_DETAIL: (projectId: number) => [`/api/projects/${projectId}`],
  USER_PROJECTS: (userId: number) => [`/api/users/${userId}/user-projects`],
  USER_RECOMMENDED_PROJECTS: (userId: number) => [`/api/users/${userId}/recommended-projects`],
  
  // Soft skills related queries
  SOFT_SKILLS: '/api/soft-skills',
  USER_SOFT_SKILLS: (userId: number) => [`/api/users/${userId}/user-skills`],
  
  // Resume related queries
  USER_RESUME: (userId: number) => [`/api/users/${userId}/resume`],
  
  // Community related queries
  COMMUNITIES: '/api/all-communities',
  COMMUNITIES_FOUNDED: '/api/communities/founded',
  COMMUNITY_DETAIL: (communityId: number) => [`/api/communities/${communityId}`],
  COMMUNITY_POSTS: (communityId: number) => [`/api/communities/${communityId}/posts`],
  
  // Quiz related queries
  QUIZ_RESULTS: (userId: number) => [`/api/users/${userId}/quiz-results`],
  
  // Daily Byte related queries
  DAILY_BYTES: '/api/daily-bytes'
};

// Related invalidation map helps maintain data consistency
// Format: what queries to invalidate when an action happens
export const RelatedQueryInvalidations = {
  // When a course is completed, update these queries
  COURSE_COMPLETED: (userId: number) => [
    QueryKeys.USER_ENROLLMENTS(userId),
    QueryKeys.USER_COURSES(userId),
    QueryKeys.USER_ACHIEVEMENTS, // New achievements might be unlocked
    QueryKeys.USER_PROFILE, // User stats might change
  ],
  
  // When a project is completed
  PROJECT_COMPLETED: (userId: number) => [
    QueryKeys.USER_PROJECTS(userId),
    QueryKeys.USER_RECOMMENDED_PROJECTS(userId),
    QueryKeys.USER_ACHIEVEMENTS, 
    QueryKeys.USER_PROFILE,
    QueryKeys.USER_RESUME(userId), // Resume might auto-update
  ],
  
  // When a skill is acquired
  SKILL_COMPLETED: (userId: number) => [
    QueryKeys.USER_SOFT_SKILLS(userId),
    QueryKeys.USER_PROFILE,
    QueryKeys.USER_ACHIEVEMENTS,
    QueryKeys.USER_RECOMMENDED_PROJECTS(userId),
    QueryKeys.USER_COURSES(userId)
  ],
  
  // When community content is created
  COMMUNITY_POST_CREATED: (communityId: number) => [
    QueryKeys.COMMUNITIES,
    QueryKeys.COMMUNITY_DETAIL(communityId),
    QueryKeys.COMMUNITY_POSTS(communityId)
  ]
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

interface RequestOptions {
  url: string;
  method: string;
  body?: any;
}

export async function apiRequest<T = any>(options: RequestOptions): Promise<T> {
  const { url, method, body } = options;
  
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
