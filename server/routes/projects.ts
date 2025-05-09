import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertProjectSchema, Project } from "@shared/schema";
import { ZodError } from "zod";
import { requireContentPermissions } from "../middleware/rbac";

const router = Router();

/**
 * Get all projects
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, difficulty, careerTrack } = req.query;
    let projects = await storage.getAllProjects();
    
    // Apply filters if provided
    if (category) {
      projects = projects.filter(project => project.category === category);
    }
    
    if (difficulty) {
      projects = projects.filter(project => project.difficulty.toLowerCase() === difficulty.toString().toLowerCase());
    }
    
    if (careerTrack) {
      projects = projects.filter(project => project.careerTrack === careerTrack);
    }
    
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

/**
 * Get project by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  } catch (error) {
    console.error(`Error fetching project ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
});

/**
 * Get projects by career track
 */
router.get("/career-track/:trackId", async (req: Request, res: Response) => {
  try {
    const { trackId } = req.params;
    const { difficulty } = req.query;
    
    let projects = await storage.getAllProjects();
    
    // Filter by career track
    projects = projects.filter(project => project.careerTrack === trackId);
    
    // Apply difficulty filter if provided
    if (difficulty) {
      projects = projects.filter(project => 
        project.difficulty.toLowerCase() === difficulty.toString().toLowerCase()
      );
    }
    
    res.json(projects);
  } catch (error) {
    console.error(`Error fetching projects for career track ${req.params.trackId}:`, error);
    res.status(500).json({ message: "Failed to fetch projects by career track" });
  }
});

/**
 * Get popular projects
 */
router.get("/popular", async (req: Request, res: Response) => {
  try {
    const projects = await storage.getAllProjects();
    const popularProjects = projects.filter(project => project.isPopular === true);
    res.json(popularProjects);
  } catch (error) {
    console.error("Error fetching popular projects:", error);
    res.status(500).json({ message: "Failed to fetch popular projects" });
  }
});

/**
 * Create a new project (Admin/Content Manager only)
 */
router.post("/", requireContentPermissions, async (req: Request, res: Response) => {
  try {
    const projectData = insertProjectSchema.parse(req.body);
    const newProject = await storage.createProject(projectData);
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: "Invalid project data", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Failed to create project" });
  }
});

/**
 * Update a project (Admin/Content Manager only)
 */
router.put("/:id", requireContentPermissions, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const projectData = insertProjectSchema.parse(req.body);
    const updatedProject = await storage.updateProject(id, projectData);
    
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(updatedProject);
  } catch (error) {
    console.error(`Error updating project ${req.params.id}:`, error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: "Invalid project data", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Failed to update project" });
  }
});

/**
 * Delete a project (Admin/Content Manager only)
 */
router.delete("/:id", requireContentPermissions, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const success = await storage.deleteProject(id);
    
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(`Error deleting project ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to delete project" });
  }
});

export default router;