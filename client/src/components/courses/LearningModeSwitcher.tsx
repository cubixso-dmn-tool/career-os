import { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  BookOpen, 
  Headphones, 
  Video, 
  MessageSquare, 
  Coffee, 
  Clock, 
  Sparkles, 
  LightbulbIcon, 
  InfoIcon,
  ChevronDown,
  MonitorSmartphone,
  Settings
} from "lucide-react";
import { useLearningMode } from "@/hooks/use-learning-mode";
import { cn } from "@/lib/utils";

type LearningModeType = "text" | "audio" | "video" | "interactive" | "microlearning";
type EnvironmentType = "desktop" | "mobile" | "auto";
type SpeedType = "0.8" | "1.0" | "1.25" | "1.5" | "2.0";
type PreferenceType = "focus" | "casual";

interface LearningModeSwitcherProps {
  className?: string;
  activeTab?: string;
}

export default function LearningModeSwitcher({ className, activeTab }: LearningModeSwitcherProps) {
  // Use our custom hook to manage learning mode state
  const { 
    mode, 
    setMode, 
    speed, 
    setSpeed, 
    environment, 
    setEnvironment, 
    focusMode, 
    setFocusMode 
  } = useLearningMode();
  
  // Detect if user is on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  // If environment is set to auto, use the detected device type
  const actualEnvironment = environment === "auto" 
    ? (isMobile ? "mobile" : "desktop") 
    : environment;
  
  // Get recommended mode based on context
  const getRecommendedMode = (): LearningModeType => {
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
  
  // Determine if current mode is recommended
  const isRecommendedMode = mode === getRecommendedMode();
  
  const getModeIcon = (modeType: LearningModeType) => {
    switch (modeType) {
      case "text": return <BookOpen className="h-4 w-4" />;
      case "audio": return <Headphones className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "interactive": return <MessageSquare className="h-4 w-4" />;
      case "microlearning": return <Coffee className="h-4 w-4" />;
    }
  };
  
  const getModeLabel = (modeType: LearningModeType) => {
    switch (modeType) {
      case "text": return "Text";
      case "audio": return "Audio";
      case "video": return "Video";
      case "interactive": return "Interactive";
      case "microlearning": return "Micro";
    }
  };
  
  const getModeLongLabel = (modeType: LearningModeType) => {
    switch (modeType) {
      case "text": return "Text-based Learning";
      case "audio": return "Audio Learning";
      case "video": return "Video Learning";
      case "interactive": return "Interactive Learning";
      case "microlearning": return "Microlearning";
    }
  };
  
  const getModeDescription = (modeType: LearningModeType) => {
    switch (modeType) {
      case "text": 
        return "Traditional reading-based learning with comprehensive content and examples.";
      case "audio": 
        return "Listen to content in podcast format, great for learning on-the-go.";
      case "video": 
        return "Video tutorials and visual explanations of concepts.";
      case "interactive": 
        return "Learn by doing with interactive exercises and challenges.";
      case "microlearning": 
        return "Bite-sized content in 5-10 minute chunks for quick learning sessions.";
    }
  };
  
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      {/* Main mode switcher - Mobile compact version */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              size="sm"
            >
              <div className="flex items-center">
                {getModeIcon(mode)}
                <span className="ml-2">{getModeLongLabel(mode)}</span>
              </div>
              {isRecommendedMode && (
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Learning Mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(["text", "audio", "video", "interactive", "microlearning"] as LearningModeType[]).map((modeType) => (
              <DropdownMenuItem 
                key={modeType}
                onClick={() => setMode(modeType)}
                className={cn(
                  "flex items-center cursor-pointer",
                  mode === modeType && "bg-primary/10 font-medium"
                )}
              >
                {getModeIcon(modeType)}
                <span className="ml-2">{getModeLongLabel(modeType)}</span>
                {modeType === getRecommendedMode() && (
                  <Badge className="ml-auto bg-green-100 text-green-800 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setMode(getRecommendedMode())}>
              <LightbulbIcon className="h-4 w-4 mr-2 text-amber-500" />
              Use Recommended Mode
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="focusMode" className="text-sm cursor-pointer">Focus Mode</Label>
                <Switch 
                  id="focusMode" 
                  checked={focusMode}
                  onCheckedChange={setFocusMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="deviceMode" className="text-sm cursor-pointer">Optimize for Device</Label>
                <Switch 
                  id="deviceMode" 
                  checked={environment === "auto"}
                  onCheckedChange={(checked) => setEnvironment(checked ? "auto" : (isMobile ? "mobile" : "desktop"))}
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Main mode switcher - Desktop version */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h3 className="text-sm font-medium mr-2">Learning Mode</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-md">
                  <p className="font-medium mb-1">Learning Mode</p>
                  <p className="text-sm mb-2">Choose how you'd like to consume course content based on your learning style and current situation.</p>
                  <p className="text-xs text-gray-500">The recommended mode is based on your device, preferences, and learning patterns.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {isRecommendedMode ? (
            <Badge className="bg-green-100 text-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Recommended Mode
            </Badge>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-primary"
              onClick={() => setMode(getRecommendedMode())}
            >
              <LightbulbIcon className="h-3 w-3 mr-1" />
              Use Recommended
            </Button>
          )}
        </div>
        
        <Tabs value={mode} onValueChange={(value) => setMode(value as LearningModeType)}>
          <TabsList className="w-full grid grid-cols-5">
            {(["text", "audio", "video", "interactive", "microlearning"] as LearningModeType[]).map((modeType) => (
              <TabsTrigger 
                key={modeType} 
                value={modeType}
                className="flex flex-col py-2 px-1 gap-1 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {getModeIcon(modeType)}
                <span className="text-xs">{getModeLabel(modeType)}</span>
                {modeType === getRecommendedMode() && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Additional settings - desktop only */}
      <div className="hidden md:block border rounded-md p-3 bg-gray-50">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-xs mb-1 block">Learning Speed</Label>
            <select 
              value={speed}
              onChange={(e) => setSpeed(e.target.value as SpeedType)}
              className="w-full text-sm h-9 rounded-md border border-input bg-background px-3 py-1"
            >
              <option value="0.8">Slower (0.8x)</option>
              <option value="1.0">Normal (1.0x)</option>
              <option value="1.25">Faster (1.25x)</option>
              <option value="1.5">Fast (1.5x)</option>
              <option value="2.0">Very Fast (2.0x)</option>
            </select>
          </div>
          
          <div>
            <Label className="text-xs mb-1 block">Device Optimization</Label>
            <select 
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as EnvironmentType)}
              className="w-full text-sm h-9 rounded-md border border-input bg-background px-3 py-1"
            >
              <option value="auto">Auto-detect</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          
          <div>
            <Label className="text-xs mb-1 block">Learning Style</Label>
            <div className="flex items-center h-9">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="focus-switch"
                  checked={focusMode}
                  onCheckedChange={setFocusMode}
                />
                <Label htmlFor="focus-switch" className="text-sm cursor-pointer">
                  {focusMode ? "Focus Mode" : "Casual Mode"}
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          <p className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Currently optimized for {actualEnvironment === "desktop" ? "desktop" : "mobile"} in {focusMode ? "focus" : "casual"} mode
          </p>
        </div>
      </div>
      
      {/* Description of selected mode - both mobile and desktop */}
      <div className="p-3 bg-primary/5 rounded-md border border-primary/10 text-sm">
        <div className="flex items-start">
          <div className="bg-primary/10 p-2 rounded-md mr-3">
            {getModeIcon(mode)}
          </div>
          <div>
            <h4 className="font-medium">{getModeLongLabel(mode)}</h4>
            <p className="text-sm text-gray-600">{getModeDescription(mode)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}