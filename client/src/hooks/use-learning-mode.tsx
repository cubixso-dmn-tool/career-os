import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Available learning modes
export type ContentFormat = 'text' | 'audio' | 'video' | 'interactive' | 'microlearning';
export type LearningSpeed = 'slow' | 'normal' | 'fast';
export type LearningEnvironment = 'focus' | 'casual';

interface LearningModeState {
  // Content format preferences
  mode: ContentFormat;
  setMode: (mode: ContentFormat) => void;
  
  // Learning speed preference
  speed: LearningSpeed;
  setSpeed: (speed: LearningSpeed) => void;
  
  // Learning environment preference
  environment: LearningEnvironment;
  setEnvironment: (environment: LearningEnvironment) => void;
  
  // Focus mode - eliminates distractions
  focusMode: boolean;
  toggleFocusMode: () => void;
  
  // Auto-detection features
  autoDetectDevice: boolean;
  toggleAutoDetectDevice: () => void;
  
  // Reset all preferences to defaults
  resetToDefaults: () => void;
}

// The learning mode store with persistence
export const useLearningModeStore = create<LearningModeState>()(
  persist(
    (set) => ({
      // Default content format is text
      mode: 'text',
      setMode: (mode) => set({ mode }),
      
      // Default speed is normal
      speed: 'normal',
      setSpeed: (speed) => set({ speed }),
      
      // Default environment is casual
      environment: 'casual',
      setEnvironment: (environment) => set({ environment }),
      
      // Focus mode is off by default
      focusMode: false,
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
      
      // Auto-detect device is on by default
      autoDetectDevice: true,
      toggleAutoDetectDevice: () => 
        set((state) => ({ autoDetectDevice: !state.autoDetectDevice })),
      
      // Reset to default settings
      resetToDefaults: () => set({
        mode: 'text',
        speed: 'normal',
        environment: 'casual',
        focusMode: false,
        autoDetectDevice: true,
      }),
    }),
    {
      name: 'learning-mode-storage',
    }
  )
);

// Hook to use the learning mode
export const useLearningMode = useLearningModeStore;