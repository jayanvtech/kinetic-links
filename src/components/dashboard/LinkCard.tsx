import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Save, X, ExternalLink, BarChart3, Copy, Instagram, Twitter, Youtube, Github, Globe, Mail, MapPin, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  position: number;
}

interface LinkCardProps {
  link: Link;
  onUpdate: (id: string, updates: Partial<Link>) => void;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, onUpdate, onDelete }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(link);
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

  const IconComponent = getIconComponent(link.icon);

  const handleSave = () => {
    if (!editData.title.trim() || !editData.url.trim()) {
      toast({
        title: "Error",
        description: "Title and URL are required",
        variant: "destructive",
      });
      return;
    }

    onUpdate(link.id, editData);
    setIsEditing(false);
    toast({
      title: "Link updated! ✨",
      description: "Your link has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setEditData(link);
    setIsEditing(false);
  };

  const handleToggleActive = () => {
    onUpdate(link.id, { is_active: !link.is_active });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(link.url);
    toast({
      title: "Copied! 📋",
      description: "Link URL copied to clipboard",
    });
  };

  if (isEditing) {
    return (
      <Card className="glass-card border-0 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Edit Link</h3>
                <p className="text-sm text-muted-foreground">Update your link details</p>
              </div>
            </div>
            <Badge variant="outline">Editing</Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Link title"
                className="rounded-xl border-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                placeholder="https://example.com"
                className="rounded-xl border-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={editData.description || ""}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Brief description"
                className="rounded-xl border-2 resize-none"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center space-x-3">
              <Switch
                checked={editData.is_active}
                onCheckedChange={(checked) => setEditData({ ...editData, is_active: checked })}
              />
              <Label className="text-sm font-medium">Active</Label>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" onClick={handleCancel} className="rounded-xl">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass-card border-0 shadow-lg transition-all duration-300 hover:shadow-xl group ${!link.is_active ? 'opacity-60' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              link.is_active 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-gray-400'
            }`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-lg truncate">{link.title}</h3>
                {!link.is_active && (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
                {link.is_active && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{link.url}</span>
              </div>
              
              {link.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {link.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <BarChart3 className="h-3 w-3" />
                  <span>247 clicks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>•</span>
                  <span>Created 2 days ago</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUrl}
              className="h-9 w-9 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600"
              title="Copy URL"
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleActive}
              className="h-9 w-9 p-0 rounded-lg hover:bg-green-50 hover:text-green-600"
              title="Toggle Active"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-9 w-9 p-0 rounded-lg hover:bg-purple-50 hover:text-purple-600"
              title="Edit Link"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(link.id)}
              className="h-9 w-9 p-0 rounded-lg hover:bg-red-50 hover:text-red-600"
              title="Delete Link"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}