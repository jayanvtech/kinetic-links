import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  position: number;
}

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("is_public", true)
        .single();

      if (profileError) {
        throw new Error("Profile not found");
      }

      setProfile(profileData);

      // Fetch links
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profileData.user_id)
        .eq("is_active", true)
        .order("position");

      if (linksError) throw linksError;

      setLinks(linksData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = async (link: Link) => {
    // Track analytics
    try {
      await supabase.from("link_analytics").insert({
        link_id: link.id,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
      });
    } catch (error) {
      console.error("Failed to track click:", error);
    }

    // Open link
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.display_name || profile?.username,
          text: profile?.bio || "Check out my links!",
          url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Profile link has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "ocean":
        return "bg-gradient-to-br from-blue-400 to-cyan-600";
      case "sunset":
        return "bg-gradient-to-br from-orange-400 to-pink-600";
      case "forest":
        return "bg-gradient-to-br from-green-400 to-emerald-600";
      case "minimal":
        return "bg-gradient-to-br from-gray-50 to-gray-200";
      default:
        return "bg-gradient-to-br from-purple-400 to-pink-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or is private.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getThemeClasses(profile.theme)} p-4`}>
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 mx-auto mb-4 float-animation">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-xl">
                {getInitials(profile.display_name || profile.username)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {profile.display_name || profile.username}
          </h1>
          
          {profile.bio && (
            <p className="text-white/90 text-sm mb-4 px-4">
              {profile.bio}
            </p>
          )}
          
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <Card
              key={link.id}
              className="link-card link-shimmer cursor-pointer transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleLinkClick(link)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {link.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {links.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/80">No links available yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-white/60 text-sm">
            Created with{" "}
            <span className="font-semibold text-white">KineticLinks</span>
          </p>
        </div>
      </div>
    </div>
  );
}