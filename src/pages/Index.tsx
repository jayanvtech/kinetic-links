import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, Sparkles, BarChart3, Zap, Eye, Users, Star, Globe, Shield, Palette, QrCode, TrendingUp } from "lucide-react";
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
        <header className="p-6 relative z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Zap className="h-8 w-8 text-primary animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-2xl font-bold text-gradient">KineticLinks</span>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Star className="h-3 w-3 mr-1" />
                2.0
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                Features
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                Pricing
              </Button>
              <a 
                href="#auth" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </header>

        {/* Main Hero */}
        <main className="flex-1 flex items-center justify-center px-6 relative">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-center mb-4">
                  <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Trusted by 100,000+ creators
                  </Badge>
                </div>
                <h1 className="text-5xl md:text-8xl font-bold leading-tight">
                  <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                    One Link.
                  </span>
                  <br />
                  <span className="text-foreground">Infinite Impact.</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  The most powerful link-in-bio tool to showcase everything that matters. 
                  Drive traffic, engage audiences, and grow your brand with style.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="#auth">
                  <Button className="hero-button text-white px-10 py-4 text-lg h-auto rounded-full transform hover:scale-105 transition-all duration-300">
                    Start Building Free
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Button variant="outline" className="px-8 py-4 text-lg h-auto rounded-full border-2 hover:bg-white/10">
                  <Eye className="mr-2 h-5 w-5" />
                  View Live Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-8">
                <p className="text-sm text-muted-foreground mb-4">Join creators from top brands</p>
                <div className="flex justify-center items-center space-x-8 opacity-60">
                  <div className="h-8 w-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
                  <div className="h-8 w-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
                  <div className="h-8 w-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
                  <div className="h-8 w-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Cards */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Card className="absolute top-20 left-10 w-56 glass-card float-animation opacity-80 hidden lg:block">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Social Links</div>
                  <div className="text-xs text-muted-foreground">Connect everything</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="absolute top-40 right-16 w-64 glass-card float-animation opacity-80 hidden lg:block" style={{ animationDelay: "1s" }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Smart Analytics</div>
                  <div className="text-xs text-muted-foreground">Track performance</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="absolute bottom-32 left-20 w-60 glass-card float-animation opacity-80 hidden lg:block" style={{ animationDelay: "2s" }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Custom Themes</div>
                  <div className="text-xs text-muted-foreground">Express yourself</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="absolute bottom-40 right-12 w-52 glass-card float-animation opacity-80 hidden lg:block" style={{ animationDelay: "3s" }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">QR Codes</div>
                  <div className="text-xs text-muted-foreground">Share instantly</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Star className="h-4 w-4 mr-2" />
              Premium Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to <span className="text-gradient">dominate online</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools designed for creators, influencers, and businesses who want to make an impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card hover:scale-105 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Link2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Unlimited Links</h3>
                <p className="text-muted-foreground">
                  Add unlimited links to social media, websites, products, and more. No restrictions.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Stunning Themes</h3>
                <p className="text-muted-foreground">
                  Choose from 20+ beautiful themes or create your own with our advanced customizer.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Deep insights into clicks, traffic sources, geographic data, and audience behavior.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">QR Code Generator</h3>
                <p className="text-muted-foreground">
                  Generate custom QR codes for your profile and individual links for offline sharing.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Custom Domain</h3>
                <p className="text-muted-foreground">
                  Use your own domain name to reinforce your brand and build trust with your audience.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Privacy Controls</h3>
                <p className="text-muted-foreground">
                  Schedule links, password protection, and advanced privacy settings for sensitive content.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">100K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">50M+</div>
                <div className="text-sm text-muted-foreground">Link Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
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
