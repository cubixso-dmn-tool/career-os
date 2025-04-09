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
  ChevronLeft,
  ChevronRight
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

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebar();

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
    <aside className={cn(
      "hidden md:flex md:flex-col h-screen sticky top-0 overflow-y-auto bg-white border-r transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn(
        "flex items-center h-16 px-4 border-b",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "space-x-2")}>
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
            CP
          </div>
          {!isCollapsed && <h1 className="text-xl font-bold text-primary">CareerOS</h1>}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={cn("h-8 w-8 rounded-md", isCollapsed ? "absolute left-[76px]" : "")}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a className={cn(
                  "flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center" : "",
                  location === item.path
                    ? "text-primary bg-indigo-50"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-primary"
                )}>
                  <item.icon 
                    className={cn(
                      isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3",
                      location === item.path
                        ? "text-primary"
                        : "text-gray-500 group-hover:text-primary"
                    )}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={cn(
        "border-t p-4",
        isCollapsed ? "flex flex-col items-center" : ""
      )}>
        <div className={cn(
          "mb-4",
          isCollapsed ? "flex flex-col items-center" : "flex items-center space-x-3"
        )}>
          <img 
            src={user.avatar}
            alt="User avatar" 
            className="h-8 w-8 rounded-full object-cover"
          />
          
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
        </div>
        
        {!isCollapsed ? (
          <LogoutButton className="w-full" />
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 h-9 w-9"
          >
            <LogoutButton />
          </Button>
        )}
      </div>
    </aside>
  );
}