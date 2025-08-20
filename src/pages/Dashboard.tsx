import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Eye, BarChart3, Settings, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { AddLinkForm } from "@/components/dashboard/AddLinkForm";
import { LinkCard } from "@/components/dashboard/LinkCard";

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
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              KineticLinks Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your links and profile
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {profile?.username && (
              <Button
                onClick={handleViewProfile}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View Profile</span>
              </Button>
            )}
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Links</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AddLinkForm onAdd={handleAddLink} />
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient">
                        {links.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Links
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient">
                        {links.filter(l => l.is_active).length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Links
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Links</h2>
              {links.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="text-center py-12">
                    <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No links yet. Add your first link above!
                    </p>
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
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Analytics Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track clicks, views, and engagement metrics for your links.
                  This feature is coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}