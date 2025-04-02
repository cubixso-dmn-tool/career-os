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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/auth/LogoutButton";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function MobileSidebar({ isOpen, onClose, user }: MobileSidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/career-guide", icon: Compass, label: "Career Guide" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/projects", icon: GitBranch, label: "Projects" },
    { path: "/community", icon: MessageSquare, label: "Community" },
    { path: "/resume-builder", icon: FileText, label: "Resume Builder" },
    { path: "/soft-skills", icon: UserCheck, label: "Soft Skills" },
    { path: "/achievements", icon: Trophy, label: "Achievements" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
      <div className="relative bg-white w-64 h-full overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              CP
            </div>
            <h1 className="text-xl font-bold text-primary">CareerPath</h1>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a 
                className={cn(
                  "flex items-center px-4 py-2 rounded-md group transition-colors",
                  location === item.path
                    ? "text-primary bg-indigo-50"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-primary"
                )}
                onClick={onClose}
              >
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
      </div>
    </div>
  );
}
