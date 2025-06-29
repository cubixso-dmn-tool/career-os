import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { validateFileUpload } from "../middleware/validation";

const router = Router();

// Simple auth check middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'server/public/uploads');
const profileDir = path.join(uploadDir, 'profiles');
const projectDir = path.join(uploadDir, 'projects');
const resumeDir = path.join(uploadDir, 'resumes');

[uploadDir, profileDir, projectDir, resumeDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationDir = uploadDir;
    
    if (req.route.path.includes('profile')) {
      destinationDir = profileDir;
    } else if (req.route.path.includes('project')) {
      destinationDir = projectDir;
    } else if (req.route.path.includes('resume')) {
      destinationDir = resumeDir;
    }
    
    cb(null, destinationDir);
  },
  filename: (req: any, file, cb) => {
    const userId = req.user?.id || 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    
    const filename = `${userId}_${timestamp}_${baseName}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Profile image upload
router.post('/profile-image', 
  requireAuth,
  upload.single('profileImage'),
  validateFileUpload(['image/jpeg', 'image/png', 'image/webp'], 5 * 1024 * 1024),
  async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/profiles/${req.file.filename}`;
      
      res.json({
        message: "Profile image uploaded successfully",
        fileUrl,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error("Profile image upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// Project files upload (multiple files)
router.post('/project-files',
  requireAuth,
  upload.array('projectFiles', 5),
  validateFileUpload([
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf',
    'text/plain', 'text/markdown',
    'application/zip',
    'video/mp4', 'video/webm'
  ], 25 * 1024 * 1024),
  async (req: any, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadedFiles = req.files.map((file: any) => ({
        fileName: file.filename,
        originalName: file.originalname,
        fileUrl: `/uploads/projects/${file.filename}`,
        size: file.size,
        mimeType: file.mimetype
      }));

      res.json({
        message: "Project files uploaded successfully",
        files: uploadedFiles,
        count: uploadedFiles.length
      });
    } catch (error) {
      console.error("Project files upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// Resume upload
router.post('/resume',
  requireAuth,
  upload.single('resume'),
  validateFileUpload(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], 10 * 1024 * 1024),
  async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No resume file uploaded" });
      }

      const fileUrl = `/uploads/resumes/${req.file.filename}`;
      
      res.json({
        message: "Resume uploaded successfully",
        fileUrl,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error("Resume upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// Get user's uploaded files
router.get('/my-files', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const allFiles: any[] = [];

    // Scan all upload directories for user files
    const directories = [
      { path: profileDir, type: 'profile' },
      { path: projectDir, type: 'project' },
      { path: resumeDir, type: 'resume' }
    ];

    for (const { path: dirPath, type } of directories) {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        const userFiles = files
          .filter(filename => filename.startsWith(`${userId}_`))
          .map(filename => {
            const filePath = path.join(dirPath, filename);
            const stats = fs.statSync(filePath);
            
            return {
              fileName: filename,
              type,
              fileUrl: `/uploads/${type}s/${filename}`,
              size: stats.size,
              uploadedAt: stats.birthtime,
              modifiedAt: stats.mtime
            };
          });
        
        allFiles.push(...userFiles);
      }
    }

    // Sort by upload date (newest first)
    allFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    res.json({
      files: allFiles,
      count: allFiles.length,
      totalSize: allFiles.reduce((sum, file) => sum + file.size, 0)
    });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// Delete uploaded file
router.delete('/file/:filename', requireAuth, async (req: any, res) => {
  try {
    const { filename } = req.params;
    const userId = req.user.id;

    // Security: Only allow users to delete their own files
    if (!filename.startsWith(`${userId}_`)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Find and delete the file from appropriate directory
    const directories = [profileDir, projectDir, resumeDir];
    let fileDeleted = false;

    for (const dir of directories) {
      const filePath = path.join(dir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        fileDeleted = true;
        break;
      }
    }

    if (!fileDeleted) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

export default router;