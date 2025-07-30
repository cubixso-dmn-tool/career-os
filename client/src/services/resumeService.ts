import { ResumeData } from '@/components/resume/ResumeTemplates';
import { resumeLocalStorageService, LocalStorageResume } from './resumeLocalStorage';

export interface SavedResume {
  id: string;
  userId: string;
  templateId: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
  name?: string;
  isLocal?: boolean; // Flag to indicate if it's stored locally
}

class ResumeService {
  private baseUrl = '/api/resumes';

  async saveResume(templateId: string, data: ResumeData): Promise<SavedResume> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          data,
          name: data.personalInfo.name || 'Untitled Resume',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save resume to server');
      }

      return response.json();
    } catch (error) {
      console.warn('Server save failed, falling back to localStorage:', error);
      
      // Fallback to localStorage
      const localResume = resumeLocalStorageService.saveResume(
        templateId, 
        data, 
        data.personalInfo.name || 'Untitled Resume',
        'local_user' // Use a placeholder user ID for localStorage
      );
      
      return {
        ...localResume,
        userId: localResume.userId || 'local_user',
        isLocal: true
      };
    }
  }

  async updateResume(id: string, templateId: string, data: ResumeData): Promise<SavedResume> {
    try {
      // If it's a local resume, update in localStorage
      if (id.startsWith('local_')) {
        const updated = resumeLocalStorageService.updateResume(
          id, 
          templateId, 
          data, 
          data.personalInfo.name || 'Untitled Resume'
        );
        
        if (!updated) {
          throw new Error('Local resume not found');
        }
        
        return {
          ...updated,
          userId: updated.userId || 'local_user',
          isLocal: true
        };
      }

      // Try server update for non-local resumes
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          data,
          name: data.personalInfo.name || 'Untitled Resume',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update resume on server');
      }

      return response.json();
    } catch (error) {
      console.warn('Server update failed, trying localStorage fallback:', error);
      
      // Fallback: save as new local resume if server update fails
      const localResume = resumeLocalStorageService.saveResume(
        templateId, 
        data, 
        data.personalInfo.name || 'Untitled Resume',
        'local_user'
      );
      
      return {
        ...localResume,
        userId: localResume.userId || 'local_user',
        isLocal: true
      };
    }
  }

  async getResume(id: string): Promise<SavedResume> {
    try {
      // If it's a local resume, get from localStorage
      if (id.startsWith('local_')) {
        const localResume = resumeLocalStorageService.getResume(id);
        if (!localResume) {
          throw new Error('Local resume not found');
        }
        
        return {
          ...localResume,
          userId: localResume.userId || 'local_user',
          isLocal: true
        };
      }

      // Try server for non-local resumes
      const response = await fetch(`${this.baseUrl}/${id}`);

      if (!response.ok) {
        throw new Error('Failed to load resume from server');
      }

      return response.json();
    } catch (error) {
      console.warn('Failed to get resume:', error);
      throw error;
    }
  }

  async getUserResumes(): Promise<SavedResume[]> {
    try {
      // Always get local resumes
      const localResumes = resumeLocalStorageService.getResumes().map(resume => ({
        ...resume,
        userId: resume.userId || 'local_user',
        isLocal: true
      }));

      // Try to get server resumes
      try {
        const response = await fetch(this.baseUrl);
        if (response.ok) {
          const serverResumes = await response.json();
          // Combine server and local resumes, with server resumes first
          return [...serverResumes, ...localResumes];
        }
      } catch (serverError) {
        console.warn('Failed to fetch server resumes:', serverError);
      }

      // Return only local resumes if server fails
      return localResumes;
    } catch (error) {
      console.warn('Failed to get user resumes:', error);
      // Return empty array if everything fails
      return [];
    }
  }

  async deleteResume(id: string): Promise<void> {
    try {
      // If it's a local resume, delete from localStorage
      if (id.startsWith('local_')) {
        const deleted = resumeLocalStorageService.deleteResume(id);
        if (!deleted) {
          throw new Error('Local resume not found');
        }
        return;
      }

      // Try server delete for non-local resumes
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume from server');
      }
    } catch (error) {
      console.warn('Failed to delete resume:', error);
      throw error;
    }
  }

  // Auto-save functionality with debouncing
  private autoSaveTimeout: NodeJS.Timeout | null = null;

  autoSave(
    resumeId: string | null,
    templateId: string,
    data: ResumeData,
    onSuccess?: (savedResume: SavedResume) => void,
    onError?: (error: Error) => void
  ): void {
    // Clear existing timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    this.autoSaveTimeout = setTimeout(async () => {
      try {
        let savedResume: SavedResume;
        
        if (resumeId) {
          // Update existing resume
          savedResume = await this.updateResume(resumeId, templateId, data);
        } else {
          // Create new resume
          savedResume = await this.saveResume(templateId, data);
        }

        if (onSuccess) {
          onSuccess(savedResume);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        
        // Fallback: try saving to localStorage directly
        try {
          const localResume = resumeLocalStorageService.saveResume(
            templateId,
            data,
            data.personalInfo?.name || 'Untitled Resume',
            'local_user'
          );
          
          const fallbackResume: SavedResume = {
            ...localResume,
            userId: 'local_user',
            isLocal: true
          };
          
          if (onSuccess) {
            onSuccess(fallbackResume);
          }
        } catch (localError) {
          console.error('LocalStorage fallback also failed:', localError);
          if (onError) {
            onError(error as Error);
          }
        }
      }
    }, 2000);
  }

  cancelAutoSave(): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = null;
    }
  }
}

export const resumeService = new ResumeService();
export default resumeService;