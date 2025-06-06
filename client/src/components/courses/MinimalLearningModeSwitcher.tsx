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
    <div className={cn("space-y-4", className)}>
      {/* Mode Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono text-white/70">MODE</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="grid grid-cols-5 gap-1">
          {modes.map((modeType) => (
            <button
              key={modeType}
              onClick={() => setMode(modeType)}
              className={cn(
                "flex flex-col items-center justify-center p-2 text-xs font-mono transition-all",
                "border border-white/20 hover:border-white/40",
                mode === modeType 
                  ? "bg-white text-black border-white" 
                  : "bg-black/40 text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              {getModeIcon(modeType)}
              <span className="mt-1 text-[10px] uppercase tracking-wide">
                {modeType === "microlearning" ? "micro" : modeType}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="space-y-3 border-t border-white/20 pt-3">
          {/* Speed Control */}
          <div className="space-y-2">
            <span className="text-sm font-mono text-white/70">SPEED</span>
            <div className="grid grid-cols-5 gap-1">
              {["0.8", "1.0", "1.25", "1.5", "2.0"].map((speedValue) => (
                <button
                  key={speedValue}
                  onClick={() => setSpeed(speedValue as SpeedType)}
                  className={cn(
                    "p-2 text-xs font-mono transition-all border border-white/20",
                    speed === speedValue 
                      ? "bg-white text-black" 
                      : "bg-black/40 text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  {speedValue}x
                </button>
              ))}
            </div>
          </div>
          
          {/* Focus Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-white/70">FOCUS</span>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={cn(
                "w-8 h-4 border border-white/20 transition-all",
                focusMode ? "bg-white" : "bg-black/40"
              )}
            >
              <div
                className={cn(
                  "w-3 h-3 transition-all",
                  focusMode 
                    ? "bg-black translate-x-4" 
                    : "bg-white/70 translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      )}
      
      {/* Current Mode Info */}
      <div className="bg-black/40 border border-white/20 p-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getModeIcon(mode)}
            <span className="font-mono text-sm text-white uppercase tracking-wide">
              {mode}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-white/50">
            <Clock className="h-3 w-3" />
            <span>{speed}x</span>
            {focusMode && <span>FOCUS</span>}
          </div>
        </div>
        <p className="text-xs font-mono text-white/60 leading-relaxed">
          {mode === "text" && "Reading-based learning with comprehensive content"}
          {mode === "audio" && "Listen to content in podcast format"}
          {mode === "video" && "Video tutorials and visual explanations"}
          {mode === "interactive" && "Learn by doing with interactive exercises"}
          {mode === "microlearning" && "Bite-sized content in 5-10 minute chunks"}
        </p>
      </div>
    </div>
  );
}