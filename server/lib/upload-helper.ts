import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Ensure the uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Additional subdirectories for specific file types
const SUBDIRS = {
  images: path.join(UPLOADS_DIR, 'images'),
  courseThumbnails: path.join(UPLOADS_DIR, 'courses'),
  communityBanners: path.join(UPLOADS_DIR, 'communities', 'banners'),
  communityIcons: path.join(UPLOADS_DIR, 'communities', 'icons'),
  avatars: path.join(UPLOADS_DIR, 'avatars'),
  projects: path.join(UPLOADS_DIR, 'projects'),
  documents: path.join(UPLOADS_DIR, 'documents')
};

// Create all subdirectories if they don't exist
Object.values(SUBDIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Process a base64 image or file upload
 * @param base64Data The base64 string of the file
 * @param folder The destination folder for the file
 * @returns Object with the file URL and other info
 */
export async function processBase64Upload(base64Data: string, folder: string): Promise<{ url: string, filename: string }> {
  // Check if folder is valid
  if (!Object.values(SUBDIRS).includes(path.join(UPLOADS_DIR, folder))) {
    throw new Error(`Invalid upload folder: ${folder}`);
  }

  // Extract the file data and type
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string format');
  }

  const fileType = matches[1];
  const fileData = matches[2];
  const buffer = Buffer.from(fileData, 'base64');

  // Determine file extension based on MIME type
  let fileExtension = '';
  if (fileType.includes('image/jpeg')) fileExtension = '.jpg';
  else if (fileType.includes('image/png')) fileExtension = '.png';
  else if (fileType.includes('image/gif')) fileExtension = '.gif';
  else if (fileType.includes('image/svg+xml')) fileExtension = '.svg';
  else if (fileType.includes('application/pdf')) fileExtension = '.pdf';
  else if (fileType.includes('application/msword')) fileExtension = '.doc';
  else if (fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    fileExtension = '.docx';
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  // Generate unique filename
  const filename = `${uuidv4()}${fileExtension}`;
  const uploadPath = path.join(UPLOADS_DIR, folder, filename);
  const publicUrl = `/uploads/${folder}/${filename}`;

  // Write the file
  fs.writeFileSync(uploadPath, buffer);

  return {
    url: publicUrl,
    filename
  };
}

/**
 * Process a multer file upload
 * @param file The file object from multer
 * @param subdir The subdirectory to save the file in
 * @returns Object with the file URL and other info
 */
export async function processFileUpload(file: any, subdir: keyof typeof SUBDIRS): Promise<{ url: string, filename: string }> {
  if (!file) {
    throw new Error('No file provided');
  }

  // Get the destination directory
  const destDir = SUBDIRS[subdir];
  if (!destDir) {
    throw new Error(`Invalid subdirectory: ${subdir}`);
  }

  // Generate unique filename
  const fileExtension = path.extname(file.originalname);
  const filename = `${uuidv4()}${fileExtension}`;
  const uploadPath = path.join(destDir, filename);
  
  // Create folder if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Write the file from buffer
  fs.writeFileSync(uploadPath, file.buffer);

  // Calculate public URL
  const relativePath = path.relative(UPLOADS_DIR, uploadPath);
  const publicUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

  return {
    url: publicUrl,
    filename
  };
}

/**
 * Extract and process a file from a multipart/form-data request
 * @param req The Express request object
 * @param fieldName The name of the form field containing the file
 * @param subdir The subdirectory to save the file in
 * @returns Object with the file URL and other info, or null if no file was provided
 */
export async function extractAndProcessFile(req: any, fieldName: string, subdir: keyof typeof SUBDIRS): Promise<{ url: string, filename: string } | null> {
  // Check if there's a file in the fieldName
  if (!req.files || !req.files[fieldName] || !req.files[fieldName][0]) {
    return null;
  }
  
  const file = req.files[fieldName][0];
  return await processFileUpload(file, subdir);
}