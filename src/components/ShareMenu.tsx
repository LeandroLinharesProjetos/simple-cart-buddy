
import React from "react";
import { useTranslation } from "react-i18next";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Share2, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const ShareMenu = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const shareToNetwork = (network: string) => {
    const url = window.location.href;
    const text = t('share.text');
    
    let shareUrl = '';
    
    switch (network) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
          toast({
            description: t('share.copied'),
          });
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4 text-teal-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => shareToNetwork('facebook')}>
          <Facebook className="h-4 w-4 mr-2" />
          {t('share.facebook')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToNetwork('twitter')}>
          <Twitter className="h-4 w-4 mr-2" />
          {t('share.twitter')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToNetwork('linkedin')}>
          <Linkedin className="h-4 w-4 mr-2" />
          {t('share.linkedin')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToNetwork('whatsapp')}>
          <MessageCircle className="h-4 w-4 mr-2" />
          {t('share.whatsapp')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMenu;
