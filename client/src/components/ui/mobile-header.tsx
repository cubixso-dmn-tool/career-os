import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";

interface MobileHeaderProps {
  user: {
    name: string;
    avatar: string;
  };
}

export default function MobileHeader({ user }: MobileHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-white shadow-sm py-4 px-4 flex justify-between items-center md:hidden">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
          CP
        </div>
        <h1 className="text-xl font-bold text-primary">CareerPath</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-500" aria-label="Notifications">
          <Bell className="h-6 w-6" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
