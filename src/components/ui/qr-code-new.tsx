import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { QrCode, Download, Share2, Copy, Palette, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
}

interface QROptions {
  size: number;
  format: 'PNG' | 'SVG' | 'EPS' | 'PDF';
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  backgroundColor: string;
  foregroundColor: string;
  margin: number;
  style: 'square' | 'dots' | 'rounded';
}

export function QRCodeGenerator({ url, title = "QR Code" }: QRCodeGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<QROptions>({
    size: 300,
    format: 'PNG',
    errorCorrection: 'M',
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
    margin: 20,
    style: 'square'
  });
  const { toast } = useToast();
  
  const generateQRUrl = () => {
    const params = new URLSearchParams({
      size: `${options.size}x${options.size}`,
      data: url,
      bgcolor: options.backgroundColor.replace('#', ''),
      color: options.foregroundColor.replace('#', ''),
      margin: options.margin.toString(),
      ecc: options.errorCorrection,
      format: options.format.toLowerCase()
    });
    
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  };

  const downloadQR = async () => {
    try {
      const qrUrl = generateQRUrl();
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `qr-code-${Date.now()}.${options.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "QR Code Downloaded",
        description: `Your QR code has been saved as ${options.format} format.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareQR = async () => {
    const qrUrl = generateQRUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${title}`,
          text: `Scan this QR code to visit: ${url}`,
          url: qrUrl
        });
      } catch (error) {
        copyToClipboard(qrUrl);
      }
    } else {
      copyToClipboard(qrUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: "QR code URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="group relative overflow-hidden hover:scale-105 transition-all duration-300"
        >
          <QrCode className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          Generate QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <QrCode className="w-6 h-6 text-purple-600" />
            QR Code Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl">
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <img
                    src={generateQRUrl()}
                    alt="QR Code"
                    className="max-w-full h-auto rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                    style={{ maxWidth: '250px' }}
                  />
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Scan to visit:
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 break-all px-2">
                  {url}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={downloadQR} 
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={shareQR} 
                variant="outline"
                className="flex-1 group relative overflow-hidden"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                onClick={() => copyToClipboard(generateQRUrl())} 
                variant="outline"
                className="flex-1 group relative overflow-hidden"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Settings className="w-5 h-5" />
              Customization
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size (px)</Label>
                  <Input
                    id="size"
                    type="number"
                    value={options.size}
                    onChange={(e) => setOptions({...options, size: parseInt(e.target.value) || 300})}
                    min="100"
                    max="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select value={options.format} onValueChange={(value: 'PNG' | 'SVG' | 'EPS' | 'PDF') => setOptions({...options, format: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PNG">PNG</SelectItem>
                      <SelectItem value="SVG">SVG</SelectItem>
                      <SelectItem value="EPS">EPS</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Palette className="w-4 h-4" />
                Colors
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="background">Background</Label>
                  <div className="flex gap-2">
                    <input
                      id="background"
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => setOptions({...options, backgroundColor: e.target.value})}
                      className="w-12 h-10 rounded-lg border-2 cursor-pointer"
                    />
                    <Input
                      value={options.backgroundColor}
                      onChange={(e) => setOptions({...options, backgroundColor: e.target.value})}
                      className="flex-1"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foreground">Foreground</Label>
                  <div className="flex gap-2">
                    <input
                      id="foreground"
                      type="color"
                      value={options.foregroundColor}
                      onChange={(e) => setOptions({...options, foregroundColor: e.target.value})}
                      className="w-12 h-10 rounded-lg border-2 cursor-pointer"
                    />
                    <Input
                      value={options.foregroundColor}
                      onChange={(e) => setOptions({...options, foregroundColor: e.target.value})}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Presets</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOptions({...options, backgroundColor: '#FFFFFF', foregroundColor: '#000000'})}
                    className="w-8 h-8 rounded-lg bg-white border-2 border-black hover:scale-110 transition-transform duration-300"
                    title="Classic"
                  />
                  <button
                    onClick={() => setOptions({...options, backgroundColor: '#000000', foregroundColor: '#FFFFFF'})}
                    className="w-8 h-8 rounded-lg bg-black border-2 border-white hover:scale-110 transition-transform duration-300"
                    title="Inverted"
                  />
                  <button
                    onClick={() => setOptions({...options, backgroundColor: '#8B5CF6', foregroundColor: '#FFFFFF'})}
                    className="w-8 h-8 rounded-lg bg-purple-500 border-2 border-white hover:scale-110 transition-transform duration-300"
                    title="Purple"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="margin">Margin: {options.margin}px</Label>
              <input
                id="margin"
                type="range"
                min="0"
                max="50"
                value={options.margin}
                onChange={(e) => setOptions({...options, margin: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
