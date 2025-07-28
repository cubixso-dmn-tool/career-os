import { ResumeData } from '@/components/resume/ResumeTemplates';

export interface SavedResume {
  id: string;
  userId: string;
  templateId: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
  name?: string;
}

class ResumeService {
  private baseUrl = '/api/resumes';

  async saveResume(templateId: string, data: ResumeData): Promise<SavedResume> {
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
      throw new Error('Failed to save resume');
    }

    return response.json();
  }

  async updateResume(id: string, templateId: string, data: ResumeData): Promise<SavedResume> {
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
      throw new Error('Failed to update resume');
    }

    return response.json();
  }

  async getResume(id: string): Promise<SavedResume> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to load resume');
    }

    return response.json();
  }

  async getUserResumes(): Promise<SavedResume[]> {
    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      throw new Error('Failed to load resumes');
    }

    return response.json();
  }

  async deleteResume(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete resume');
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
        if (onError) {
          onError(error as Error);
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