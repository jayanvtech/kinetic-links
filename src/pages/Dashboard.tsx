import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LogOut, Eye, BarChart3, Settings, Plus, TrendingUp, Users, MousePointer, QrCode, Palette, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { AddLinkForm } from "@/components/dashboard/AddLinkForm";
import { LinkCard } from "@/components/dashboard/LinkCard";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { QRCodeGenerator } from "@/components/ui/qr-code";

interface Profile {
  id: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme: string;
  is_public: boolean;
}

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  position: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchLinks();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/");
      return;
    }
    setUser(session.user);
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  };

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", user.id)
        .order("position");

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load links",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (updates: Partial<Profile>) => {
    try {
      if (profile) {
        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", profile.id);

        if (error) throw error;
      } else {
        // Ensure username is provided for new profiles
        if (!updates.username) {
          throw new Error("Username is required");
        }
        
        const { error } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            username: updates.username,
            display_name: updates.display_name,
            bio: updates.bio,
            avatar_url: updates.avatar_url,
            theme: updates.theme || "gradient",
            is_public: updates.is_public !== undefined ? updates.is_public : true,
          });

        if (error) throw error;
      }

      await fetchProfile();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleAddLink = async (linkData: {
    title: string;
    url: string;
    description?: string;
    icon?: string;
  }) => {
    try {
      const nextPosition = links.length;
      
      const { error } = await supabase
        .from("links")
        .insert({
          user_id: user.id,
          ...linkData,
          position: nextPosition,
        });

      if (error) throw error;
      await fetchLinks();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleUpdateLink = async (id: string, updates: Partial<Link>) => {
    try {
      const { error } = await supabase
        .from("links")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, ...updates } : link
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setLinks(prev => prev.filter(link => link.id !== id));
      toast({
        title: "Link deleted",
        description: "Your link has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleViewProfile = () => {
    if (profile?.username) {
      window.open(`/${profile.username}`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Enhanced Header */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gradient">
                  KineticLinks Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back! {profile?.display_name || profile?.username || 'Creator'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {profile?.username && (
                <Button
                  onClick={handleViewProfile}
                  variant="outline"
                  className="flex items-center space-x-2 rounded-full"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Profile</span>
                </Button>
              )}
              
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center space-x-2 rounded-full"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Links</p>
                  <p className="text-3xl font-bold text-gradient">{links.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Links</p>
                  <p className="text-3xl font-bold text-gradient">{links.filter(l => l.is_active).length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-3xl font-bold text-gradient">2.4K</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <MousePointer className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                  <p className="text-3xl font-bold text-gradient">847</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="links" className="space-y-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-lg w-fit mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-transparent">
              <TabsTrigger value="links" className="flex items-center space-x-2 rounded-xl">
                <Plus className="h-4 w-4" />
                <span>Links</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2 rounded-xl">
                <Settings className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2 rounded-xl">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="customize" className="flex items-center space-x-2 rounded-xl">
                <Palette className="h-4 w-4" />
                <span>Design</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="links" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <AddLinkForm onAdd={handleAddLink} />
              </div>
              
              <div className="space-y-6">
                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Profile Completion</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Most Clicked</span>
                        <Badge variant="secondary">Social Media</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Best Time</span>
                        <Badge variant="secondary">2-4 PM</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <QrCode className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Mode
                    </Button>
                    {profile?.username && (
                      <QRCodeGenerator
                        url={`${window.location.origin}/${profile.username}`}
                        title={`${profile.display_name || profile.username}'s Profile`}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Links</h2>
                <Badge variant="outline" className="text-sm">
                  {links.length} / ∞ links
                </Badge>
              </div>
              {links.length === 0 ? (
                <Card className="glass-card border-0 shadow-lg">
                  <CardContent className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                      <Plus className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Create Your First Link</h3>
                    <p className="text-muted-foreground mb-6">
                      Start building your link-in-bio page by adding your first link above
                    </p>
                    <Button className="rounded-full">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {links.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onUpdate={handleUpdateLink}
                      onDelete={handleDeleteLink}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileEditor
              profile={profile}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="customize">
            <Card className="glass-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Theme Customization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Color Themes</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 cursor-pointer hover:scale-105 transition-transform"></div>
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 cursor-pointer hover:scale-105 transition-transform"></div>
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 cursor-pointer hover:scale-105 transition-transform"></div>
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 cursor-pointer hover:scale-105 transition-transform"></div>
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 cursor-pointer hover:scale-105 transition-transform"></div>
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 cursor-pointer hover:scale-105 transition-transform"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Button Styles</h3>
                    <div className="space-y-3">
                      <Button className="w-full rounded-full">Rounded</Button>
                      <Button className="w-full rounded-lg" variant="outline">Outline</Button>
                      <Button className="w-full rounded-none" variant="secondary">Square</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Background Patterns</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 cursor-pointer hover:scale-105 transition-transform border-2 border-purple-200"></div>
                      <div className="w-full h-16 rounded-lg bg-white cursor-pointer hover:scale-105 transition-transform border-2 border-gray-200"></div>
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 cursor-pointer hover:scale-105 transition-transform"></div>
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 cursor-pointer hover:scale-105 transition-transform border-2 border-blue-200"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}