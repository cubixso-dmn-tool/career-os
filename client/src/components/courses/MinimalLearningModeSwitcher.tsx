import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Headphones, 
  Video, 
  MessageSquare, 
  Coffee, 
  Clock,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

type LearningModeType = "text" | "audio" | "video" | "interactive" | "microlearning";
type SpeedType = "0.8" | "1.0" | "1.25" | "1.5" | "2.0";

interface MinimalLearningModeSwitcherProps {
  className?: string;
}

export default function MinimalLearningModeSwitcher({ className }: MinimalLearningModeSwitcherProps) {
  const [mode, setMode] = useState<LearningModeType>("text");
  const [speed, setSpeed] = useState<SpeedType>("1.0");
  const [focusMode, setFocusMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("learningMode", mode);
    localStorage.setItem("learningSpeed", speed);
    localStorage.setItem("focusMode", String(focusMode));
  }, [mode, speed, focusMode]);
  
  const getModeIcon = (modeType: LearningModeType) => {
    switch (modeType) {
      case "text": return <BookOpen className="h-4 w-4" />;
      case "audio": return <Headphones className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "interactive": return <MessageSquare className="h-4 w-4" />;
      case "microlearning": return <Coffee className="h-4 w-4" />;
    }
  };
  
  const modes: LearningModeType[] = ["text", "audio", "video", "interactive", "microlearning"];
  
  return (
    <div className={cn("cantina-stack", className)}>
      {/* Mode Selector */}
      <div className="cantina-stack space-y-3">
        <div className="cantina-row justify-between">
          <span className="cantina-text-muted text-sm font-medium">Learning Mode</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="cantina-button-ghost h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {modes.map((modeType) => (
            <button
              key={modeType}
              onClick={() => setMode(modeType)}
              className={cn(
                "cantina-card cantina-hover flex flex-col items-center justify-center p-3 text-xs transition-all",
                mode === modeType 
                  ? "bg-accent text-accent-foreground border-accent" 
                  : "cantina-text-muted"
              )}
            >
              {getModeIcon(modeType)}
              <span className="mt-2 font-medium">
                {modeType === "microlearning" ? "Micro" : modeType.charAt(0).toUpperCase() + modeType.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="cantina-stack space-y-4 cantina-divider pt-4">
          {/* Speed Control */}
          <div className="cantina-stack space-y-2">
            <span className="cantina-text-muted text-sm font-medium">Playback Speed</span>
            <div className="grid grid-cols-5 gap-2">
              {["0.8", "1.0", "1.25", "1.5", "2.0"].map((speedValue) => (
                <button
                  key={speedValue}
                  onClick={() => setSpeed(speedValue as SpeedType)}
                  className={cn(
                    "cantina-card cantina-hover p-2 text-xs font-medium transition-all",
                    speed === speedValue 
                      ? "bg-accent text-accent-foreground border-accent" 
                      : "cantina-text-muted"
                  )}
                >
                  {speedValue}×
                </button>
              ))}
            </div>
          </div>
          
          {/* Focus Mode Toggle */}
          <div className="cantina-row justify-between">
            <span className="cantina-text-muted text-sm font-medium">Focus Mode</span>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={cn(
                "relative w-11 h-6 rounded-full border transition-all",
                focusMode 
                  ? "bg-accent border-accent" 
                  : "bg-input border-border"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full transition-all",
                  focusMode 
                    ? "left-5 bg-accent-foreground" 
                    : "left-0.5 bg-muted-foreground"
                )}
              />
            </button>
          </div>
        </div>
      )}
      
      {/* Current Mode Info */}
      <div className="cantina-surface p-4 rounded-md">
        <div className="cantina-row justify-between mb-2">
          <div className="cantina-row">
            {getModeIcon(mode)}
            <span className="cantina-text-heading text-sm">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </span>
          </div>
          <div className="cantina-row text-xs cantina-text-muted">
            <Clock className="h-3 w-3" />
            <span>{speed}×</span>
            {focusMode && <span className="cantina-badge-accent">Focus</span>}
          </div>
        </div>
        <p className="cantina-text-muted text-sm leading-relaxed">
          {mode === "text" && "Reading-based learning with comprehensive content and examples"}
          {mode === "audio" && "Listen to content in podcast format, perfect for learning on-the-go"}
          {mode === "video" && "Video tutorials and visual explanations of concepts"}
          {mode === "interactive" && "Learn by doing with interactive exercises and challenges"}
          {mode === "microlearning" && "Bite-sized content delivered in 5-10 minute focused sessions"}
        </p>
      </div>
    </div>
  );
}