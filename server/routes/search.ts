import { Router } from "express";
import { storage } from "../simple-storage.js";
import { sql } from "drizzle-orm";
import { Course, Project, CollegeEvent } from '../../shared/schema.js';

const router = Router();

// Simple auth check middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Universal search across all content types
router.get("/", requireAuth, async (req, res) => {
  try {
    const { q, type, limit = 10 } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: "Search query is required" });
    }

    const results: {
      courses: Course[];
      projects: Project[];
      posts: any[]; // Assuming posts and users are not part of the current error, keeping as any for now
      users: any[];
      events: CollegeEvent[];
    } = {
      courses: [],
      projects: [],
      posts: [],
      users: [],
      events: []
    };

    // Search courses
    if (!type || type === 'courses') {
      const courses = await storage.getFilteredCourses();
      results.courses = courses
        .filter(course => 
          course.title.toLowerCase().includes(q.toLowerCase()) ||
          course.description.toLowerCase().includes(q.toLowerCase()) ||
          course.category.toLowerCase().includes(q.toLowerCase())
        )
        .slice(0, parseInt(limit as string));
    }

    // Search projects
    if (!type || type === 'projects') {
      const projects = await storage.getAllProjects();
      results.projects = projects
        .filter(project => 
          project.title.toLowerCase().includes(q.toLowerCase()) ||
          project.description.toLowerCase().includes(q.toLowerCase()) ||
          project.category.toLowerCase().includes(q.toLowerCase())
        )
        .slice(0, parseInt(limit as string));
    }

    // Search events
    if (!type || type === 'events') {
      // const events = await storage.getAllEvents();
      // results.events = events.filter(event => 
      //     event.title.toLowerCase().includes(q.toLowerCase()) ||
      //     event.description.toLowerCase().includes(q.toLowerCase())
      //   ).map(event => ({
      //     id: event.id,
      //     date: event.date,
      //     title: event.title,
      //     type: event.type,
      //     description: event.description,
      //     duration: event.duration,
      //     isRegistrationRequired: event.isRegistrationRequired,
      //   }));
    }

    res.json(results);
  } catch (error) {
    console.error("Error performing search:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

// Advanced filtering for courses
router.get("/courses", requireAuth, async (req, res) => {
  try {
    const { category, tags, price, rating, difficulty } = req.query;
    
    const tagArray = tags ? (tags as string).split(',') : undefined;
    const isFree = price === 'free' ? true : price === 'paid' ? false : undefined;
    
    const courses = await storage.getFilteredCourses(
      category as string | undefined,
      tagArray,
      isFree
    );

    // Additional filtering
    let filteredCourses = courses;
    
    if (rating) {
      const minRating = parseInt(rating as string);
      filteredCourses = filteredCourses.filter(course => 
        course.rating && course.rating >= minRating
      );
    }

    res.json(filteredCourses);
  } catch (error) {
    console.error("Error filtering courses:", error);
    res.status(500).json({ error: "Course filtering failed" });
  }
});

// Advanced filtering for projects
router.get("/projects", requireAuth, async (req, res) => {
  try {
    const { category, difficulty, skills } = req.query;
    
    const projects = await storage.getFilteredProjects(
      category as string | undefined,
      difficulty as string | undefined
    );

    res.json(projects);
  } catch (error) {
    console.error("Error filtering projects:", error);
    res.status(500).json({ error: "Project filtering failed" });
  }
});

export default router;