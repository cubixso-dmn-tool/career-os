import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Github } from "lucide-react";
import { SiGoogle } from "react-icons/si";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, loading } = useAuthContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  // Check OAuth configuration
  const { data: oauthConfig } = useQuery({
    queryKey: ["/api/auth/oauth-config"],
  });

  // Handle OAuth callback status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    
    if (status === 'success') {
      toast({
        title: "Login successful",
        description: message || "Welcome back!",
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'error') {
      setError(message || "OAuth login failed. Please try again.");
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      const result = await login(data.username, data.password);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        // The redirect is handled in the auth context
      } else {
        setError(result.message || "Login failed. Please check your credentials and try again.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials and try again.");
    }
  };

  const handleOAuthLogin = (provider: string) => {
    toast({
      title: "Redirecting...",
      description: `Connecting to ${provider} for secure authentication`,
    });
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-sm font-medium text-destructive mt-2">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          {/* Social Login Section */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("google")}
              disabled={loading || !oauthConfig?.google?.enabled}
              className="w-full"
            >
              <SiGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("github")}
              disabled={loading || !oauthConfig?.github?.enabled}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => setLocation("/register")}>
              Register
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}