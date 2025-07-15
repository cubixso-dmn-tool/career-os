import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { 
  communities, 
  communityMembers, 
  communityProjects, 
  projectCollaborators, 
  projectTasks, 
  projectUpdates, 
  projectShowcase,
  collegeEvents,
  collegeEventRegistrations,
  localEvents,
  localEventAttendees,
  users
} from '../../shared/schema';
import { eq, and, or, like, desc, asc } from 'drizzle-orm';
// Authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const router = Router();

// Get communities with enhanced filtering
router.get('/communities', isAuthenticated, async (req, res) => {
  try {
    const { interest, domain, region, communityType, search } = req.query;
    
    let query = db.select().from(communities);
    
    // Apply filters
    const conditions = [];
    
    if (interest) {
      conditions.push(like(communities.interests, `%${interest}%`));
    }
    
    if (domain) {
      conditions.push(eq(communities.domain, domain as string));
    }
    
    if (region) {
      conditions.push(eq(communities.region, region as string));
    }
    
    if (communityType) {
      conditions.push(eq(communities.communityType, communityType as string));
    }
    
    if (search) {
      conditions.push(
        or(
          like(communities.name, `%${search}%`),
          like(communities.description, `%${search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const result = await query.orderBy(desc(communities.createdAt));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// Get community projects
router.get('/community-projects', isAuthenticated, async (req, res) => {
  try {
    const { communityId, status, projectType, difficulty } = req.query;
    
    let query = db.select({
      id: communityProjects.id,
      title: communityProjects.title,
      description: communityProjects.description,
      projectType: communityProjects.projectType,
      techStack: communityProjects.techStack,
      difficulty: communityProjects.difficulty,
      estimatedDuration: communityProjects.estimatedDuration,
      maxCollaborators: communityProjects.maxCollaborators,
      currentCollaborators: communityProjects.currentCollaborators,
      status: communityProjects.status,
      isPublic: communityProjects.isPublic,
      requirements: communityProjects.requirements,
      expectedOutcome: communityProjects.expectedOutcome,
      githubRepo: communityProjects.githubRepo,
      liveDemo: communityProjects.liveDemo,
      createdAt: communityProjects.createdAt,
      creator: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar
      }
    }).from(communityProjects)
    .leftJoin(users, eq(communityProjects.createdBy, users.id));
    
    const conditions = [];
    
    if (communityId) {
      conditions.push(eq(communityProjects.communityId, parseInt(communityId as string)));
    }
    
    if (status) {
      conditions.push(eq(communityProjects.status, status as string));
    }
    
    if (projectType) {
      conditions.push(eq(communityProjects.projectType, projectType as string));
    }
    
    if (difficulty) {
      conditions.push(eq(communityProjects.difficulty, difficulty as string));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const result = await query.orderBy(desc(communityProjects.createdAt));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching community projects:', error);
    res.status(500).json({ error: 'Failed to fetch community projects' });
  }
});

// Create community project
router.post('/community-projects', isAuthenticated, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const [project] = await db.insert(communityProjects)
      .values(projectData)
      .returning();
    
    // Add creator as first collaborator
    await db.insert(projectCollaborators).values({
      projectId: project.id,
      userId: req.user.id,
      role: 'owner',
      skills: [],
      status: 'active'
    });
    
    res.json(project);
  } catch (error) {
    console.error('Error creating community project:', error);
    res.status(500).json({ error: 'Failed to create community project' });
  }
});

// Get community events (both college and local)
router.get('/community-events', isAuthenticated, async (req, res) => {
  try {
    const { eventType, category, city, state, upcoming = true } = req.query;
    
    // Get college events
    let collegeQuery = db.select({
      id: collegeEvents.id,
      title: collegeEvents.title,
      description: collegeEvents.description,
      eventType: collegeEvents.eventType,
      category: collegeEvents.category,
      college: collegeEvents.college,
      venue: collegeEvents.venue,
      city: collegeEvents.city,
      state: collegeEvents.state,
      isOnline: collegeEvents.isOnline,
      startDate: collegeEvents.startDate,
      endDate: collegeEvents.endDate,
      maxParticipants: collegeEvents.maxParticipants,
      currentParticipants: collegeEvents.currentParticipants,
      entryFee: collegeEvents.entryFee,
      prizes: collegeEvents.prizes,
      status: collegeEvents.status,
      createdAt: collegeEvents.createdAt,
      source: 'college' as const
    }).from(collegeEvents);
    
    // Get local events
    let localQuery = db.select({
      id: localEvents.id,
      title: localEvents.title,
      description: localEvents.description,
      eventType: localEvents.eventType,
      category: localEvents.category,
      college: null as any,
      venue: localEvents.venue,
      city: localEvents.city,
      state: localEvents.state,
      isOnline: false as const,
      startDate: localEvents.date,
      endDate: localEvents.date,
      maxParticipants: localEvents.maxAttendees,
      currentParticipants: localEvents.currentAttendees,
      entryFee: localEvents.entryFee,
      prizes: null as any,
      status: localEvents.status,
      createdAt: localEvents.createdAt,
      source: 'local' as const
    }).from(localEvents);
    
    const conditions = [];
    
    if (eventType) {
      conditions.push(eq(collegeEvents.eventType, eventType as string));
    }
    
    if (category) {
      conditions.push(eq(collegeEvents.category, category as string));
    }
    
    if (city) {
      conditions.push(eq(collegeEvents.city, city as string));
    }
    
    if (state) {
      conditions.push(eq(collegeEvents.state, state as string));
    }
    
    if (upcoming === 'true') {
      conditions.push(eq(collegeEvents.status, 'upcoming'));
    }
    
    if (conditions.length > 0) {
      collegeQuery = collegeQuery.where(and(...conditions));
      localQuery = localQuery.where(and(...conditions));
    }
    
    const [collegeResults, localResults] = await Promise.all([
      collegeQuery.orderBy(desc(collegeEvents.createdAt)),
      localQuery.orderBy(desc(localEvents.createdAt))
    ]);
    
    // Combine and sort results
    const allEvents = [...collegeResults, ...localResults].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json(allEvents);
  } catch (error) {
    console.error('Error fetching community events:', error);
    res.status(500).json({ error: 'Failed to fetch community events' });
  }
});

// Create college event
router.post('/college-events', isAuthenticated, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizerId: req.user.id
    };
    
    const [event] = await db.insert(collegeEvents)
      .values(eventData)
      .returning();
    
    res.json(event);
  } catch (error) {
    console.error('Error creating college event:', error);
    res.status(500).json({ error: 'Failed to create college event' });
  }
});

// Create local event
router.post('/local-events', isAuthenticated, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizerId: req.user.id
    };
    
    const [event] = await db.insert(localEvents)
      .values(eventData)
      .returning();
    
    res.json(event);
  } catch (error) {
    console.error('Error creating local event:', error);
    res.status(500).json({ error: 'Failed to create local event' });
  }
});

// Join project as collaborator
router.post('/community-projects/:id/join', isAuthenticated, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { role = 'contributor', skills = [] } = req.body;
    
    // Check if user is already a collaborator
    const existingCollaborator = await db.select()
      .from(projectCollaborators)
      .where(
        and(
          eq(projectCollaborators.projectId, projectId),
          eq(projectCollaborators.userId, req.user.id)
        )
      );
    
    if (existingCollaborator.length > 0) {
      return res.status(400).json({ error: 'Already a collaborator on this project' });
    }
    
    // Check if project has space
    const [project] = await db.select()
      .from(communityProjects)
      .where(eq(communityProjects.id, projectId));
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.currentCollaborators >= project.maxCollaborators) {
      return res.status(400).json({ error: 'Project is full' });
    }
    
    // Add collaborator
    const [collaborator] = await db.insert(projectCollaborators)
      .values({
        projectId,
        userId: req.user.id,
        role,
        skills,
        status: 'active'
      })
      .returning();
    
    // Update project collaborator count
    await db.update(communityProjects)
      .set({ currentCollaborators: project.currentCollaborators + 1 })
      .where(eq(communityProjects.id, projectId));
    
    res.json(collaborator);
  } catch (error) {
    console.error('Error joining project:', error);
    res.status(500).json({ error: 'Failed to join project' });
  }
});

// Register for event
router.post('/events/:id/register', isAuthenticated, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { eventType, ...registrationData } = req.body;
    
    if (eventType === 'college') {
      // Register for college event
      const [registration] = await db.insert(collegeEventRegistrations)
        .values({
          eventId,
          userId: req.user.id,
          ...registrationData
        })
        .returning();
      
      // Update participant count
      await db.update(collegeEvents)
        .set({ 
          currentParticipants: db.select().from(collegeEvents).where(eq(collegeEvents.id, eventId))
        })
        .where(eq(collegeEvents.id, eventId));
      
      res.json(registration);
    } else {
      // Register for local event
      const [registration] = await db.insert(localEventAttendees)
        .values({
          eventId,
          userId: req.user.id,
          ...registrationData
        })
        .returning();
      
      res.json(registration);
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

// Get project tasks
router.get('/community-projects/:id/tasks', isAuthenticated, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const tasks = await db.select({
      id: projectTasks.id,
      title: projectTasks.title,
      description: projectTasks.description,
      priority: projectTasks.priority,
      status: projectTasks.status,
      category: projectTasks.category,
      estimatedHours: projectTasks.estimatedHours,
      actualHours: projectTasks.actualHours,
      dueDate: projectTasks.dueDate,
      completedAt: projectTasks.completedAt,
      createdAt: projectTasks.createdAt,
      assignedTo: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar
      }
    }).from(projectTasks)
    .leftJoin(users, eq(projectTasks.assignedTo, users.id))
    .where(eq(projectTasks.projectId, projectId))
    .orderBy(desc(projectTasks.createdAt));
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({ error: 'Failed to fetch project tasks' });
  }
});

// Create project task
router.post('/community-projects/:id/tasks', isAuthenticated, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const taskData = {
      ...req.body,
      projectId,
      createdBy: req.user.id
    };
    
    const [task] = await db.insert(projectTasks)
      .values(taskData)
      .returning();
    
    res.json(task);
  } catch (error) {
    console.error('Error creating project task:', error);
    res.status(500).json({ error: 'Failed to create project task' });
  }
});

// Get project updates
router.get('/community-projects/:id/updates', isAuthenticated, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const updates = await db.select({
      id: projectUpdates.id,
      updateType: projectUpdates.updateType,
      title: projectUpdates.title,
      content: projectUpdates.content,
      attachments: projectUpdates.attachments,
      isImportant: projectUpdates.isImportant,
      createdAt: projectUpdates.createdAt,
      user: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar
      }
    }).from(projectUpdates)
    .leftJoin(users, eq(projectUpdates.userId, users.id))
    .where(eq(projectUpdates.projectId, projectId))
    .orderBy(desc(projectUpdates.createdAt));
    
    res.json(updates);
  } catch (error) {
    console.error('Error fetching project updates:', error);
    res.status(500).json({ error: 'Failed to fetch project updates' });
  }
});

// Create project update
router.post('/community-projects/:id/updates', isAuthenticated, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const updateData = {
      ...req.body,
      projectId,
      userId: req.user.id
    };
    
    const [update] = await db.insert(projectUpdates)
      .values(updateData)
      .returning();
    
    res.json(update);
  } catch (error) {
    console.error('Error creating project update:', error);
    res.status(500).json({ error: 'Failed to create project update' });
  }
});

// Get project showcase
router.get('/community-projects/:id/showcase', isAuthenticated, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const showcase = await db.select({
      id: projectShowcase.id,
      title: projectShowcase.title,
      description: projectShowcase.description,
      screenshots: projectShowcase.screenshots,
      videoDemo: projectShowcase.videoDemo,
      liveUrl: projectShowcase.liveUrl,
      githubUrl: projectShowcase.githubUrl,
      techStack: projectShowcase.techStack,
      challenges: projectShowcase.challenges,
      learnings: projectShowcase.learnings,
      futureEnhancements: projectShowcase.futureEnhancements,
      isPublic: projectShowcase.isPublic,
      isFeatured: projectShowcase.isFeatured,
      views: projectShowcase.views,
      likes: projectShowcase.likes,
      createdAt: projectShowcase.createdAt,
      user: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar
      }
    }).from(projectShowcase)
    .leftJoin(users, eq(projectShowcase.userId, users.id))
    .where(eq(projectShowcase.projectId, projectId));
    
    res.json(showcase);
  } catch (error) {
    console.error('Error fetching project showcase:', error);
    res.status(500).json({ error: 'Failed to fetch project showcase' });
  }
});

// Create project showcase
router.post('/community-projects/:id/showcase', isAuthenticated, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const showcaseData = {
      ...req.body,
      projectId,
      userId: req.user.id
    };
    
    const [showcase] = await db.insert(projectShowcase)
      .values(showcaseData)
      .returning();
    
    res.json(showcase);
  } catch (error) {
    console.error('Error creating project showcase:', error);
    res.status(500).json({ error: 'Failed to create project showcase' });
  }
});

export default router;