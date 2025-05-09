import { 
  createContext, 
  useState, 
  useContext, 
  useEffect, 
  ReactNode 
} from "react";

type LearningModeType = "text" | "audio" | "video" | "interactive" | "microlearning";
type EnvironmentType = "desktop" | "mobile" | "auto";
type SpeedType = "0.8" | "1.0" | "1.25" | "1.5" | "2.0";

interface LearningModeContextType {
  mode: LearningModeType;
  setMode: (mode: LearningModeType) => void;
  speed: SpeedType;
  setSpeed: (speed: SpeedType) => void;
  environment: EnvironmentType;
  setEnvironment: (environment: EnvironmentType) => void;
  focusMode: boolean;
  setFocusMode: (focusMode: boolean) => void;
  isRecommendedMode: boolean;
  getRecommendedMode: () => LearningModeType;
  resetToDefaults: () => void;
}

const LearningModeContext = createContext<LearningModeContextType | undefined>(undefined);

export function LearningModeProvider({ children }: { children: ReactNode }) {
  // Set up state with defaults and storage
  const [mode, setModeState] = useState<LearningModeType>(() => {
    const savedMode = localStorage.getItem("learningMode");
    return savedMode ? (savedMode as LearningModeType) : "text";
  });
  
  const [speed, setSpeedState] = useState<SpeedType>(() => {
    const savedSpeed = localStorage.getItem("learningSpeed");
    return savedSpeed ? (savedSpeed as SpeedType) : "1.0";
  });
  
  const [environment, setEnvironmentState] = useState<EnvironmentType>(() => {
    const savedEnvironment = localStorage.getItem("learningEnvironment");
    return savedEnvironment ? (savedEnvironment as EnvironmentType) : "auto";
  });
  
  const [focusMode, setFocusModeState] = useState<boolean>(() => {
    const savedFocusMode = localStorage.getItem("learningFocusMode");
    return savedFocusMode ? savedFocusMode === "true" : false;
  });
  
  // Define stateful setters that persist to localStorage
  const setMode = (newMode: LearningModeType) => {
    setModeState(newMode);
    localStorage.setItem("learningMode", newMode);
  };
  
  const setSpeed = (newSpeed: SpeedType) => {
    setSpeedState(newSpeed);
    localStorage.setItem("learningSpeed", newSpeed);
  };
  
  const setEnvironment = (newEnvironment: EnvironmentType) => {
    setEnvironmentState(newEnvironment);
    localStorage.setItem("learningEnvironment", newEnvironment);
  };
  
  const setFocusMode = (newFocusMode: boolean) => {
    setFocusModeState(newFocusMode);
    localStorage.setItem("learningFocusMode", String(newFocusMode));
  };
  
  // Detect if running on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Set up listener
    window.addEventListener("resize", checkIfMobile);
    
    // Clean up
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  // Get recommended mode based on context
  const getRecommendedMode = (): LearningModeType => {
    // Determine actual environment
    const actualEnvironment = environment === "auto" 
      ? (isMobile ? "mobile" : "desktop") 
      : environment;
    
    // If we're in focus mode, prefer text/video based on environment
    if (focusMode) {
      return actualEnvironment === "desktop" ? "text" : "video";
    }
    
    // For casual browsing, recommend microlearning on mobile
    if (actualEnvironment === "mobile") {
      return "microlearning";
    }
    
    // Default to interactive for desktop casual browsing
    return "interactive";
  };
  
  // Check if current mode is recommended
  const isRecommendedMode = mode === getRecommendedMode();
  
  // Reset to defaults
  const resetToDefaults = () => {
    setMode("text");
    setSpeed("1.0");
    setEnvironment("auto");
    setFocusMode(false);
  };
  
  return (
    <LearningModeContext.Provider value={{
      mode,
      setMode,
      speed,
      setSpeed,
      environment,
      setEnvironment,
      focusMode,
      setFocusMode,
      isRecommendedMode,
      getRecommendedMode,
      resetToDefaults
    }}>
      {children}
    </LearningModeContext.Provider>
  );
}

export function useLearningMode() {
  const context = useContext(LearningModeContext);
  
  if (context === undefined) {
    throw new Error("useLearningMode must be used within a LearningModeProvider");
  }
  
  return context;
}