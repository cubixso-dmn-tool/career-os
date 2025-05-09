import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { insertProjectSchema } from "@shared/schema";
import { requireContentPermissions } from "../middleware/rbac";
import { handleZodError } from "../routes";

const router = Router();

/**
 * Get all projects
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const careerTrack = req.query.careerTrack as string;
    const difficulty = req.query.difficulty as string;
    
    // If filters are provided, use filtered endpoint
    if (careerTrack || difficulty) {
      const projects = await storage.getFilteredProjects(
        undefined, // category - not using this filter for now
        difficulty,
        careerTrack
      );
      return res.json(projects);
    }
    
    // Otherwise get all projects
    const projects = await storage.getAllProjects();
    return res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Failed to fetch projects" });
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
    
    return res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ message: "Failed to fetch project" });
  }
});

/**
 * Get projects by career track
 */
router.get("/career-track/:trackId", async (req: Request, res: Response) => {
  try {
    const careerTrack = req.params.trackId;
    
    const projects = await storage.getFilteredProjects(
      undefined, // category
      undefined, // difficulty
      careerTrack
    );
    
    return res.json(projects);
  } catch (error) {
    console.error("Error fetching projects by career track:", error);
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
});

/**
 * Get popular projects
 */
router.get("/popular", async (req: Request, res: Response) => {
  try {
    const allProjects = await storage.getAllProjects();
    const popularProjects = allProjects.filter(project => project.isPopular === true);
    
    return res.json(popularProjects);
  } catch (error) {
    console.error("Error fetching popular projects:", error);
    return res.status(500).json({ message: "Failed to fetch popular projects" });
  }
});

/**
 * Create a new project (Admin/Content Manager only)
 */
router.post("/", requireContentPermissions, async (req: Request, res: Response) => {
  try {
    const projectData = insertProjectSchema.parse(req.body);
    
    const project = await storage.createProject(projectData);
    return res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Failed to create project" });
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
    
    const existingProject = await storage.getProject(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    const projectData = req.body;
    const project = await storage.updateProject(id, projectData);
    
    return res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Failed to update project" });
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
    
    const existingProject = await storage.getProject(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    const result = await storage.deleteProject(id);
    
    if (result) {
      return res.status(200).json({ message: "Project deleted successfully" });
    } else {
      return res.status(500).json({ message: "Failed to delete project" });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Failed to delete project" });
  }
});

export default router;