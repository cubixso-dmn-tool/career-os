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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { SiGoogle } from "react-icons/si";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, loading, signInWithGoogle, isAuthenticated, user } = useAuthContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Debug: Check auth state
  console.log('🔍 Login page - Auth state:', { isAuthenticated, user, loading });

  // Check OAuth configuration
  const { data: oauthConfig } = useQuery({
    queryKey: ["/api/auth/oauth-config"],
  });

  // Handle OAuth callback status and tokens
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    // Handle OAuth tokens - let the auth context handle this
    if (accessToken && refreshToken) {
      toast({
        title: "Login successful",
        description: "Welcome to CareerOS!",
      });
      // Auth context will handle token storage and redirect
      return;
    }
    
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

  const handleOAuthLogin = async (provider: string) => {
    setOauthLoading(provider);
    
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      }
    } catch (error: any) {
      console.error(`${provider} sign in error:`, error);
      
      // Check if it's an unauthorized domain error
      if (error?.message?.includes('unauthorized') || error?.message?.includes('domain')) {
        const currentDomain = window.location.hostname;
        toast({
          title: "Domain Authorization Required",
          description: `Add "${currentDomain}" to Firebase authorized domains`,
          variant: "destructive",
        });
        console.log('🔧 Fix: Add this domain to Firebase Console → Authentication → Settings → Authorized domains:', currentDomain);
      }
    } finally {
      setOauthLoading(null);
    }
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
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </button>
                    </div>
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
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            disabled={loading || oauthLoading === "google"}
            className="w-full"
          >
            {oauthLoading === "google" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <SiGoogle className="mr-2 h-4 w-4" />
                {(oauthConfig as any)?.firebase ? "Continue with Google" : "Continue with Google (Demo)"}
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <Button variant="link" className="p-0" onClick={() => setLocation("/forgot-password")}>
              Forgot your password?
            </Button>
          </div>
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