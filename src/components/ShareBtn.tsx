"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const ShareBtn = () => {
  const [, setIsCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(`${window.location.origin}${pathname}`);
    }
  }, [pathname]);

  const handleShare = async () => {
    if (!currentUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: currentUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(currentUrl);
          setIsCopied(true);
          toast({
            title: "Link copied to clipboard",
            description: "You can now paste the link anywhere.",
          });
          setTimeout(() => setIsCopied(false), 2000);
        } else {
          throw new Error("Clipboard API not supported");
        }
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast({
          title: "Failed to copy link",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className="rounded-full"
      onClick={handleShare}
      disabled={!currentUrl}
    >
      <Share2 className="h-5 w-5" />
    </Button>
  );
};

export default ShareBtn;
