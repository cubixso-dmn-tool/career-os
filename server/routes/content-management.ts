import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { requirePermission } from "../middleware/rbac";
import { 
  insertCourseSchema,
  insertProjectSchema,
  insertCommunitySchema
} from "@shared/schema";
import { processUpload } from "../lib/upload-helper";
import { ZodError } from "zod";

const router = Router();

// Middleware to ensure admin permissions
const requireContentPermissions = requirePermission(["content:upload", "course:manage", "project:manage"]);

/**
 * Handle Zod validation errors
 */
function handleZodError(error: ZodError, res: Response) {
  const formattedErrors = error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }));
  
  return res.status(400).json({
    message: "Validation error",
    errors: formattedErrors
  });
}

/**
 * Create a new course
 */
router.post("/courses", requireContentPermissions, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const courseData = insertCourseSchema.parse(req.body);
    
    // Handle file upload if provided
    if (req.body.thumbnailBase64) {
      const uploadResult = await processUpload(req.body.thumbnailBase64, "course-thumbnails");
      courseData.thumbnail = uploadResult.url;
    }
    
    // Create course
    const course = await storage.createCourse({
      ...courseData,
      tags: Array.isArray(courseData.tags) ? courseData.tags : 
        (courseData.tags ? courseData.tags.split(',').map(tag => tag.trim()) : [])
    });
    
    res.status(201).json(course);
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, res);
    }
    
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
});

/**
 * Create a new project recommendation
 */
router.post("/projects", requireContentPermissions, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const projectData = insertProjectSchema.parse(req.body);
    
    // Process skills as array
    const project = await storage.createProject({
      ...projectData,
      skills: Array.isArray(projectData.skills) ? projectData.skills : 
        (projectData.skills ? projectData.skills.split(',').map(skill => skill.trim()) : [])
    });
    
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, res);
    }
    
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project recommendation" });
  }
});

/**
 * Create a new community
 */
router.post("/communities", requireContentPermissions, async (req: Request, res: Response) => {
  try {
    // Get current user ID for createdBy field
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Validate request body
    const communityData = insertCommunitySchema.parse(req.body);
    
    // Handle file uploads if provided
    if (req.body.bannerBase64) {
      const uploadResult = await processUpload(req.body.bannerBase64, "community-banners");
      communityData.banner = uploadResult.url;
    }
    
    if (req.body.iconBase64) {
      const uploadResult = await processUpload(req.body.iconBase64, "community-icons");
      communityData.icon = uploadResult.url;
    }
    
    // Create community
    const community = await storage.createCommunity({
      ...communityData,
      createdBy: userId
    });
    
    res.status(201).json(community);
  } catch (error) {
    if (error instanceof ZodError) {
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
    res.status(200).json(courses);
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
    res.status(200).json(projects);
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
    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Failed to fetch communities" });
  }
});

export default router;