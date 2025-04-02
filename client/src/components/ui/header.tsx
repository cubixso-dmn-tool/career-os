import { Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
        <p className="text-gray-600">Continue your journey to career success</p>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5 text-gray-500" />
        </Button>
        <div className="relative">
          <Button variant="ghost" className="flex items-center space-x-2 text-gray-700">
            <span>Help</span>
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
