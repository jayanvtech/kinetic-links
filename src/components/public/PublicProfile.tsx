import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Share2, Instagram, Twitter, Youtube, Github, Globe, Mail, MapPin, Link, Heart, QrCode } from "lucide-react";
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
  const [viewCount, setViewCount] = useState(0);
  const { toast } = useToast();

  const getIconComponent = (iconType?: string) => {
    switch (iconType) {
      case "instagram": return Instagram;
      case "twitter": return Twitter;
      case "youtube": return Youtube;
      case "github": return Github;
      case "email": return Mail;
      case "location": return MapPin;
      case "website":
      default: return Globe;
    }
  };

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
        return "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500";
      case "sunset":
        return "bg-gradient-to-br from-orange-500 via-pink-500 to-red-500";
      case "forest":
        return "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500";
      case "minimal":
        return "bg-gradient-to-br from-gray-100 to-gray-300";
      case "cosmic":
        return "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";
      case "tropical":
        return "bg-gradient-to-br from-teal-500 via-green-500 to-lime-500";
      case "fire":
        return "bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500";
      default:
        return "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500";
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
    <div className={`min-h-screen ${getThemeClasses(profile.theme)} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-16 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-white rounded-full blur-xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-sm mx-auto">
          {/* Header with Stats */}
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Heart className="h-3 w-3 mr-1" />
                {viewCount + 847} views
              </Badge>
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Avatar */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-lg animate-pulse"></div>
              <Avatar className="relative h-28 w-28 mx-auto border-4 border-white/40 shadow-2xl">
                <AvatarImage src={profile.avatar_url} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                  {getInitials(profile.display_name || profile.username)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                <span className="text-xs">✨</span>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                {profile.display_name || profile.username}
              </h1>
              
              <p className="text-white/90 text-sm font-medium">
                @{profile.username}
              </p>
              
              {profile.bio && (
                <p className="text-white/90 text-base leading-relaxed px-4 max-w-xs mx-auto">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 mt-6">
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 rounded-full px-6"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 rounded-full px-6"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            {links.map((link, index) => {
              const IconComponent = getIconComponent(link.icon);
              return (
                <Card
                  key={link.id}
                  className="bg-white/95 backdrop-blur-sm border-0 shadow-xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-2xl group overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    animation: 'slide-up 0.6s ease-out forwards'
                  }}
                  onClick={() => handleLinkClick(link)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center space-x-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-sm text-gray-600 truncate">
                            {link.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Arrow */}
                      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {links.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Link className="h-8 w-8 text-white" />
                </div>
                <p className="text-white/90 text-lg font-medium">No links yet</p>
                <p className="text-white/70 text-sm">Check back soon for updates!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-16 pb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white/80 text-sm">Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span className="font-semibold text-white text-sm">KineticLinks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}