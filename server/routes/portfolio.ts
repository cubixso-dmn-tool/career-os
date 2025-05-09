import express, { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { 
  portfolioLinks, 
  users, 
  userProjects, 
  projects 
} from '../../shared/schema';
import { handleZodError } from '../routes';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Schema for creating/updating portfolio links
const portfolioLinkSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  isPublic: z.boolean().default(true),
  expiresAt: z.string().optional().nullable()
});

// Get all portfolio links for the authenticated user
router.get('/api/portfolio-links', async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const links = await db.select().from(portfolioLinks)
      .where(eq(portfolioLinks.userId, req.user.id))
      .orderBy(portfolioLinks.createdAt);
    
    return res.status(200).json(links);
  } catch (error) {
    console.error('Error fetching portfolio links:', error);
    return res.status(500).json({ message: 'Failed to fetch portfolio links' });
  }
});

// Create a new portfolio link
router.post('/api/portfolio-links', async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const validatedData = portfolioLinkSchema.parse(req.body);
    
    // Check if slug is already taken
    const existingLink = await db.select()
      .from(portfolioLinks)
      .where(eq(portfolioLinks.slug, validatedData.slug))
      .limit(1);
    
    if (existingLink.length > 0) {
      return res.status(400).json({ message: 'Slug is already taken' });
    }
    
    // Create the portfolio link
    const [newLink] = await db.insert(portfolioLinks)
      .values({
        userId: req.user.id,
        title: validatedData.title,
        description: validatedData.description,
        slug: validatedData.slug,
        isPublic: validatedData.isPublic,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        viewCount: 0,
      })
      .returning();
    
    return res.status(201).json(newLink);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    
    console.error('Error creating portfolio link:', error);
    return res.status(500).json({ message: 'Failed to create portfolio link' });
  }
});

// Update a portfolio link
router.patch('/api/portfolio-links/:id', async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const linkId = parseInt(req.params.id);
  if (isNaN(linkId)) {
    return res.status(400).json({ message: 'Invalid portfolio link ID' });
  }

  try {
    const validatedData = portfolioLinkSchema.partial().parse(req.body);
    
    // Check if the portfolio link exists and belongs to the user
    const existingLink = await db.select()
      .from(portfolioLinks)
      .where(and(
        eq(portfolioLinks.id, linkId),
        eq(portfolioLinks.userId, req.user.id)
      ))
      .limit(1);
    
    if (existingLink.length === 0) {
      return res.status(404).json({ message: 'Portfolio link not found' });
    }
    
    // Check if slug is being updated and is already taken
    if (validatedData.slug && validatedData.slug !== existingLink[0].slug) {
      const slugExists = await db.select()
        .from(portfolioLinks)
        .where(eq(portfolioLinks.slug, validatedData.slug))
        .limit(1);
      
      if (slugExists.length > 0) {
        return res.status(400).json({ message: 'Slug is already taken' });
      }
    }
    
    // Update the portfolio link
    const [updatedLink] = await db.update(portfolioLinks)
      .set({
        title: validatedData.title ?? existingLink[0].title,
        description: validatedData.description ?? existingLink[0].description,
        slug: validatedData.slug ?? existingLink[0].slug,
        isPublic: validatedData.isPublic ?? existingLink[0].isPublic,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : existingLink[0].expiresAt,
      })
      .where(eq(portfolioLinks.id, linkId))
      .returning();
    
    return res.status(200).json(updatedLink);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    
    console.error('Error updating portfolio link:', error);
    return res.status(500).json({ message: 'Failed to update portfolio link' });
  }
});

// Delete a portfolio link
router.delete('/api/portfolio-links/:id', async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const linkId = parseInt(req.params.id);
  if (isNaN(linkId)) {
    return res.status(400).json({ message: 'Invalid portfolio link ID' });
  }

  try {
    // Check if the portfolio link exists and belongs to the user
    const existingLink = await db.select()
      .from(portfolioLinks)
      .where(and(
        eq(portfolioLinks.id, linkId),
        eq(portfolioLinks.userId, req.user.id)
      ))
      .limit(1);
    
    if (existingLink.length === 0) {
      return res.status(404).json({ message: 'Portfolio link not found' });
    }
    
    // Delete the portfolio link
    await db.delete(portfolioLinks)
      .where(eq(portfolioLinks.id, linkId));
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting portfolio link:', error);
    return res.status(500).json({ message: 'Failed to delete portfolio link' });
  }
});

// Get a public portfolio by slug
router.get('/api/portfolio/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    // Get the portfolio link
    const portfolioLink = await db.select({
      id: portfolioLinks.id,
      userId: portfolioLinks.userId,
      title: portfolioLinks.title,
      description: portfolioLinks.description,
      slug: portfolioLinks.slug,
      isPublic: portfolioLinks.isPublic,
      viewCount: portfolioLinks.viewCount,
      createdAt: portfolioLinks.createdAt,
      expiresAt: portfolioLinks.expiresAt,
      user: {
        name: users.name,
        username: users.username,
        avatar: users.avatar
      }
    })
    .from(portfolioLinks)
    .leftJoin(users, eq(portfolioLinks.userId, users.id))
    .where(eq(portfolioLinks.slug, slug))
    .limit(1);
    
    if (portfolioLink.length === 0) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Check if portfolio is public
    if (!portfolioLink[0].isPublic) {
      // Unless it belongs to the authenticated user
      if (!req.isAuthenticated() || req.user.id !== portfolioLink[0].userId) {
        return res.status(403).json({ message: 'This portfolio is private' });
      }
    }
    
    // Check if portfolio has expired
    if (portfolioLink[0].expiresAt && new Date(portfolioLink[0].expiresAt) < new Date()) {
      return res.status(410).json({ message: 'This portfolio link has expired' });
    }
    
    // Get the user's public projects
    const userProjectsWithDetails = await db.select({
      id: userProjects.id,
      projectId: userProjects.projectId,
      progress: userProjects.progress,
      isCompleted: userProjects.isCompleted,
      isPublic: userProjects.isPublic,
      completedAt: userProjects.completedAt,
      repoUrl: userProjects.repoUrl,
      demoUrl: userProjects.demoUrl,
      description: userProjects.description,
      feedback: userProjects.feedback,
      reflection: userProjects.reflection,
      project: {
        id: projects.id,
        title: projects.title,
        description: projects.description,
        difficulty: projects.difficulty,
        skills: projects.skills,
        careerTrack: projects.careerTrack,
        thumbnail: projects.thumbnail,
      }
    })
    .from(userProjects)
    .leftJoin(projects, eq(userProjects.projectId, projects.id))
    .where(and(
      eq(userProjects.userId, portfolioLink[0].userId),
      eq(userProjects.isCompleted, true),
      eq(userProjects.isPublic, true)
    ));
    
    // Increment view count (only if not viewed by the owner)
    if (!req.isAuthenticated() || req.user.id !== portfolioLink[0].userId) {
      await db.update(portfolioLinks)
        .set({ viewCount: portfolioLink[0].viewCount + 1 })
        .where(eq(portfolioLinks.id, portfolioLink[0].id));
    }
    
    return res.status(200).json({
      portfolioLink: portfolioLink[0],
      projects: userProjectsWithDetails
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

// Update user project details (for portfolio)
router.patch('/api/user/projects/:id', async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const projectId = parseInt(req.params.id);
  if (isNaN(projectId)) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  try {
    // Schema for updating user project details
    const projectDetailsSchema = z.object({
      repoUrl: z.string().url().optional().nullable(),
      demoUrl: z.string().url().optional().nullable(),
      description: z.string().optional().nullable(),
      feedback: z.string().optional().nullable(),
      reflection: z.string().optional().nullable(),
      isPublic: z.boolean().optional(),
    });
    
    const validatedData = projectDetailsSchema.parse(req.body);
    
    // Check if the user project exists and belongs to the user
    const existingProject = await db.select()
      .from(userProjects)
      .where(and(
        eq(userProjects.id, projectId),
        eq(userProjects.userId, req.user.id)
      ))
      .limit(1);
    
    if (existingProject.length === 0) {
      return res.status(404).json({ message: 'User project not found' });
    }
    
    // Update the user project
    const [updatedProject] = await db.update(userProjects)
      .set({
        repoUrl: validatedData.repoUrl ?? existingProject[0].repoUrl,
        demoUrl: validatedData.demoUrl ?? existingProject[0].demoUrl,
        description: validatedData.description ?? existingProject[0].description,
        feedback: validatedData.feedback ?? existingProject[0].feedback,
        reflection: validatedData.reflection ?? existingProject[0].reflection,
        isPublic: validatedData.isPublic ?? existingProject[0].isPublic,
      })
      .where(eq(userProjects.id, projectId))
      .returning();
    
    return res.status(200).json(updatedProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    
    console.error('Error updating user project:', error);
    return res.status(500).json({ message: 'Failed to update user project' });
  }
});

// Get all projects for the authenticated user
router.get('/api/user/projects', async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const userProjectsList = await db.select()
      .from(userProjects)
      .where(eq(userProjects.userId, req.user.id))
      .orderBy(userProjects.startedAt);
    
    return res.status(200).json(userProjectsList);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return res.status(500).json({ message: 'Failed to fetch user projects' });
  }
});

export default router;