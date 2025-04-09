import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function LogoutButton({
  variant = "outline",
  size = "sm",
  className = "",
}: LogoutButtonProps) {
  const { logout } = useAuthContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}