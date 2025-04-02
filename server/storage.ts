import {
  users, User, InsertUser,
  quizResults, QuizResult, InsertQuizResult,
  courses, Course, InsertCourse,
  enrollments, Enrollment, InsertEnrollment,
  projects, Project, InsertProject,
  userProjects, UserProject, InsertUserProject,
  softSkills, SoftSkill, InsertSoftSkill,
  userSoftSkills, UserSoftSkill, InsertUserSoftSkill,
  resumes, Resume, InsertResume,
  posts, Post, InsertPost,
  comments, Comment, InsertComment,
  achievements, Achievement, InsertAchievement,
  userAchievements, UserAchievement, InsertUserAchievement,
  events, Event, InsertEvent,
  userEvents, UserEvent, InsertUserEvent
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;

  // Quiz result operations
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  getQuizResultsByUser(userId: number): Promise<QuizResult[]>;
  createQuizResult(quizResult: InsertQuizResult): Promise<QuizResult>;

  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getFilteredCourses(category?: string, tags?: string[], isFree?: boolean): Promise<Course[]>;
  getRecommendedCourses(userId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Enrollment operations
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getEnrollmentsByUser(userId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getFilteredProjects(category?: string, difficulty?: string): Promise<Project[]>;
  getRecommendedProjects(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  // UserProject operations
  getUserProject(id: number): Promise<UserProject | undefined>;
  getUserProjectsByUser(userId: number): Promise<UserProject[]>;
  createUserProject(userProject: InsertUserProject): Promise<UserProject>;
  updateUserProject(id: number, updates: Partial<UserProject>): Promise<UserProject>;

  // SoftSkill operations
  getSoftSkill(id: number): Promise<SoftSkill | undefined>;
  getAllSoftSkills(): Promise<SoftSkill[]>;
  getFilteredSoftSkills(type?: string): Promise<SoftSkill[]>;
  createSoftSkill(softSkill: InsertSoftSkill): Promise<SoftSkill>;

  // UserSoftSkill operations
  getUserSoftSkill(id: number): Promise<UserSoftSkill | undefined>;
  getUserSoftSkillsByUser(userId: number): Promise<UserSoftSkill[]>;
  createUserSoftSkill(userSoftSkill: InsertUserSoftSkill): Promise<UserSoftSkill>;
  updateUserSoftSkill(id: number, updates: Partial<UserSoftSkill>): Promise<UserSoftSkill>;

  // Resume operations
  getResume(id: number): Promise<Resume | undefined>;
  getResumeByUser(userId: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, updates: Partial<Resume>): Promise<Resume>;

  // Post operations
  getPost(id: number): Promise<Post | undefined>;
  getAllPosts(): Promise<Post[]>;
  getRecentPosts(limit: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post>;

  // Comment operations
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsByPost(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Achievement operations
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // UserAchievement operations
  getUserAchievement(id: number): Promise<UserAchievement | undefined>;
  getUserAchievementsByUser(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;

  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // UserEvent operations
  getUserEvent(id: number): Promise<UserEvent | undefined>;
  getUserEventsByUser(userId: number): Promise<UserEvent[]>;
  createUserEvent(userEvent: InsertUserEvent): Promise<UserEvent>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private quizResults = new Map<number, QuizResult>();
  private courses = new Map<number, Course>();
  private enrollments = new Map<number, Enrollment>();
  private projects = new Map<number, Project>();
  private userProjects = new Map<number, UserProject>();
  private softSkills = new Map<number, SoftSkill>();
  private userSoftSkills = new Map<number, UserSoftSkill>();
  private resumes = new Map<number, Resume>();
  private posts = new Map<number, Post>();
  private comments = new Map<number, Comment>();
  private achievements = new Map<number, Achievement>();
  private userAchievements = new Map<number, UserAchievement>();
  private events = new Map<number, Event>();
  private userEvents = new Map<number, UserEvent>();

  private currentUserId = 1;
  private currentQuizResultId = 1;
  private currentCourseId = 1;
  private currentEnrollmentId = 1;
  private currentProjectId = 1;
  private currentUserProjectId = 1;
  private currentSoftSkillId = 1;
  private currentUserSoftSkillId = 1;
  private currentResumeId = 1;
  private currentPostId = 1;
  private currentCommentId = 1;
  private currentAchievementId = 1;
  private currentUserAchievementId = 1;
  private currentEventId = 1;
  private currentUserEventId = 1;

  constructor() {
    // Initialize with some sample data
    this.initData();
  }

  private initData() {
    // Sample user
    const user: User = {
      id: this.currentUserId++,
      username: "ananya",
      password: "password123",
      email: "ananya.s@example.com",
      name: "Ananya Singh",
      bio: "Aspiring data scientist passionate about AI and machine learning",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      createdAt: new Date()
    };
    this.users.set(user.id, user);

    // Sample courses
    const courses: Course[] = [
      {
        id: this.currentCourseId++,
        title: "Python for Data Science",
        description: "Learn Python fundamentals for data analysis and visualization",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        price: 0,
        isFree: true,
        rating: 48,
        enrolledCount: 10000,
        category: "Data Science",
        tags: ["Python", "Data Analysis", "Visualization"],
        isFeatured: true
      },
      {
        id: this.currentCourseId++,
        title: "Machine Learning Basics",
        description: "Introduction to machine learning algorithms and applications",
        thumbnail: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f",
        price: 499,
        isFree: false,
        rating: 46,
        enrolledCount: 5000,
        category: "Machine Learning",
        tags: ["Machine Learning", "Algorithms", "Data Science"],
        isFeatured: true
      },
      {
        id: this.currentCourseId++,
        title: "Statistics for Data Science",
        description: "Master statistical concepts for data analysis and inference",
        thumbnail: "https://images.unsplash.com/photo-1543286386-713bdd548da4",
        price: 899,
        isFree: false,
        rating: 45,
        enrolledCount: 3000,
        category: "Statistics",
        tags: ["Statistics", "Data Analysis", "Probability"],
        isFeatured: false
      }
    ];

    courses.forEach(course => {
      this.courses.set(course.id, course);
    });

    // Sample projects
    const projects: Project[] = [
      {
        id: this.currentProjectId++,
        title: "Predictive Analytics Dashboard",
        description: "Build a dashboard to visualize and predict trends using Python, Pandas and Matplotlib.",
        difficulty: "Beginner",
        duration: "2 weeks",
        skills: ["Python", "Data Analysis", "Visualization"],
        category: "Data Science"
      }
    ];

    projects.forEach(project => {
      this.projects.set(project.id, project);
    });

    // Sample achievements
    const achievements: Achievement[] = [
      {
        id: this.currentAchievementId++,
        title: "Fast Learner",
        description: "Completed 5 courses in 30 days",
        icon: "star",
        category: "Learning"
      },
      {
        id: this.currentAchievementId++,
        title: "Quiz Master",
        description: "Scored 90%+ on 3 assessments",
        icon: "award",
        category: "Assessment"
      },
      {
        id: this.currentAchievementId++,
        title: "Project Pioneer",
        description: "Complete your first project",
        icon: "lock",
        category: "Project"
      }
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });

    // Sample user achievements
    const userAchievements: UserAchievement[] = [
      {
        id: this.currentUserAchievementId++,
        userId: user.id,
        achievementId: 1,
        earnedAt: new Date()
      },
      {
        id: this.currentUserAchievementId++,
        userId: user.id,
        achievementId: 2,
        earnedAt: new Date()
      }
    ];

    userAchievements.forEach(userAchievement => {
      this.userAchievements.set(userAchievement.id, userAchievement);
    });

    // Sample events
    const events: Event[] = [
      {
        id: this.currentEventId++,
        title: "Career Opportunities in Data Science",
        description: "Learn about various career paths within the data science field from industry experts.",
        type: "Webinar",
        date: new Date(Date.now() + 86400000), // Tomorrow
        duration: 60,
        isRegistrationRequired: true
      },
      {
        id: this.currentEventId++,
        title: "Python for Data Analysis Bootcamp",
        description: "Hands-on workshop to master Python libraries for data analysis and visualization.",
        type: "Workshop",
        date: new Date(Date.now() + 432000000), // 5 days from now
        duration: 180,
        isRegistrationRequired: true
      },
      {
        id: this.currentEventId++,
        title: "Data Science Challenge",
        description: "Compete with other students to solve real-world data problems and win exciting prizes.",
        type: "Hackathon",
        date: new Date(Date.now() + 604800000), // 7 days from now
        duration: 480,
        isRegistrationRequired: true
      }
    ];

    events.forEach(event => {
      this.events.set(event.id, event);
    });

    // Sample quiz result
    const quizResult: QuizResult = {
      id: this.currentQuizResultId++,
      userId: user.id,
      quizType: "Career Assessment",
      result: { aptitude: 85, interests: { data: 90, programming: 80, analytics: 85 } },
      recommendedCareer: "Data Science",
      recommendedNiches: ["Machine Learning", "Python", "Data Analysis", "Statistics"],
      completedAt: new Date()
    };
    this.quizResults.set(quizResult.id, quizResult);

    // Sample posts
    const posts: Post[] = [
      {
        id: this.currentPostId++,
        userId: user.id,
        content: "Just completed the Machine Learning basics course! The capstone project was challenging but worth it. Happy to share my experience with anyone interested.",
        likes: 24,
        replies: 15,
        createdAt: new Date(Date.now() - 18000000) // 5 hours ago
      }
    ];

    posts.forEach(post => {
      this.posts.set(post.id, post);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Quiz result operations
  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    return this.quizResults.get(id);
  }

  async getQuizResultsByUser(userId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(
      (quizResult) => quizResult.userId === userId,
    );
  }

  async createQuizResult(insertQuizResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentQuizResultId++;
    const quizResult: QuizResult = { ...insertQuizResult, id, completedAt: new Date() };
    this.quizResults.set(id, quizResult);
    return quizResult;
  }

  // Course operations
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getFilteredCourses(category?: string, tags?: string[], isFree?: boolean): Promise<Course[]> {
    let filtered = Array.from(this.courses.values());
    
    if (category) {
      filtered = filtered.filter(course => course.category === category);
    }
    
    if (tags && tags.length > 0) {
      filtered = filtered.filter(course => 
        tags.some(tag => course.tags?.includes(tag))
      );
    }
    
    if (isFree !== undefined) {
      filtered = filtered.filter(course => course.isFree === isFree);
    }
    
    return filtered;
  }

  async getRecommendedCourses(userId: number): Promise<Course[]> {
    // In a real implementation, this would use the user's quiz results and other data
    // to recommend courses. For simplicity, we're just returning featured courses.
    return Array.from(this.courses.values()).filter(course => course.isFeatured);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Enrollment operations
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async getEnrollmentsByUser(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.userId === userId,
    );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const enrollment: Enrollment = { ...insertEnrollment, id, enrolledAt: new Date() };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment> {
    const enrollment = await this.getEnrollment(id);
    if (!enrollment) throw new Error("Enrollment not found");
    
    const updatedEnrollment = { ...enrollment, ...updates };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getFilteredProjects(category?: string, difficulty?: string): Promise<Project[]> {
    let filtered = Array.from(this.projects.values());
    
    if (category) {
      filtered = filtered.filter(project => project.category === category);
    }
    
    if (difficulty) {
      filtered = filtered.filter(project => project.difficulty === difficulty);
    }
    
    return filtered;
  }

  async getRecommendedProjects(userId: number): Promise<Project[]> {
    // In a real implementation, this would be based on the user's profile and progress
    // For now, just return all projects
    return this.getAllProjects();
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // UserProject operations
  async getUserProject(id: number): Promise<UserProject | undefined> {
    return this.userProjects.get(id);
  }

  async getUserProjectsByUser(userId: number): Promise<UserProject[]> {
    return Array.from(this.userProjects.values()).filter(
      (userProject) => userProject.userId === userId,
    );
  }

  async createUserProject(insertUserProject: InsertUserProject): Promise<UserProject> {
    const id = this.currentUserProjectId++;
    const userProject: UserProject = { ...insertUserProject, id, startedAt: new Date() };
    this.userProjects.set(id, userProject);
    return userProject;
  }

  async updateUserProject(id: number, updates: Partial<UserProject>): Promise<UserProject> {
    const userProject = await this.getUserProject(id);
    if (!userProject) throw new Error("User project not found");
    
    const updatedUserProject = { ...userProject, ...updates };
    this.userProjects.set(id, updatedUserProject);
    return updatedUserProject;
  }

  // SoftSkill operations
  async getSoftSkill(id: number): Promise<SoftSkill | undefined> {
    return this.softSkills.get(id);
  }

  async getAllSoftSkills(): Promise<SoftSkill[]> {
    return Array.from(this.softSkills.values());
  }

  async getFilteredSoftSkills(type?: string): Promise<SoftSkill[]> {
    let filtered = Array.from(this.softSkills.values());
    
    if (type) {
      filtered = filtered.filter(softSkill => softSkill.type === type);
    }
    
    return filtered;
  }

  async createSoftSkill(insertSoftSkill: InsertSoftSkill): Promise<SoftSkill> {
    const id = this.currentSoftSkillId++;
    const softSkill: SoftSkill = { ...insertSoftSkill, id };
    this.softSkills.set(id, softSkill);
    return softSkill;
  }

  // UserSoftSkill operations
  async getUserSoftSkill(id: number): Promise<UserSoftSkill | undefined> {
    return this.userSoftSkills.get(id);
  }

  async getUserSoftSkillsByUser(userId: number): Promise<UserSoftSkill[]> {
    return Array.from(this.userSoftSkills.values()).filter(
      (userSoftSkill) => userSoftSkill.userId === userId,
    );
  }

  async createUserSoftSkill(insertUserSoftSkill: InsertUserSoftSkill): Promise<UserSoftSkill> {
    const id = this.currentUserSoftSkillId++;
    const userSoftSkill: UserSoftSkill = { ...insertUserSoftSkill, id };
    this.userSoftSkills.set(id, userSoftSkill);
    return userSoftSkill;
  }

  async updateUserSoftSkill(id: number, updates: Partial<UserSoftSkill>): Promise<UserSoftSkill> {
    const userSoftSkill = await this.getUserSoftSkill(id);
    if (!userSoftSkill) throw new Error("User soft skill not found");
    
    const updatedUserSoftSkill = { ...userSoftSkill, ...updates };
    this.userSoftSkills.set(id, updatedUserSoftSkill);
    return updatedUserSoftSkill;
  }

  // Resume operations
  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumeByUser(userId: number): Promise<Resume | undefined> {
    return Array.from(this.resumes.values()).find(
      (resume) => resume.userId === userId,
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.currentResumeId++;
    const resume: Resume = { ...insertResume, id, updatedAt: new Date() };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, updates: Partial<Resume>): Promise<Resume> {
    const resume = await this.getResume(id);
    if (!resume) throw new Error("Resume not found");
    
    const updatedResume = { ...resume, ...updates, updatedAt: new Date() };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getRecentPosts(limit: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = { 
      ...insertPost, 
      id, 
      likes: 0, 
      replies: 0, 
      createdAt: new Date() 
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post> {
    const post = await this.getPost(id);
    if (!post) throw new Error("Post not found");
    
    const updatedPost = { ...post, ...updates };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  // Comment operations
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = { ...insertComment, id, createdAt: new Date() };
    this.comments.set(id, comment);
    
    // Update post's reply count
    const post = await this.getPost(insertComment.postId);
    if (post) {
      await this.updatePost(post.id, { replies: post.replies + 1 });
    }
    
    return comment;
  }

  // Achievement operations
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { ...insertAchievement, id };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // UserAchievement operations
  async getUserAchievement(id: number): Promise<UserAchievement | undefined> {
    return this.userAchievements.get(id);
  }

  async getUserAchievementsByUser(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      (userAchievement) => userAchievement.userId === userId,
    );
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const userAchievement: UserAchievement = { ...insertUserAchievement, id, earnedAt: new Date() };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    );
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values())
      .filter(event => event.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  // UserEvent operations
  async getUserEvent(id: number): Promise<UserEvent | undefined> {
    return this.userEvents.get(id);
  }

  async getUserEventsByUser(userId: number): Promise<UserEvent[]> {
    return Array.from(this.userEvents.values()).filter(
      (userEvent) => userEvent.userId === userId,
    );
  }

  async createUserEvent(insertUserEvent: InsertUserEvent): Promise<UserEvent> {
    const id = this.currentUserEventId++;
    const userEvent: UserEvent = { ...insertUserEvent, id, registeredAt: new Date() };
    this.userEvents.set(id, userEvent);
    return userEvent;
  }
}

export const storage = new MemStorage();
