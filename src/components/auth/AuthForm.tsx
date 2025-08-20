import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { supabase } from '../../integrations/supabase/client';
import { Mail, Lock, User, Eye, EyeOff, Github, Chrome, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '../ui/use-toast';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [activeTab, setActiveTab] = useState('signin');

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (activeTab === 'signup') {
      if (!fullName) {
        toast({
          title: "Missing Information",
          description: "Please enter your full name",
          variant: "destructive",
        });
        return false;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return false;
      }
      if (password.length < 6) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (activeTab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "OAuth Error",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const features = [
    { icon: CheckCircle, text: "Unlimited links" },
    { icon: CheckCircle, text: "Custom themes" },
    { icon: CheckCircle, text: "Analytics dashboard" },
    { icon: CheckCircle, text: "QR code generation" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Branding & Features - Only visible on large screens */}
          <div className="hidden lg:block space-y-8 animate-fade-in-up">
            <div className="text-left">
              <div className="flex items-center justify-start gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold gradient-text">KineticLinks</h1>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Your links,{' '}
                <span className="gradient-text">beautifully</span>{' '}
                organized
              </h2>
              
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Create stunning link-in-bio pages with real-time analytics, 
                custom themes, and professional QR codes.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-6 rounded-xl glass-card hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-start gap-12 pt-8">
              <div className="text-left">
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold gradient-text">50K+</div>
                <div className="text-sm text-gray-500">Links Created</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold gradient-text">99.9%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
            </div>
          </div>

          {/* Mobile Header - Only visible on mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">KineticLinks</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create beautiful link-in-bio pages
            </p>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex items-center justify-center w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="w-full max-w-lg auth-form hover-lift shadow-2xl">
              <CardHeader className="space-y-1 text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  {activeTab === 'signin' ? 'Welcome back' : 'Create account'}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                  {activeTab === 'signin' 
                    ? 'Sign in to your account to continue' 
                    : 'Start building your link-in-bio page today'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8 px-8 pb-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 glass p-1 h-12">
                    <TabsTrigger value="signin" className="hover-scale h-10 text-base font-medium">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="hover-scale h-10 text-base font-medium">Sign Up</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-y-8 mt-8">
                    <TabsContent value="signin" className="space-y-6 mt-0">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-12 text-base focus-ring"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-base font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 pr-12 h-12 text-base focus-ring"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-8 w-8 p-0 hover-scale"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full btn-premium hover-lift h-12 text-base" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Signing in...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-6 mt-0">
                      <div className="space-y-3">
                        <Label htmlFor="fullName" className="text-base font-medium">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-12 h-12 text-base focus-ring"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-12 text-base focus-ring"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-base font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 pr-12 h-12 text-base focus-ring"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-8 w-8 p-0 hover-scale"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                        </div>
                        {password && (
                          <div className="flex items-center gap-2 text-sm">
                            {password.length >= 6 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={password.length >= 6 ? 'text-green-500' : 'text-red-500'}>
                              At least 6 characters
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="text-base font-medium">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-12 h-12 text-base focus-ring"
                            required
                          />
                        </div>
                        {confirmPassword && (
                          <div className="flex items-center gap-2 text-sm">
                            {password === confirmPassword ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={password === confirmPassword ? 'text-green-500' : 'text-red-500'}>
                              Passwords match
                            </span>
                          </div>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full btn-premium hover-lift h-12 text-base" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creating account...
                          </div>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </TabsContent>
                  </form>
                </Tabs>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={isLoading}
                    className="hover-lift glow-on-hover h-12 text-base"
                  >
                    <Chrome className="mr-2 h-5 w-5" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={isLoading}
                    className="hover-lift glow-on-hover h-12 text-base"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  By signing up, you agree to our{' '}
                  <a href="#" className="font-medium text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-primary hover:underline">
                    Privacy Policy
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}