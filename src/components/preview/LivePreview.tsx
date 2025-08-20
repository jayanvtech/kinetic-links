import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, EyeOff, Smartphone, Monitor, Tablet } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface PreviewProps {
  profile: {
    name: string;
    bio: string;
    avatar?: string;
    theme: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      icon?: string;
      isActive: boolean;
    }>;
  };
  isVisible: boolean;
  onToggle: () => void;
}

export function LivePreview({ profile, isVisible, onToggle }: PreviewProps) {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isLive, setIsLive] = useState(true);

  // Device dimensions
  const deviceSizes = {
    mobile: { width: '375px', height: '667px' },
    tablet: { width: '768px', height: '1024px' },
    desktop: { width: '1200px', height: '800px' }
  };

  const getThemeClass = (theme: string) => {
    switch (theme) {
      case 'minimal': return 'theme-minimal';
      case 'sunset': return 'theme-sunset';
      case 'ocean': return 'theme-ocean';
      case 'forest': return 'theme-forest';
      case 'cosmic': return 'theme-cosmic';
      case 'aurora': return 'theme-aurora';
      default: return 'theme-minimal';
    }
  };

  const DeviceIcon = ({ type }: { type: 'mobile' | 'tablet' | 'desktop' }) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
    }
  };

  const handleLinkClick = (url: string, title: string) => {
    if (isLive) {
      // In live mode, prevent actual navigation
      toast({
        title: "Link Preview",
        description: `Would navigate to: ${title}`,
        duration: 2000,
      });
    } else {
      // In preview mode, allow navigation
      window.open(url, '_blank');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] glass-card border-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isLive ? "default" : "secondary"} className="gap-1">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {isLive ? 'Live' : 'Static'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className="hover-scale"
              >
                {isLive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Selector */}
            <div className="flex bg-secondary rounded-lg p-1">
              {(['mobile', 'tablet', 'desktop'] as const).map((deviceType) => (
                <Button
                  key={deviceType}
                  variant={device === deviceType ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDevice(deviceType)}
                  className="gap-2 hover-scale"
                >
                  <DeviceIcon type={deviceType} />
                  {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="hover-scale"
            >
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="relative">
            {/* Device Frame */}
            <div
              className={`
                relative overflow-hidden rounded-lg shadow-2xl transition-all duration-300
                ${device === 'mobile' ? 'rounded-3xl border-8 border-gray-800' : ''}
                ${device === 'tablet' ? 'rounded-2xl border-4 border-gray-600' : ''}
                ${device === 'desktop' ? 'rounded-lg border-2 border-gray-400' : ''}
              `}
              style={{
                width: deviceSizes[device].width,
                height: deviceSizes[device].height,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              {/* Profile Preview */}
              <div className={`w-full h-full ${getThemeClass(profile.theme)} overflow-y-auto scrollbar-thin`}>
                <div className="min-h-full flex flex-col items-center justify-center p-8">
                  {/* Avatar */}
                  <div className="relative mb-6 animate-bounce-in">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg hover-float"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-4 border-white/20 shadow-lg flex items-center justify-center hover-float">
                        <span className="text-white text-2xl font-bold">
                          {profile.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    {isLive && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
                    )}
                  </div>

                  {/* Name */}
                  <h1 className="text-2xl font-bold text-white mb-2 text-center animate-fade-in-up">
                    {profile.name || 'Your Name'}
                  </h1>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-white/80 text-center mb-8 max-w-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      {profile.bio}
                    </p>
                  )}

                  {/* Links */}
                  <div className="w-full max-w-sm space-y-4">
                    {profile.links
                      .filter(link => link.isActive)
                      .map((link, index) => (
                        <button
                          key={link.id}
                          onClick={() => handleLinkClick(link.url, link.title)}
                          className="link-card w-full text-left group animate-fade-in-up hover-lift"
                          style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-3">
                            {link.icon && (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <span>{link.icon}</span>
                              </div>
                            )}
                            <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-600 transition-colors">
                              {link.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    
                    {profile.links.filter(link => link.isActive).length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-white/60">No active links to display</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <p className="text-white/40 text-sm">
                      Created with ✨ KineticLinks
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Device Label */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="gap-2">
                <DeviceIcon type={device} />
                {deviceSizes[device].width} × {deviceSizes[device].height}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
