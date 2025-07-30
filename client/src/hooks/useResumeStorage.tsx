import { useState, useEffect } from 'react';
import { resumeLocalStorageService } from '@/services/resumeLocalStorage';

export interface StorageInfo {
  localResumeCount: number;
  storageUsed: number;
  storageAvailable: number;
  isStorageLow: boolean;
}

export const useResumeStorage = () => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    localResumeCount: 0,
    storageUsed: 0,
    storageAvailable: 0,
    isStorageLow: false
  });

  const updateStorageInfo = () => {
    const localResumes = resumeLocalStorageService.getResumes();
    const storageStats = resumeLocalStorageService.getStorageInfo();
    
    setStorageInfo({
      localResumeCount: localResumes.length,
      storageUsed: storageStats.used,
      storageAvailable: storageStats.available,
      isStorageLow: storageStats.available < (1024 * 1024) // Less than 1MB available
    });
  };

  useEffect(() => {
    updateStorageInfo();
    
    // Listen for storage events to update when localStorage changes
    const handleStorageChange = () => updateStorageInfo();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const clearLocalResumes = () => {
    resumeLocalStorageService.clearAll();
    updateStorageInfo();
  };

  const exportLocalResumes = () => {
    return resumeLocalStorageService.exportResumes();
  };

  const importLocalResumes = (jsonData: string) => {
    const success = resumeLocalStorageService.importResumes(jsonData);
    if (success) {
      updateStorageInfo();
    }
    return success;
  };

  return {
    storageInfo,
    clearLocalResumes,
    exportLocalResumes,
    importLocalResumes,
    refreshStorageInfo: updateStorageInfo
  };
};