import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function LogoutButton({
  variant = "outline",
  size = "sm",
  className = "",
}: LogoutButtonProps) {
  const { logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/login");
      }
    });
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