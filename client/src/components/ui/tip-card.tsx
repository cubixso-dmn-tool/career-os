import { useCareerTips } from "@/hooks/use-career-tips";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TipCategory } from "@/components/ui/career-tip-tooltip";
import { useState } from "react";

interface TipCardProps {
  context: string;
  secondaryContext?: string;
  showRefresh?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
  compact?: boolean;
}

export function TipCard({
  context,
  secondaryContext,
  showRefresh = true,
  autoRefresh = false,
  refreshInterval = 60000, // Default: 1 minute
  className,
  compact = false,
}: TipCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { currentTip, refreshTip } = useCareerTips({
    context,
    secondaryContext,
    refreshInterval: autoRefresh ? refreshInterval : null,
  });
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshTip();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  // Get category-specific styling
  const getCategoryStyles = (category: TipCategory) => {
    switch (category) {
      case "skill":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "interview":
        return "border-purple-200 bg-purple-50 text-purple-700";
      case "resume":
        return "border-green-200 bg-green-50 text-green-700";
      case "course":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "salary":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "industry":
        return "border-indigo-200 bg-indigo-50 text-indigo-700";
      case "general":
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };
  
  if (!currentTip) {
    return null; // No tip available for this context
  }
  
  return (
    <Card className={cn(
      "border-2 overflow-hidden transition-all duration-300",
      getCategoryStyles(currentTip.category),
      className
    )}>
      <CardContent className={cn(
        "p-4",
        compact ? "space-y-1" : "space-y-2"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LightbulbIcon className="h-5 w-5 text-yellow-500" />
            <h3 className={cn(
              "font-semibold",
              compact ? "text-sm" : "text-base"
            )}>
              Career Tip
            </h3>
          </div>
          
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleRefresh}
              aria-label="Get new tip"
            >
              <RefreshCwIcon 
                className={cn(
                  "h-4 w-4",
                  isRefreshing && "animate-spin"
                )} 
              />
            </Button>
          )}
        </div>
        
        <p className={cn(
          "leading-relaxed",
          compact ? "text-sm" : "text-base"
        )}>
          {currentTip.tip}
        </p>
      </CardContent>
    </Card>
  );
}