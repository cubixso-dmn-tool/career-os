import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LightbulbIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Different tip categories can have different styles/icons
export type TipCategory = 
  | "skill" 
  | "interview" 
  | "resume" 
  | "course" 
  | "salary" 
  | "industry" 
  | "roadmap"
  | "general";

interface CareerTipTooltipProps {
  children: React.ReactNode;
  tip: string;
  category?: TipCategory;
  className?: string;
  showIcon?: boolean;
}

export function CareerTipTooltip({
  children,
  tip,
  category = "general",
  className,
  showIcon = true,
}: CareerTipTooltipProps) {
  // Define category-specific styling
  const getCategoryStyles = () => {
    switch (category) {
      case "skill":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "interview":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "resume":
        return "bg-green-50 border-green-200 text-green-700";
      case "course":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "salary":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "industry":
        return "bg-indigo-50 border-indigo-200 text-indigo-700";
      case "roadmap":
        return "bg-teal-50 border-teal-200 text-teal-700";
      case "general":
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center group relative", className)}>
            {children}
            {showIcon && (
              <LightbulbIcon 
                className="ml-1.5 w-4 h-4 text-yellow-500 cursor-help opacity-70 group-hover:opacity-100 transition-opacity" 
                aria-hidden="true" 
              />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            "px-4 py-3 max-w-xs border-2 shadow-lg font-medium text-sm rounded-lg", 
            getCategoryStyles()
          )}
          side="top"
          sideOffset={5}
        >
          <div className="flex items-start gap-2">
            <LightbulbIcon className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-0.5">Career Tip</p>
              <p className="font-normal">{tip}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}