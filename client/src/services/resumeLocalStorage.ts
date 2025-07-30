import { ResumeData } from '@/components/resume/ResumeTemplates';

export interface LocalStorageResume {
  id: string;
  userId?: string;
  name: string;
  templateId: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

class ResumeLocalStorageService {
  private readonly STORAGE_KEY = 'career_compass_resumes';
  private readonly MAX_RESUMES = 10; // Limit to prevent localStorage bloat

  // Get all resumes from localStorage
  getResumes(): LocalStorageResume[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const resumes = JSON.parse(stored) as LocalStorageResume[];
      return resumes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
      console.error('Error reading resumes from localStorage:', error);
      return [];
    }
  }

  // Get a specific resume by ID
  getResume(id: string): LocalStorageResume | null {
    const resumes = this.getResumes();
    return resumes.find(resume => resume.id === id) || null;
  }

  // Get resumes by user ID (if available)
  getResumesByUser(userId: string): LocalStorageResume[] {
    const resumes = this.getResumes();
    return resumes.filter(resume => resume.userId === userId);
  }

  // Save a new resume
  saveResume(templateId: string, data: ResumeData, name?: string, userId?: string): LocalStorageResume {
    const resumes = this.getResumes();
    
    const newResume: LocalStorageResume = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name: name || data.personalInfo?.name || 'Untitled Resume',
      templateId,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    resumes.unshift(newResume);

    // Keep only the most recent resumes to prevent localStorage bloat
    if (resumes.length > this.MAX_RESUMES) {
      resumes.splice(this.MAX_RESUMES);
    }

    this.saveToStorage(resumes);
    return newResume;
  }

  // Update an existing resume
  updateResume(id: string, templateId: string, data: ResumeData, name?: string): LocalStorageResume | null {
    const resumes = this.getResumes();
    const index = resumes.findIndex(resume => resume.id === id);
    
    if (index === -1) return null;

    resumes[index] = {
      ...resumes[index],
      templateId,
      data,
      name: name || data.personalInfo?.name || resumes[index].name,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage(resumes);
    return resumes[index];
  }

  // Delete a resume
  deleteResume(id: string): boolean {
    const resumes = this.getResumes();
    const filteredResumes = resumes.filter(resume => resume.id !== id);
    
    if (filteredResumes.length === resumes.length) return false; // Resume not found
    
    this.saveToStorage(filteredResumes);
    return true;
  }

  // Auto-save with debouncing support
  private autoSaveTimeout: NodeJS.Timeout | null = null;

  autoSave(
    resumeId: string | null,
    templateId: string,
    data: ResumeData,
    name?: string,
    userId?: string,
    onSuccess?: (savedResume: LocalStorageResume) => void,
    onError?: (error: Error) => void
  ): void {
    // Clear existing timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    // Set new timeout for auto-save (1 second for localStorage)
    this.autoSaveTimeout = setTimeout(() => {
      try {
        let savedResume: LocalStorageResume;

        if (resumeId && resumeId.startsWith('local_')) {
          // Update existing local resume
          const updated = this.updateResume(resumeId, templateId, data, name);
          if (!updated) throw new Error('Resume not found');
          savedResume = updated;
        } else {
          // Create new local resume
          savedResume = this.saveResume(templateId, data, name, userId);
        }

        if (onSuccess) {
          onSuccess(savedResume);
        }
      } catch (error) {
        console.error('Auto-save to localStorage failed:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    }, 1000); // Faster auto-save for localStorage
  }

  cancelAutoSave(): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = null;
    }
  }

  // Clear all localStorage data (useful for logout or reset)
  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Export resumes for backup
  exportResumes(): string {
    const resumes = this.getResumes();
    return JSON.stringify(resumes, null, 2);
  }

  // Import resumes from backup
  importResumes(jsonData: string): boolean {
    try {
      const importedResumes = JSON.parse(jsonData) as LocalStorageResume[];
      
      // Validate the structure
      if (!Array.isArray(importedResumes)) return false;
      
      const currentResumes = this.getResumes();
      const mergedResumes = [...importedResumes, ...currentResumes];
      
      // Remove duplicates and keep only the most recent ones
      const uniqueResumes = mergedResumes
        .filter((resume, index, arr) => 
          arr.findIndex(r => r.id === resume.id) === index
        )
        .slice(0, this.MAX_RESUMES);
      
      this.saveToStorage(uniqueResumes);
      return true;
    } catch (error) {
      console.error('Error importing resumes:', error);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; resumeCount: number } {
    const resumes = this.getResumes();
    const dataString = localStorage.getItem(this.STORAGE_KEY) || '';
    const used = new Blob([dataString]).size;
    
    // Estimate available space (localStorage limit is usually 5-10MB)
    const estimated5MB = 5 * 1024 * 1024;
    
    return {
      used,
      available: estimated5MB - used,
      resumeCount: resumes.length
    };
  }

  private saveToStorage(resumes: LocalStorageResume[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resumes));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      
      // If storage is full, try to free up space by removing oldest resumes
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const reducedResumes = resumes.slice(0, Math.floor(this.MAX_RESUMES / 2));
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reducedResumes));
          console.warn('Reduced resume storage due to quota exceeded');
        } catch (secondError) {
          console.error('Failed to save even reduced data:', secondError);
          throw secondError;
        }
      } else {
        throw error;
      }
    }
  }
}

export const resumeLocalStorageService = new ResumeLocalStorageService();
export default resumeLocalStorageService;