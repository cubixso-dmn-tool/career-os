import React from 'react';
import { Cloud, HardDrive, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StorageIndicatorProps {
  isLocal?: boolean;
  className?: string;
}

export const StorageIndicator: React.FC<StorageIndicatorProps> = ({ isLocal, className = "" }) => {
  if (isLocal) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center ${className}`}>
              <HardDrive className="h-3 w-3 text-orange-600 mr-1" />
              <span className="text-xs text-orange-600">Local</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Saved locally in your browser. Sign in to sync to cloud.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center ${className}`}>
            <Cloud className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-xs text-green-600">Cloud</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Synced to cloud and accessible from any device.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface LocalStorageWarningProps {
  resumeCount: number;
  className?: string;
}

export const LocalStorageWarning: React.FC<LocalStorageWarningProps> = ({ resumeCount, className = "" }) => {
  if (resumeCount === 0) return null;

  return (
    <div className={`bg-orange-50 border border-orange-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-orange-800 font-medium">
            {resumeCount} resume{resumeCount > 1 ? 's' : ''} stored locally
          </p>
          <p className="text-orange-700 mt-1">
            Your data is only saved in this browser. Sign in to sync your resumes to the cloud and access them from any device.
          </p>
        </div>
      </div>
    </div>
  );
};