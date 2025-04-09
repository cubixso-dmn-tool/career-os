import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useAuth();

  return (
    <Button 
      variant="outline" 
      className={className} 
      onClick={logout}
    >
      <LogOut className="h-4 w-4 mr-2" /> 
      Logout
    </Button>
  );
}