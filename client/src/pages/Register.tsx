import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface ValidationState {
  username: {
    checking: boolean;
    available: boolean | null;
    message: string;
  };
  email: {
    checking: boolean;
    available: boolean | null;
    message: string;
  };
}

export default function Register() {
  const { register, loading } = useAuthContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationState>({
    username: { checking: false, available: null, message: '' },
    email: { checking: false, available: null, message: '' }
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const checkUniqueness = async (field: 'username' | 'email', value: string) => {
    if (!value || (field === 'username' && value.length < 3) || (field === 'email' && !value.includes('@'))) {
      return;
    }

    setValidation(prev => ({
      ...prev,
      [field]: { ...prev[field], checking: true, available: null, message: '' }
    }));

    try {
      const response = await fetch(`/api/auth/check-uniqueness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }),
      });

      if (response.ok) {
        const data = await response.json();
        const available = data.available;
        const message = available 
          ? `${field === 'username' ? 'Username' : 'Email'} is available` 
          : `This ${field} is already taken`;

        setValidation(prev => ({
          ...prev,
          [field]: { checking: false, available, message }
        }));
      } else {
        setValidation(prev => ({
          ...prev,
          [field]: { checking: false, available: null, message: 'Unable to verify availability' }
        }));
      }
    } catch (error) {
      setValidation(prev => ({
        ...prev,
        [field]: { checking: false, available: null, message: 'Unable to verify availability' }
      }));
    }
  };

  const [usernameTimer, setUsernameTimer] = useState<NodeJS.Timeout | null>(null);
  const [emailTimer, setEmailTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCheckUsername = useCallback((value: string) => {
    if (usernameTimer) {
      clearTimeout(usernameTimer);
    }
    const timer = setTimeout(() => {
      checkUniqueness('username', value);
    }, 500);
    setUsernameTimer(timer);
  }, [usernameTimer]);

  const debouncedCheckEmail = useCallback((value: string) => {
    if (emailTimer) {
      clearTimeout(emailTimer);
    }
    const timer = setTimeout(() => {
      checkUniqueness('email', value);
    }, 500);
    setEmailTimer(timer);
  }, [emailTimer]);

  useEffect(() => {
    return () => {
      if (usernameTimer) clearTimeout(usernameTimer);
      if (emailTimer) clearTimeout(emailTimer);
    };
  }, [usernameTimer, emailTimer]);

  const onSubmit = async (data: RegisterFormValues) => {
    // Check if validation is still in progress or failed
    if (validation.username.checking || validation.email.checking) {
      setError("Please wait for validation to complete.");
      return;
    }

    if (validation.username.available === false || validation.email.available === false) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    try {
      setError(null);
      // Remove confirmPassword as the API doesn't need it
      const { confirmPassword, ...registrationData } = data;
      await register(registrationData);
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const ValidationIndicator = ({ field }: { field: 'username' | 'email' }) => {
    const state = validation[field];
    
    if (state.checking) {
      return (
        <div className="flex items-center text-sm text-blue-600 mt-1">
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          Checking availability...
        </div>
      );
    }

    if (state.available === true) {
      return (
        <div className="flex items-center text-sm text-green-600 mt-1">
          <CheckCircle className="h-3 w-3 mr-1" />
          {state.message}
        </div>
      );
    }

    if (state.available === false) {
      return (
        <div className="flex items-center text-sm text-red-600 mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {state.message}
        </div>
      );
    }

    if (state.message && state.available === null) {
      return (
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {state.message}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new account
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
                      <Input 
                        placeholder="Choose a username" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          const value = e.target.value;
                          setValidation(prev => ({
                            ...prev,
                            username: { checking: false, available: null, message: '' }
                          }));
                          if (value.length >= 3) {
                            debouncedCheckUsername(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <ValidationIndicator field="username" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          const value = e.target.value;
                          setValidation(prev => ({
                            ...prev,
                            email: { checking: false, available: null, message: '' }
                          }));
                          if (value.includes('@') && value.includes('.')) {
                            debouncedCheckEmail(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <ValidationIndicator field="email" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => setLocation("/login")}>
              Login
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}