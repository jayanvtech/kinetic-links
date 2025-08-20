import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Link, Instagram, Twitter, Youtube, Github, Globe, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddLinkFormProps {
  onAdd: (linkData: {
    title: string;
    url: string;
    description?: string;
    icon?: string;
  }) => Promise<void>;
}

const linkTypes = [
  { value: "website", label: "Website", icon: Globe },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "github", label: "GitHub", icon: Github },
  { value: "email", label: "Email", icon: Mail },
  { value: "location", label: "Location", icon: MapPin },
  { value: "custom", label: "Custom", icon: Link },
];

export function AddLinkForm({ onAdd }: AddLinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [linkType, setLinkType] = useState("website");
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
  });
  const { toast } = useToast();

  const selectedType = linkTypes.find(type => type.value === linkType);
  const IconComponent = selectedType?.icon || Globe;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.url.trim()) {
      toast({
        title: "Error",
        description: "Title and URL are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await onAdd({
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim() || undefined,
        icon: linkType,
      });
      
      setFormData({ title: "", url: "", description: "" });
      setLinkType("website");
      toast({
        title: "Link added! 🎉",
        description: "Your new link has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderUrl = () => {
    switch (linkType) {
      case "instagram": return "https://instagram.com/username";
      case "twitter": return "https://twitter.com/username";
      case "youtube": return "https://youtube.com/@username";
      case "github": return "https://github.com/username";
      case "email": return "mailto:name@example.com";
      case "location": return "https://maps.google.com/...";
      default: return "https://example.com";
    }
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold">Add New Link</span>
              <p className="text-sm text-muted-foreground font-normal">
                Share what matters most to your audience
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Quick Add
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Link Type Selection */}
          <div className="space-y-3">
            <Label>Link Type</Label>
            <Select value={linkType} onValueChange={setLinkType}>
              <SelectTrigger className="rounded-xl border-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {linkTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          {/* Title Input */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <div className="relative">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`My ${selectedType?.label} Link`}
                className="rounded-xl border-2 h-12 pl-4 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
          </div>
          
          {/* URL Input */}
          <div className="space-y-3">
            <Label htmlFor="url" className="text-sm font-medium">
              URL *
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <IconComponent className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder={getPlaceholderUrl()}
                className="rounded-xl border-2 h-12 pl-12 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
          </div>
          
          {/* Description Input */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a brief description to help your audience understand what this link is about..."
              className="rounded-xl border-2 resize-none focus:border-primary/50 transition-all duration-200"
              rows={3}
            />
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding Link...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Add Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}