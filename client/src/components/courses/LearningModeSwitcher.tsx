import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { 
  BookOpenText, 
  Headphones, 
  PlaySquare, 
  GamepadIcon, 
  ListChecks,
  Smartphone,
  Laptop,
  ZoomIn,
  Medal,
  Clock,
  RefreshCcw
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useLearningMode, type ContentFormat, type LearningSpeed } from "@/hooks/use-learning-mode";

interface LearningModeSwitcherProps {
  activeTab?: string;
}

export default function LearningModeSwitcher({ activeTab }: LearningModeSwitcherProps) {
  // Get learning mode preferences from our custom hook
  const {
    mode,
    setMode,
    speed,
    setSpeed,
    environment,
    setEnvironment,
    focusMode,
    toggleFocusMode,
    autoDetectDevice,
    toggleAutoDetectDevice,
    resetToDefaults
  } = useLearningMode();
  
  // For slider visual representation of speed
  const getSpeedValue = (speed: LearningSpeed): number => {
    switch(speed) {
      case 'slow': return 25;
      case 'normal': return 50;
      case 'fast': return 75;
      default: return 50;
    }
  };
  
  // Convert slider value back to LearningSpeed type
  const handleSpeedChange = (value: number[]) => {
    const speedValue = value[0];
    if (speedValue <= 33) {
      setSpeed('slow');
    } else if (speedValue <= 66) {
      setSpeed('normal');
    } else {
      setSpeed('fast');
    }
  };
  
  // Get appropriate icon for content format
  const getFormatIcon = (format: ContentFormat) => {
    switch(format) {
      case 'text': return <BookOpenText className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'video': return <PlaySquare className="h-4 w-4" />;
      case 'interactive': return <GamepadIcon className="h-4 w-4" />;
      case 'microlearning': return <ListChecks className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid grid-cols-3 h-auto">
          <TabsTrigger value="content" className="py-2">
            <BookOpenText className="h-4 w-4 mr-2" />
            <span>Content Format</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="py-2">
            <Clock className="h-4 w-4 mr-2" />
            <span>Learning Speed</span>
          </TabsTrigger>
          <TabsTrigger value="device" className="py-2">
            <Laptop className="h-4 w-4 mr-2" />
            <span>Device Settings</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Content Format Tab */}
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <FormatCard 
              format="text"
              title="Text"
              description="Read articles and guides"
              icon={<BookOpenText className="h-5 w-5" />}
              isSelected={mode === 'text'}
              onClick={() => setMode('text')}
            />
            
            <FormatCard 
              format="audio"
              title="Audio"
              description="Listen to lectures and podcasts"
              icon={<Headphones className="h-5 w-5" />}
              isSelected={mode === 'audio'}
              onClick={() => setMode('audio')}
            />
            
            <FormatCard 
              format="video"
              title="Video"
              description="Watch tutorials and demos"
              icon={<PlaySquare className="h-5 w-5" />}
              isSelected={mode === 'video'}
              onClick={() => setMode('video')}
            />
            
            <FormatCard 
              format="interactive"
              title="Interactive"
              description="Code and practice hands-on"
              icon={<GamepadIcon className="h-5 w-5" />}
              isSelected={mode === 'interactive'}
              onClick={() => setMode('interactive')}
            />
            
            <FormatCard 
              format="microlearning"
              title="Microlearning"
              description="Quick, bite-sized lessons"
              icon={<ListChecks className="h-5 w-5" />}
              isSelected={mode === 'microlearning'}
              onClick={() => setMode('microlearning')}
            />
          </div>
          
          <div className="pt-2">
            <Label className="text-sm text-gray-500">
              Your current preference: <span className="text-primary font-medium inline-flex items-center">
                {getFormatIcon(mode)} <span className="ml-1">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </span>
            </Label>
          </div>
        </TabsContent>
        
        {/* Learning Speed Tab */}
        <TabsContent value="settings" className="space-y-5 pt-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Learning Speed</Label>
              <span className="text-sm text-gray-500">
                {speed === 'slow' ? 'Slower' : speed === 'normal' ? 'Normal' : 'Faster'}
              </span>
            </div>
            <Slider
              value={[getSpeedValue(speed)]}
              onValueChange={handleSpeedChange}
              max={100}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Thorough</span>
              <span>Balanced</span>
              <span>Accelerated</span>
            </div>
          </div>
          
          <div className="space-y-3 pt-4">
            <Label className="text-sm font-medium">Focus Environment</Label>
            <RadioGroup 
              value={environment} 
              onValueChange={(value) => setEnvironment(value as 'focus' | 'casual')}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 bg-white">
                <RadioGroupItem value="focus" id="focus" />
                <Label htmlFor="focus" className="flex items-center">
                  <ZoomIn className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <span className="font-medium">Focus Mode</span>
                    <p className="text-xs text-gray-500">Distraction-free, intensive learning</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3 bg-white">
                <RadioGroupItem value="casual" id="casual" />
                <Label htmlFor="casual" className="flex items-center">
                  <Medal className="mr-2 h-4 w-4 text-amber-500" />
                  <div>
                    <span className="font-medium">Casual Mode</span>
                    <p className="text-xs text-gray-500">Relaxed, gradual learning pace</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
        
        {/* Device Settings Tab */}
        <TabsContent value="device" className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-detect Device</Label>
              <p className="text-sm text-gray-500">
                Optimize content for your screen size
              </p>
            </div>
            <Switch 
              checked={autoDetectDevice} 
              onCheckedChange={toggleAutoDetectDevice} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Focus Mode</Label>
              <p className="text-sm text-gray-500">
                Hide distractions while learning
              </p>
            </div>
            <Switch 
              checked={focusMode} 
              onCheckedChange={toggleFocusMode} 
            />
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetToDefaults}
              className="w-full"
            >
              <RefreshCcw className="mr-2 h-3.5 w-3.5" />
              Reset to Default Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Format card component for the content format options
interface FormatCardProps {
  format: ContentFormat;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

function FormatCard({ format, title, description, icon, isSelected, onClick }: FormatCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary/50 ${
        isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
      }`} 
      onClick={onClick}
    >
      <CardContent className="p-3 text-center">
        <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
          isSelected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
        }`}>
          {icon}
        </div>
        <h3 className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}