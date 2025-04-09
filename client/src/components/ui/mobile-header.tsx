import { useSidebar } from "@/hooks/use-sidebar";
import { Menu } from "lucide-react";
import { Button } from "./button";

interface User {
  name: string;
  avatar: string;
}

interface MobileHeaderProps {
  user: User;
  title?: string;
}

export default function MobileHeader({ user, title }: MobileHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 md:hidden">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-gray-600"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              CP
            </div>
            {title ? (
              <h1 className="text-lg font-bold">{title}</h1>
            ) : (
              <h1 className="text-lg font-bold text-primary">CareerOS</h1>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <img 
            src={user.avatar} 
            alt={`${user.name}'s profile picture`} 
            className="h-8 w-8 rounded-full object-cover" 
          />
        </div>
      </div>
    </div>
  );
}