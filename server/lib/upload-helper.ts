import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Process a base64 image or file upload
 * @param base64Data The base64 string of the file
 * @param folder The destination folder for the file
 * @returns Object with the file URL and other info
 */
export async function processUpload(base64Data: string, folder: string): Promise<{ url: string, filename: string }> {
  try {
    // Extract the actual base64 content and determine the file type
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 data");
    }
    
    const fileType = matches[1];
    const base64Content = matches[2];
    const buffer = Buffer.from(base64Content, 'base64');
    
    // Determine file extension based on MIME type
    let fileExtension = 'png'; // Default extension
    if (fileType.includes('jpeg') || fileType.includes('jpg')) {
      fileExtension = 'jpg';
    } else if (fileType.includes('png')) {
      fileExtension = 'png';
    } else if (fileType.includes('gif')) {
      fileExtension = 'gif';
    } else if (fileType.includes('pdf')) {
      fileExtension = 'pdf';
    }
    
    // Create a unique filename
    const filename = `${uuidv4()}.${fileExtension}`;
    
    // Ensure the uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Write the file
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    
    // Return the URL path to access the file
    return {
      url: `/uploads/${folder}/${filename}`,
      filename
    };
  } catch (error) {
    console.error('Error processing upload:', error);
    throw new Error('Failed to process file upload');
  }
}