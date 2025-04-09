import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { apiRequest, queryClient, QueryKeys, RelatedQueryInvalidations } from "@/lib/queryClient";
import { useAuth } from "./use-auth";

// Hook for integrated course interactions
export function useCourseIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id;

  // Enrollment mutation that affects multiple parts of the dashboard
  const enrollInCourseMutation = useMutation({
    mutationFn: async ({ courseId }: { courseId: number }) => {
      return await apiRequest({
        url: '/api/enrollments',
        method: 'POST',
        body: { userId, courseId }
      });
    },
    onSuccess: () => {
      // Update all related queries
      if (userId) {
        queryClient.invalidateQueries({ queryKey: QueryKeys.USER_ENROLLMENTS(userId) });
        queryClient.invalidateQueries({ queryKey: QueryKeys.USER_COURSES(userId) });
      }
      
      toast({
        title: "Successfully enrolled",
        description: "You've been enrolled in the course",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to enroll",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update course progress, which affects multiple dashboard areas
  const updateCourseProgressMutation = useMutation({
    mutationFn: async ({ 
      enrollmentId, 
      progress, 
      isCompleted = false 
    }: { 
      enrollmentId: number; 
      progress: number; 
      isCompleted?: boolean;
    }) => {
      return await apiRequest({
        url: `/api/enrollments/${enrollmentId}`,
        method: 'PATCH',
        body: { progress, isCompleted }
      });
    },
    onSuccess: (_, variables) => {
      // When a course is completed, invalidate related queries to update the dashboard
      if (variables.isCompleted && userId) {
        RelatedQueryInvalidations.COURSE_COMPLETED(userId).forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
        
        toast({
          title: "Course completed!",
          description: "Congratulations! You've completed the course.",
        });
      } else {
        // Just update enrollments if not completed
        if (userId) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.USER_ENROLLMENTS(userId) });
        }
        
        toast({
          title: "Progress saved",
          description: "Your course progress has been updated",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    enrollInCourseMutation,
    updateCourseProgressMutation
  };
}

// Hook for integrated project interactions
export function useProjectIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id;

  // Start a new project
  const startProjectMutation = useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      return await apiRequest({
        url: '/api/user-projects',
        method: 'POST',
        body: { userId, projectId }
      });
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: QueryKeys.USER_PROJECTS(userId) });
      }
      
      toast({
        title: "Project started",
        description: "You've started a new project",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to start project",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update project progress, affecting multiple dashboard areas
  const updateProjectProgressMutation = useMutation({
    mutationFn: async ({ 
      userProjectId, 
      progress, 
      isCompleted = false 
    }: { 
      userProjectId: number; 
      progress: number; 
      isCompleted?: boolean;
    }) => {
      return await apiRequest({
        url: `/api/user-projects/${userProjectId}`,
        method: 'PATCH',
        body: { progress, isCompleted }
      });
    },
    onSuccess: (_, variables) => {
      // When a project is completed, update all related dashboard sections
      if (variables.isCompleted && userId) {
        RelatedQueryInvalidations.PROJECT_COMPLETED(userId).forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
        
        toast({
          title: "Project completed!",
          description: "Congratulations! Your project has been completed and added to your portfolio.",
        });
      } else {
        // Just update projects if not completed
        if (userId) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.USER_PROJECTS(userId) });
        }
        
        toast({
          title: "Progress saved",
          description: "Your project progress has been updated",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    startProjectMutation,
    updateProjectProgressMutation
  };
}

// Hook for integrated soft skill interactions
export function useSoftSkillIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id;

  // Start learning a soft skill
  const startSoftSkillMutation = useMutation({
    mutationFn: async ({ softSkillId }: { softSkillId: number }) => {
      return await apiRequest({
        url: '/api/user-soft-skills',
        method: 'POST',
        body: { userId, softSkillId }
      });
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: QueryKeys.USER_SOFT_SKILLS(userId) });
      }
      
      toast({
        title: "Soft skill started",
        description: "You've started learning a new soft skill",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to start soft skill",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update soft skill progress
  const updateSoftSkillProgressMutation = useMutation({
    mutationFn: async ({ 
      userSoftSkillId, 
      progress, 
      isCompleted = false 
    }: { 
      userSoftSkillId: number; 
      progress: number; 
      isCompleted?: boolean;
    }) => {
      return await apiRequest({
        url: `/api/user-soft-skills/${userSoftSkillId}`,
        method: 'PATCH',
        body: { progress, isCompleted }
      });
    },
    onSuccess: (_, variables) => {
      // When a skill is completed, update all related sections in dashboard
      if (variables.isCompleted && userId) {
        RelatedQueryInvalidations.SKILL_COMPLETED(userId).forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
        
        toast({
          title: "Skill mastered!",
          description: "Congratulations! You've mastered a new soft skill.",
        });
      } else {
        // Just update skills if not completed
        if (userId) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.USER_SOFT_SKILLS(userId) });
        }
        
        toast({
          title: "Progress saved",
          description: "Your skill progress has been updated",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    startSoftSkillMutation,
    updateSoftSkillProgressMutation
  };
}

// Hook for community interactions that affect multiple dashboard elements
export function useCommunityIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id;

  // Create a new community post
  const createPostMutation = useMutation({
    mutationFn: async ({ 
      communityId, 
      title, 
      content, 
      type 
    }: { 
      communityId: number; 
      title: string; 
      content: string; 
      type: string;
    }) => {
      return await apiRequest({
        url: '/api/posts',
        method: 'POST',
        body: { 
          communityId, 
          title, 
          content, 
          type, 
          authorId: userId 
        }
      });
    },
    onSuccess: (_, variables) => {
      // Update all related community views
      RelatedQueryInvalidations.COMMUNITY_POST_CREATED(variables.communityId).forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      // Also update the user's achievements since creating posts might trigger achievements
      if (userId) {
        queryClient.invalidateQueries({ queryKey: QueryKeys.USER_ACHIEVEMENTS(userId) });
      }
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Join a community
  const joinCommunityMutation = useMutation({
    mutationFn: async ({ communityId }: { communityId: number }) => {
      return await apiRequest({
        url: `/api/communities/${communityId}/members`,
        method: 'POST',
        body: { userId, role: 'member' }
      });
    },
    onSuccess: (_, variables) => {
      // Update all community-related data
      queryClient.invalidateQueries({ queryKey: QueryKeys.COMMUNITIES });
      queryClient.invalidateQueries({ 
        queryKey: QueryKeys.COMMUNITY_DETAIL(variables.communityId)
      });
      
      toast({
        title: "Joined community",
        description: "You are now a member of this community",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to join community",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    createPostMutation,
    joinCommunityMutation
  };
}

// Hook for integrated career assessment and recommendation data
export function useCareerIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id;

  // Submit a career quiz result, affecting recommendations across the dashboard
  const submitQuizResultMutation = useMutation({
    mutationFn: async ({ 
      quizType, 
      result, 
      recommendedCareer, 
      recommendedNiches 
    }: { 
      quizType: string; 
      result: Record<string, any>; 
      recommendedCareer: string; 
      recommendedNiches: string[];
    }) => {
      return await apiRequest({
        url: '/api/quiz-results',
        method: 'POST',
        body: { 
          userId, 
          quizType, 
          result, 
          recommendedCareer, 
          recommendedNiches 
        }
      });
    },
    onSuccess: () => {
      if (userId) {
        // Update quiz results
        queryClient.invalidateQueries({ queryKey: QueryKeys.QUIZ_RESULTS(userId) });
        
        // Update recommended courses based on quiz results
        queryClient.invalidateQueries({ queryKey: QueryKeys.USER_COURSES(userId) });
        
        // Update recommended projects
        queryClient.invalidateQueries({ 
          queryKey: QueryKeys.USER_RECOMMENDED_PROJECTS(userId)
        });
        
        // Update user profile which may show career path
        queryClient.invalidateQueries({ queryKey: QueryKeys.USER_PROFILE });
      }
      
      toast({
        title: "Quiz completed",
        description: "Your career recommendations have been updated based on your responses",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save quiz results",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    submitQuizResultMutation
  };
}

// Hook for getting an integrated view of the user's progress across the platform
export function useDashboardOverview() {
  const { user } = useAuth();
  const userId = user?.id;

  // Get user enrollments
  const { data: enrollments = [] } = useQuery({
    queryKey: userId ? QueryKeys.USER_ENROLLMENTS(userId) : [],
    enabled: !!userId,
  });

  // Get user projects
  const { data: projects = [] } = useQuery({
    queryKey: userId ? QueryKeys.USER_PROJECTS(userId) : [],
    enabled: !!userId,
  });

  // Get user soft skills
  const { data: softSkills = [] } = useQuery({
    queryKey: userId ? QueryKeys.USER_SOFT_SKILLS(userId) : [],
    enabled: !!userId,
  });

  // Get user achievements
  const { data: achievements = [] } = useQuery({
    queryKey: userId ? QueryKeys.USER_ACHIEVEMENTS(userId) : [],
    enabled: !!userId,
  });

  // Get quiz results
  const { data: quizResults = [] } = useQuery({
    queryKey: userId ? QueryKeys.QUIZ_RESULTS(userId) : [],
    enabled: !!userId,
  });
  
  // Calculate overall stats
  const completedCourses = enrollments.filter(e => e.isCompleted).length;
  const completedProjects = projects.filter(p => p.isCompleted).length;
  const masteredSkills = softSkills.filter(s => s.isCompleted).length;
  const achievementCount = achievements.length;
  const hasCareerPath = quizResults.length > 0;
  
  // Overall learning progress
  const totalLearningItems = enrollments.length + projects.length + softSkills.length;
  const completedLearningItems = completedCourses + completedProjects + masteredSkills;
  const overallProgress = totalLearningItems > 0 
    ? Math.round((completedLearningItems / totalLearningItems) * 100)
    : 0;

  // Recent activities - combine everything for a timeline
  const allActivities = [
    ...enrollments.map(e => ({
      type: 'course',
      id: e.id,
      title: e.courseTitle || `Course #${e.courseId}`,
      progress: e.progress,
      isCompleted: e.isCompleted,
      date: e.enrolledAt || new Date().toISOString(),
      entityId: e.courseId
    })),
    ...projects.map(p => ({
      type: 'project',
      id: p.id,
      title: p.projectTitle || `Project #${p.projectId}`,
      progress: p.progress,
      isCompleted: p.isCompleted,
      date: p.startedAt || new Date().toISOString(),
      entityId: p.projectId
    })),
    ...softSkills.map(s => ({
      type: 'skill',
      id: s.id,
      title: s.skillTitle || `Skill #${s.softSkillId}`,
      progress: s.progress,
      isCompleted: s.isCompleted,
      date: s.startedAt || new Date().toISOString(),
      entityId: s.softSkillId
    })),
    ...achievements.map(a => ({
      type: 'achievement',
      id: a.id,
      title: a.achievementTitle || `Achievement #${a.achievementId}`,
      isCompleted: true,
      date: a.awardedAt || new Date().toISOString(),
      entityId: a.achievementId
    }))
  ];
  
  // Sort by date descending (newest first)
  const recentActivities = allActivities.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 10); // Get most recent 10 activities

  return {
    stats: {
      completedCourses,
      completedProjects,
      masteredSkills,
      achievementCount,
      hasCareerPath,
      overallProgress
    },
    recentActivities,
    enrollments,
    projects,
    softSkills,
    achievements,
    quizResults
  };
}