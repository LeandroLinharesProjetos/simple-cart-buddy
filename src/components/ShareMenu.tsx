
import React from "react";
import { useTranslation } from "react-i18next";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Share2, FacebookIcon, TwitterIcon, LinkedinIcon, MessageCircleMore } from "lucide-react";
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
          <Share2 className="h-5 w-5 text-teal-500 hover:text-teal-600 transition-colors" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => shareToNetwork('facebook')}>
          <FacebookIcon className="h-4 w-4 mr-2 text-blue-600" />
          {t('share.facebook')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToNetwork('twitter')}>
          <TwitterIcon className="h-4 w-4 mr-2 text-sky-500" />
          {t('share.twitter')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToNetwork('linkedin')}>
          <LinkedinIcon className="h-4 w-4 mr-2 text-blue-700" />
          {t('share.linkedin')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToNetwork('whatsapp')}>
          <MessageCircleMore className="h-4 w-4 mr-2 text-green-500" />
          {t('share.whatsapp')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMenu;
