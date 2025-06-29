import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, GitBranch, MessageSquare, Bot, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/ai-career-coach", icon: Bot, label: "AI Coach" },
    { path: "/industry-experts", icon: Users, label: "Experts" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/projects", icon: GitBranch, label: "Projects" },
    { path: "/community", icon: MessageSquare, label: "Community" }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-10">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a className="flex flex-col items-center">
              <item.icon
                className={cn(
                  "text-lg",
                  location === item.path ? "text-primary" : "text-gray-500"
                )}
                size={20}
              />
              <span className={cn(
                "text-xs mt-1",
                location === item.path ? "text-primary" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
