import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  GitBranch,
  MessageSquare,
  FileText,
  UserCheck,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/auth/LogoutButton";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/career-guide", icon: Compass, label: "Career Guide" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/projects", icon: GitBranch, label: "Projects" },
    { path: "/community", icon: MessageSquare, label: "Community" },
    { path: "/resume-builder", icon: FileText, label: "Resume Builder" },
    { path: "/soft-skills", icon: UserCheck, label: "Soft Skills" },
    { path: "/achievements", icon: Trophy, label: "Achievements" }
  ];

  return (
    <aside className="hidden md:flex md:flex-col bg-white w-64 border-r border-gray-200 h-screen sticky top-0">
      <div className="p-4 flex items-center space-x-2">
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
          CP
        </div>
        <h1 className="text-xl font-bold text-primary">CareerPath</h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
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
  );
}
