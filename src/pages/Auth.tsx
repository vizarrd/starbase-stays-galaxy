import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    setIsLoading(false);

    if (error) {
      let errorMessage = error.message;
      
      // Handle common signup errors
      if (error.message.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please sign in instead or use a different email address.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "Password must be at least 6 characters long.";
      }
      
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created Successfully!",
        description: "Please check your email for a confirmation link to complete your registration.",
        duration: 6000,
      });
      // Clear form after successful signup
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password to sign in.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      let errorMessage = error.message;
      let errorTitle = "Sign In Failed";
      
      // Handle specific authentication errors with helpful messages
      if (error.message === "Invalid login credentials" || error.message.includes("invalid_credentials")) {
        errorTitle = "Invalid Credentials";
        errorMessage = "The email or password you entered is incorrect. Please check your credentials and try again.";
      } else if (error.message === "Email not confirmed" || error.message.includes("email_not_confirmed")) {
        errorTitle = "Email Not Confirmed";
        errorMessage = "Please check your email inbox (and spam folder) for a confirmation link to activate your account.";
      } else if (error.message.includes("Invalid email")) {
        errorTitle = "Invalid Email";
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("Too many requests")) {
        errorTitle = "Too Many Attempts";
        errorMessage = "Too many sign-in attempts. Please wait a few minutes before trying again.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in to your account.",
      });
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Google Sign In Failed",
        description: error.message || "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first, then click 'Forgot Password' to reset it.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Password Reset Failed",
        description: error.message || "Unable to send password reset email. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-primary glow-text-red mb-2">
            GALACTIC ACCESS
          </h1>
          <p className="text-muted-foreground font-exo">
            Join the galaxy's finest accommodation network
          </p>
        </div>

        <Card className="bg-card/90 backdrop-blur-md border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-orbitron text-foreground">Authentication Console</CardTitle>
            <CardDescription className="font-exo">
              Access your galactic travel account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="font-exo">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="font-exo">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-exo flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-exo flex items-center">
                    <Lock className="w-4 h-4 mr-1 text-accent" />
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground hover:text-primary p-0 h-auto font-exo"
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  onClick={handleSignIn}
                  disabled={isLoading || !email || !password}
                  className="w-full"
                  variant="lightsaber"
                >
                  {isLoading ? "Accessing..." : "Enter the Galaxy"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-exo">Or continue with</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground font-exo">
                      <p className="font-medium mb-1">Having trouble signing in?</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Double-check your email and password</li>
                        <li>• Make sure your email is confirmed</li>
                        <li>• Use "Forgot password?" if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-exo flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-exo flex items-center">
                    <Lock className="w-4 h-4 mr-1 text-accent" />
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-exo flex items-center">
                    <Lock className="w-4 h-4 mr-1 text-rebel" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>

                <Button
                  onClick={handleSignUp}
                  disabled={isLoading || !email || !password || !confirmPassword}
                  className="w-full"
                  variant="lightsaber-blue"
                >
                  {isLoading ? "Creating Account..." : "Join the Rebellion"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-exo">Or continue with</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground font-exo">
                      <p className="font-medium mb-1">Account creation tips:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Use a valid email address</li>
                        <li>• Password must be at least 6 characters</li>
                        <li>• Check your email for confirmation link</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;