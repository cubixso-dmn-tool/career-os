import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AuthDemo() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Check OAuth configuration
  const { data: oauthConfig } = useQuery({
    queryKey: ["/api/auth/oauth-config"],
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      return apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: data.message || "Account created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      return apiRequest("/api/auth/jwt-login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: (data) => {
      // Store tokens (in production, use secure storage)
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.username}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleRegister = () => {
    if (!username || !email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({
      username,
      email,
      password,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || username,
    });
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate({
      username: loginEmail,
      password: loginPassword,
    });
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔐 Enterprise Authentication Demo</h1>
        <p className="text-muted-foreground">
          Test the advanced authentication features including JWT tokens, OAuth, and email verification.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication System</CardTitle>
            <CardDescription>
              Register new accounts or login with JWT-based authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="register" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                  className="w-full"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Register"}
                </Button>
              </TabsContent>
              
              <TabsContent value="login" className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email or Username"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Button 
                  onClick={handleLogin}
                  disabled={loginMutation.isPending}
                  className="w-full"
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* OAuth & Features */}
        <Card>
          <CardHeader>
            <CardTitle>OAuth & Advanced Features</CardTitle>
            <CardDescription>
              Social login and enterprise security features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Social Login</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={!oauthConfig?.google}
                >
                  {oauthConfig?.google ? "Login with Google" : "Google OAuth Not Configured"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={!oauthConfig?.github}
                >
                  {oauthConfig?.github ? "Login with GitHub" : "GitHub OAuth Not Configured"}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Enterprise Features</h4>
              <div className="space-y-2">
                <Badge variant="secondary">JWT Token Management</Badge>
                <Badge variant="secondary">Email Verification</Badge>
                <Badge variant="secondary">Password Reset</Badge>
                <Badge variant="secondary">2FA Ready</Badge>
                <Badge variant="secondary">Admin Logging</Badge>
                <Badge variant="secondary">Rate Limiting</Badge>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Development Mode:</strong> Email verification uses Ethereal test accounts. 
                Check the server logs for email credentials and preview URLs.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints Documentation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Available API Endpoints</CardTitle>
          <CardDescription>
            Enterprise authentication APIs ready for production use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Authentication APIs</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>POST /api/auth/register</code> - User registration</li>
                <li><code>POST /api/auth/jwt-login</code> - JWT login</li>
                <li><code>POST /api/auth/refresh-token</code> - Token refresh</li>
                <li><code>GET /api/auth/me</code> - Current user info</li>
                <li><code>POST /api/auth/forgot-password</code> - Password reset</li>
                <li><code>GET /api/auth/verify-email</code> - Email verification</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Admin & Security APIs</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>GET /api/admin-logs/*</code> - Enterprise logging</li>
                <li><code>GET /api/auth/oauth-config</code> - OAuth status</li>
                <li><code>POST /api/auth/setup-2fa</code> - Two-factor auth</li>
                <li><code>GET /api/auth/google</code> - Google OAuth</li>
                <li><code>GET /api/auth/github</code> - GitHub OAuth</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}