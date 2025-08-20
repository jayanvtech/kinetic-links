import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { LivePreview } from "../preview/LivePreview";
import { Save, Upload, User, Eye, Palette, Sparkles } from "lucide-react";
import { toast } from "../ui/use-toast";

interface Profile {
  id?: string;
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
  icon?: string;
  isActive: boolean;
}

interface ProfileEditorProps {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

const themes = [
  { value: "minimal", label: "Minimal", preview: "from-gray-100 to-gray-300", description: "Clean and simple" },
  { value: "sunset", label: "Sunset", preview: "from-orange-400 to-pink-500", description: "Warm and vibrant" },
  { value: "ocean", label: "Ocean", preview: "from-blue-400 to-purple-500", description: "Cool and calming" },
  { value: "forest", label: "Forest", preview: "from-green-400 to-emerald-500", description: "Natural and fresh" },
  { value: "cosmic", label: "Cosmic", preview: "from-purple-600 to-blue-600", description: "Deep and mysterious" },
  { value: "aurora", label: "Aurora", preview: "from-purple-400 via-pink-400 to-red-400", description: "Magical gradient" },
];

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
  const [formData, setFormData] = useState<Profile>({
    username: "",
    display_name: "",
    bio: "",
    avatar_url: "",
    theme: "minimal",
    is_public: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Mock links data - in real app this would come from props or API
  const [mockLinks] = useState<Link[]>([
    { id: '1', title: 'Portfolio Website', url: 'https://example.com', icon: '🌐', isActive: true },
    { id: '2', title: 'GitHub Profile', url: 'https://github.com', icon: '💻', isActive: true },
    { id: '3', title: 'LinkedIn', url: 'https://linkedin.com', icon: '💼', isActive: true },
    { id: '4', title: 'Twitter', url: 'https://twitter.com', icon: '🐦', isActive: false },
  ]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        theme: profile.theme || "minimal",
        is_public: profile.is_public !== undefined ? profile.is_public : true,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username for your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await onUpdate(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <Card className="glass-card border-0 shadow-lg hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span>Profile Settings</span>
                  <p className="text-sm text-muted-foreground font-normal">
                    Customize your public profile
                  </p>
                </div>
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="gap-2 hover-lift"
              >
                <Eye className="h-4 w-4" />
                Live Preview
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={formData.avatar_url} />
                    <AvatarFallback className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {getInitials(formData.display_name || formData.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover-scale cursor-pointer">
                    <Upload className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <div className="flex space-x-3">
                    <Input
                      id="avatar"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="focus-ring"
                    />
                    <Button type="button" variant="outline" className="hover-scale">
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="your-username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="focus-ring"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    placeholder="Your Full Name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="focus-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell people about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="min-h-[100px] focus-ring"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full btn-premium hover-lift"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card className="glass-card border-0 shadow-lg hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div>
                <span>Theme Customization</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Choose your perfect style
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Select Theme</Label>
                <div className="grid grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <div
                      key={theme.value}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover-lift ${
                        formData.theme === theme.value
                          ? 'border-purple-500 ring-2 ring-purple-200'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setFormData({ ...formData, theme: theme.value })}
                    >
                      <div className={`w-full h-16 rounded-lg bg-gradient-to-r ${theme.preview} mb-3`}></div>
                      <h4 className="font-medium text-sm">{theme.label}</h4>
                      <p className="text-xs text-muted-foreground">{theme.description}</p>
                      
                      {formData.theme === theme.value && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-purple-500 hover:bg-purple-600">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Current Theme Preview
                </h4>
                <div className={`w-full h-20 rounded-lg bg-gradient-to-r ${
                  themes.find(t => t.value === formData.theme)?.preview || themes[0].preview
                } flex items-center justify-center`}>
                  <div className="text-white font-medium text-sm">
                    {formData.display_name || formData.username || 'Your Profile'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Modal */}
      <LivePreview
        profile={{
          name: formData.display_name || formData.username,
          bio: formData.bio || '',
          avatar: formData.avatar_url,
          theme: formData.theme,
          links: mockLinks
        }}
        isVisible={showPreview}
        onToggle={() => setShowPreview(!showPreview)}
      />
    </>
  );
}
