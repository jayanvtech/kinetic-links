import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Save, X, ExternalLink, BarChart3 } from "lucide-react";
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
      title: "Link updated",
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

  if (isEditing) {
    return (
      <Card className="link-card">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Link title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={editData.url}
              onChange={(e) => setEditData({ ...editData, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={editData.description || ""}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Brief description"
              rows={2}
            />
          </div>

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={editData.is_active}
                onCheckedChange={(checked) => setEditData({ ...editData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="hero-button text-white">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`link-card ${!link.is_active ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg truncate">{link.title}</h3>
              {!link.is_active && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground truncate flex items-center mt-1">
              <ExternalLink className="h-3 w-3 mr-1" />
              {link.url}
            </p>
            
            {link.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {link.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleActive}
              className="h-8 w-8 p-0"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(link.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}