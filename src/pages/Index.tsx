import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, Sparkles, BarChart3, Zap, Eye, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (session?.user) {
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient">KineticLinks</span>
            </div>
            <a 
              href="#auth" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </a>
          </div>
        </header>

        {/* Main Hero */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="text-gradient">One Link.</span>
                  <br />
                  <span className="text-foreground">Infinite Possibilities.</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Connect your audience to everything that matters with a beautiful, 
                  customizable link-in-bio page.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#auth">
                  <Button className="hero-button text-white px-8 py-3 text-lg">
                    Get Started Free
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Button variant="outline" className="px-8 py-3 text-lg">
                  <Eye className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Cards */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Card className="absolute top-20 left-10 w-48 glass-card float-animation opacity-80">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Link2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Social Links</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="absolute top-40 right-16 w-52 glass-card float-animation opacity-80" style={{ animationDelay: "1s" }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="font-medium">Click Analytics</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="absolute bottom-32 left-20 w-56 glass-card float-animation opacity-80" style={{ animationDelay: "2s" }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Custom Themes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to <span className="text-gradient">shine online</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional tools to grow your audience and track your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mx-auto mb-6">
                  <Link2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Unlimited Links</h3>
                <p className="text-muted-foreground">
                  Add as many links as you want. Social media, websites, products, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Beautiful Themes</h3>
                <p className="text-muted-foreground">
                  Choose from stunning themes or customize your own unique style.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Analytics</h3>
                <p className="text-muted-foreground">
                  Track clicks, understand your audience, and optimize your content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth" className="py-20 px-6">
        <div className="max-w-md mx-auto">
          <AuthForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gradient">KineticLinks</span>
          </div>
          <p className="text-muted-foreground">
            The modern way to share your links
          </p>
        </div>
      </footer>
    </>
  );
};

export default Index;
