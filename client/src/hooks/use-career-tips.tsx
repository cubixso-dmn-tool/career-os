import { useState, useEffect, useCallback } from "react";
import { getContextualCareerTip, getCareerTipById, getCareerTipsByCategory } from "@/lib/career-tips";
import { TipCategory } from "@/components/ui/career-tip-tooltip";

interface UseCareerTipsProps {
  context: string;
  secondaryContext?: string;
  refreshInterval?: number | null; // time in ms, null for no auto-refresh
}

interface CareerTipData {
  id: string;
  tip: string;
  category: TipCategory;
  contexts: string[];
}

export function useCareerTips({
  context,
  secondaryContext,
  refreshInterval = null,
}: UseCareerTipsProps) {
  const [currentTip, setCurrentTip] = useState<CareerTipData | undefined>(undefined);
  const [tipHistory, setTipHistory] = useState<string[]>([]);
  
  // Function to get a new tip and update state
  const refreshTip = useCallback(() => {
    // Get a new tip based on the context
    let newTip = getContextualCareerTip(context, secondaryContext);
    
    // If we have history, try to avoid showing the same tip twice in a row
    if (tipHistory.length > 0 && newTip) {
      // If the new tip was recently shown and there are other options, try again
      let attempts = 0;
      const maxAttempts = 5;
      
      while (newTip && tipHistory.includes(newTip.id) && attempts < maxAttempts) {
        newTip = getContextualCareerTip(context, secondaryContext);
        attempts++;
      }
    }
    
    if (newTip) {
      setCurrentTip(newTip);
      
      // Update history, keeping only the last 5 tips
      setTipHistory(prev => {
        const updatedHistory = [...prev, newTip.id];
        return updatedHistory.slice(-5);
      });
    }
  }, [context, secondaryContext, tipHistory]);
  
  // Get initial tip on mount or when contexts change
  useEffect(() => {
    refreshTip();
  }, [context, secondaryContext, refreshTip]);
  
  // Set up interval for auto-refreshing if specified
  useEffect(() => {
    if (refreshInterval !== null && refreshInterval > 0) {
      const intervalId = setInterval(refreshTip, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, refreshTip]);
  
  // Get a specific tip by ID
  const getTipById = useCallback((id: string) => {
    return getCareerTipById(id);
  }, []);
  
  // Get tips by category
  const getTipsByCategory = useCallback((category: TipCategory) => {
    return getCareerTipsByCategory(category);
  }, []);
  
  return {
    currentTip,
    refreshTip,
    getTipById,
    getTipsByCategory
  };
}