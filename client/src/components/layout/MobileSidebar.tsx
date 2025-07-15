import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  GitBranch,
  MessageSquare,
  FileText,
  UserCheck,
  Trophy,
  X,
  Bot,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/auth/LogoutButton";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface MobileSidebarProps {
  user: User;
}

export default function MobileSidebar({ user }: MobileSidebarProps) {
  const [location] = useLocation();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  if (!isSidebarOpen) return null;

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    // { path: "/ai-career-coach", icon: Bot, label: "AI Career Coach" },
    { path: "/industry-experts", icon: Users, label: "Expert Network" },
    { path: "/career-guide", icon: Compass, label: "Career Guide" },
    // { path: "/learning", icon: BookOpen, label: "Learning" },
    { path: "/community", icon: MessageSquare, label: "Community" },
    { path: "/resume-builder", icon: FileText, label: "Resume Builder" },
    // { path: "/soft-skills", icon: UserCheck, label: "Soft Skills" },
    // { path: "/achievements", icon: Trophy, label: "Achievements" }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden" 
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col md:hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              CP
            </div>
            <h1 className="text-xl font-bold text-primary">CareerOS</h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeSidebar}
            className="h-8 w-8 rounded-md"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} onClick={closeSidebar}>
              <a className={cn(
                "flex items-center px-4 py-2 rounded-md group transition-colors",
                location === item.path
                  ? "text-primary bg-indigo-50"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-primary"
              )}>
                <item.icon 
                  className={cn(
                    "mr-3",
                    location === item.path
                      ? "text-primary"
                      : "text-gray-500 group-hover:text-primary"
                  )}
                  size={18} 
                />
                <span className="font-medium">{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={user.avatar} 
                alt="Profile picture" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <LogoutButton className="w-full" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}