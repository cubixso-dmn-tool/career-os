import express, { Request, Response, Router } from 'express';
import { storage } from '../storage';
import { 
  insertCourseSchema, 
  insertProjectSchema, 
  insertCommunitySchema 
} from '@shared/schema';
import { ZodError } from 'zod';
import multer from 'multer';
import { processFileUpload } from '../lib/upload-helper';
import { requireContentPermissions } from '../middleware/rbac';

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Handle Zod validation errors
 */
function handleZodError(error: ZodError, res: Response) {
  return res.status(400).json({
    message: "Validation error",
    errors: error.errors,
  });
}

/**
 * Create a new course
 */
router.post("/courses", requireContentPermissions, upload.single('thumbnail'), async (req: Request, res: Response) => {
  try {
    const { body, file } = req;
    
    console.log("Course upload - Request body:", JSON.stringify(body, null, 2));
    console.log("Course upload - File received:", file ? "Yes" : "No");
    
    // Process file if provided
    let thumbnailUrl = '';
    if (file) {
      try {
        const fileResult = await processFileUpload(file, 'courseThumbnails');
        thumbnailUrl = fileResult.url;
        console.log("Course upload - Processed thumbnail URL:", thumbnailUrl);
      } catch (fileError) {
        console.error("Course upload - Error processing file:", fileError);
      }
    }
    
    // Process tags
    let tags: string[] = [];
    if (body.tags && typeof body.tags === 'string') {
      tags = body.tags.split(',').map((tag: string) => tag.trim());
      console.log("Course upload - Processed tags:", tags);
    }
    
    // Handle price and isFree
    const isFree = body.isFree === 'true';
    const price = isFree ? 0 : (body.price ? parseFloat(body.price) : 0);
    console.log("Course upload - Price:", price, "isFree:", isFree);
    
    // Create course data object with authenticated user as creator
    // Ensure all required fields are present
    const courseData = {
      title: body.title || '',
      description: body.description || '',
      category: body.category || '',
      price,
      isFree,
      tags,
      thumbnail: thumbnailUrl || 'https://placehold.co/600x400?text=Course+Thumbnail',
      createdBy: req.user!.id,
      // Optional fields with defaults
      rating: 0,
      enrolledCount: 0,
      isFeatured: false
    };
    
    console.log("Course upload - Course data to validate:", JSON.stringify(courseData, null, 2));
    
    // Validate with Zod schema
    const validatedData = insertCourseSchema.parse(courseData);
    
    // Save to database
    const course = await storage.createCourse(validatedData);
    
    res.status(201).json(course);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Course upload - Zod Validation Errors:", JSON.stringify(error.errors, null, 2));
      return handleZodError(error, res);
    }
    console.error("Course upload - Error creating course:", error);
    res.status(500).json({ message: "Failed to create course", details: error.message });
  }
});

/**
 * Create a new project recommendation
 */
router.post("/projects", requireContentPermissions, async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    
    // Process skills list
    let skills: string[] = [];
    if (projectData.skills && typeof projectData.skills === 'string') {
      skills = projectData.skills.split(',').map((skill: string) => skill.trim());
    }
    
    // Create the project object with authenticated user as creator
    const newProject = {
      ...projectData,
      skills,
      createdBy: req.user!.id // Add the logged-in user's ID as the creator
    };
    
    // Validate with Zod schema
    const validatedData = insertProjectSchema.parse(newProject);
    
    // Save to database
    const project = await storage.createProject(validatedData);
    
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Zod Validation Errors:", JSON.stringify(error.errors, null, 2));
      return handleZodError(error, res);
    }
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
});

/**
 * Create a new community
 */
router.post("/communities", requireContentPermissions, upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'icon', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const { body } = req;
    
    // Process file uploads
    let bannerUrl = '';
    let iconUrl = '';
    
    // Cast req to any to access files property
    const reqWithFiles = req as any;
    
    if (reqWithFiles.files && reqWithFiles.files.banner && reqWithFiles.files.banner[0]) {
      const bannerResult = await processFileUpload(reqWithFiles.files.banner[0], 'communityBanners');
      bannerUrl = bannerResult.url;
    }
    
    if (reqWithFiles.files && reqWithFiles.files.icon && reqWithFiles.files.icon[0]) {
      const iconResult = await processFileUpload(reqWithFiles.files.icon[0], 'communityIcons');
      iconUrl = iconResult.url;
    }
    
    // Handle isPrivate
    const isPrivate = body.isPrivate === 'true';
    
    // Create community data object with authenticated user as creator
    const communityData = {
      name: body.name || '',
      description: body.description || '',
      isPrivate,
      rules: body.rules || null,
      banner: bannerUrl || null,
      icon: iconUrl || null,
      createdBy: req.user!.id // Add the logged-in user's ID as the creator
    };
    
    console.log("Community data to validate:", JSON.stringify(communityData, null, 2));
    
    // Validate with Zod schema
    const validatedData = insertCommunitySchema.parse(communityData);
    
    // Save to database
    const community = await storage.createCommunity(validatedData);
    
    res.status(201).json(community);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Zod Validation Errors:", JSON.stringify(error.errors, null, 2));
      return handleZodError(error, res);
    }
    console.error("Error creating community:", error);
    res.status(500).json({ message: "Failed to create community" });
  }
});

/**
 * Get courses for admin dashboard
 */
router.get("/courses", requireContentPermissions, async (_req: Request, res: Response) => {
  try {
    const courses = await storage.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

/**
 * Get projects for admin dashboard
 */
router.get("/projects", requireContentPermissions, async (_req: Request, res: Response) => {
  try {
    const projects = await storage.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

/**
 * Get communities for admin dashboard
 */
router.get("/communities", requireContentPermissions, async (_req: Request, res: Response) => {
  try {
    const communities = await storage.getAllCommunities();
    res.json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Failed to fetch communities" });
  }
});

export default router;