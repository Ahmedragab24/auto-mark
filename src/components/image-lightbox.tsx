"use client";

import type React from "react";

import {
  useEffect,
  useState,
  useRef,
  type MouseEvent,
  type TouchEvent,
} from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Maximize,
  Minimize,
  RotateCw,
  Play,
  Pause,
  Info,
  Share,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageLightboxProps {
  images: { id: number; image: string }[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  baseUrl: string;
  language?: string;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  baseUrl,
  language = "en",
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const slideShowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const translations = {
    zoomIn: language === "en" ? "Zoom In" : "تكبير",
    zoomOut: language === "en" ? "Zoom Out" : "تصغير",
    download: language === "en" ? "Download" : "تحميل",
    fullscreen: language === "en" ? "Fullscreen" : "ملء الشاشة",
    exitFullscreen:
      language === "en" ? "Exit Fullscreen" : "الخروج من ملء الشاشة",
    rotate: language === "en" ? "Rotate" : "تدوير",
    play: language === "en" ? "Play Slideshow" : "تشغيل عرض الشرائح",
    pause: language === "en" ? "Pause Slideshow" : "إيقاف عرض الشرائح",
    info: language === "en" ? "Image Info" : "معلومات الصورة",
    share: language === "en" ? "Share" : "مشاركة",
    help: language === "en" ? "Keyboard Shortcuts" : "اختصارات لوحة المفاتيح",
    previous: language === "en" ? "Previous" : "السابق",
    next: language === "en" ? "Next" : "التالي",
    close: language === "en" ? "Close" : "إغلاق",
    resetZoom: language === "en" ? "Reset Zoom" : "إعادة ضبط التكبير",
    of: language === "en" ? "of" : "من",
    shortcuts:
      language === "en" ? "Keyboard Shortcuts" : "اختصارات لوحة المفاتيح",
    leftArrow: language === "en" ? "Left Arrow" : "السهم الأيسر",
    rightArrow: language === "en" ? "Right Arrow" : "السهم الأيمن",
    escKey: language === "en" ? "ESC" : "زر الخروج",
    plusKey: language === "en" ? "+" : "+",
    minusKey: language === "en" ? "-" : "-",
    rKey: language === "en" ? "R" : "R",
    fKey: language === "en" ? "F" : "F",
    spaceKey: language === "en" ? "Space" : "مسافة",
    prevImage: language === "en" ? "Previous Image" : "الصورة السابقة",
    nextImage: language === "en" ? "Next Image" : "الصورة التالية",
    closeLightbox: language === "en" ? "Close Lightbox" : "إغلاق العارض",
    zoomInShortcut: language === "en" ? "Zoom In" : "تكبير",
    zoomOutShortcut: language === "en" ? "Zoom Out" : "تصغير",
    rotateImage: language === "en" ? "Rotate Image" : "تدوير الصورة",
    toggleFullscreen:
      language === "en" ? "Toggle Fullscreen" : "تبديل ملء الشاشة",
    toggleSlideshow:
      language === "en" ? "Toggle Slideshow" : "تبديل عرض الشرائح",
  };

  // Reset state when opening lightbox
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setIsPlaying(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation and shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key.toLowerCase() === "r") {
        handleRotate();
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      } else if (e.key === " ") {
        e.preventDefault();
        toggleSlideshow();
      } else if (e.key.toLowerCase() === "d") {
        handleDownload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";

      // Clear any running timeouts
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (slideShowTimeoutRef.current) {
        clearTimeout(slideShowTimeoutRef.current);
      }
    };
  }, [isOpen, currentIndex, zoomLevel, isPlaying]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle slideshow
  useEffect(() => {
    if (isPlaying) {
      slideShowTimeoutRef.current = setTimeout(() => {
        handleNextImage();
      }, 3000);
    } else if (slideShowTimeoutRef.current) {
      clearTimeout(slideShowTimeoutRef.current);
    }

    return () => {
      if (slideShowTimeoutRef.current) {
        clearTimeout(slideShowTimeoutRef.current);
      }
    };
  }, [isPlaying, currentIndex]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        if (!helpOpen && !showInfo) {
          setShowControls(false);
        }
      }, 3000);
    };

    if (isOpen) {
      window.addEventListener("mousemove", handleMouseMove);
      handleMouseMove(); // Initialize the timeout
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, helpOpen, showInfo]);

  const handleNextImage = () => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      resetZoom();
    }
  };

  const handlePrevImage = () => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      resetZoom();
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleSlideshow = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${baseUrl}${images[currentIndex].image}`;

    // Extract filename from path or use a default name
    const filename =
      images[currentIndex].image.split("/").pop() ||
      `image-${currentIndex + 1}.jpg`;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
      e.preventDefault(); // Prevent scrolling while dragging
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleShare = async () => {
    const imageUrl = `${baseUrl}${images[currentIndex].image}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shared Image",
          text: "Check out this image",
          url: imageUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(
        language === "en"
          ? "Link copied to clipboard!"
          : "تم نسخ الرابط إلى الحافظة!"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Main image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          ref={imageRef}
          className="relative max-w-full max-h-full transition-transform duration-200 ease-out cursor-move"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
            cursor: zoomLevel > 1 ? "move" : "auto",
          }}
        >
          <Image
            src={`${baseUrl}${images[currentIndex].image}`}
            alt={`Image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="object-contain max-h-[80vh]"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
            unoptimized
          />
        </div>

        {/* Image counter */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} {translations.of} {images.length}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute p-2 transition rounded-full top-4 right-4 bg-black/60 hover:bg-black/80 z-[60] text-white",
            showControls ? "opacity-100" : "opacity-0"
          )}
          aria-label={translations.close}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className={cn(
                "absolute p-3 transition -translate-y-1/2 rounded-full shadow-md left-4 top-1/2 bg-black/60 hover:bg-black/80 z-[60] text-white",
                showControls ? "opacity-100" : "opacity-0"
              )}
              aria-label={translations.previous}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className={cn(
                "absolute p-3 transition -translate-y-1/2 rounded-full shadow-md right-4 top-1/2 bg-black/60 hover:bg-black/80 z-[60] text-white",
                showControls ? "opacity-100" : "opacity-0"
              )}
              aria-label={translations.next}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Toolbar */}
        <div
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 p-2 rounded-full transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  className="text-white hover:bg-black/40 rounded-full"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{translations.zoomIn}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  className="text-white hover:bg-black/40 rounded-full"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{translations.zoomOut}</TooltipContent>
            </Tooltip>

            {zoomLevel !== 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetZoom}
                    className="text-white hover:bg-black/40 rounded-full"
                  >
                    <span className="text-xs font-bold">1:1</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{translations.resetZoom}</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRotate}
                  className="text-white hover:bg-black/40 rounded-full"
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{translations.rotate}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="text-white hover:bg-black/40 rounded-full"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{translations.download}</TooltipContent>
            </Tooltip>

            {images.length > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSlideshow}
                    className="text-white hover:bg-black/40 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPlaying ? translations.pause : translations.play}
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-black/40 rounded-full"
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen
                  ? translations.exitFullscreen
                  : translations.fullscreen}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="text-white hover:bg-black/40 rounded-full"
                >
                  <Share className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{translations.share}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInfo(!showInfo)}
                  className={cn(
                    "text-white hover:bg-black/40 rounded-full",
                    showInfo && "bg-black/40"
                  )}
                >
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{translations.info}</TooltipContent>
            </Tooltip>

            <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-black/40 rounded-full"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{translations.shortcuts}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      ←
                    </kbd>
                    <span>{translations.prevImage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      →
                    </kbd>
                    <span>{translations.nextImage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      ESC
                    </kbd>
                    <span>{translations.closeLightbox}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      +
                    </kbd>
                    <span>{translations.zoomInShortcut}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      -
                    </kbd>
                    <span>{translations.zoomOutShortcut}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      R
                    </kbd>
                    <span>{translations.rotateImage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      F
                    </kbd>
                    <span>{translations.toggleFullscreen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      Space
                    </kbd>
                    <span>{translations.toggleSlideshow}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                      D
                    </kbd>
                    <span>{translations.download}</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TooltipProvider>
        </div>

        {/* Image info panel */}
        {showInfo && (
          <div className="absolute top-16 right-4 bg-black/80 text-white p-4 rounded-lg max-w-xs">
            <h3 className="font-bold mb-2">
              {language === "en" ? "Image Information" : "معلومات الصورة"}
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                {language === "en" ? "Image" : "الصورة"}: {currentIndex + 1} /{" "}
                {images.length}
              </p>
              <p>
                {language === "en" ? "Zoom" : "التكبير"}:{" "}
                {Math.round(zoomLevel * 100)}%
              </p>
              <p>
                {language === "en" ? "Rotation" : "الدوران"}: {rotation}°
              </p>
              <p>
                {language === "en" ? "Filename" : "اسم الملف"}:{" "}
                {images[currentIndex].image.split("/").pop()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className={cn(
            "absolute bottom-20 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                resetZoom();
              }}
              className={cn(
                "relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden transition border-2",
                currentIndex === index ? "border-primary" : "border-transparent"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={currentIndex === index}
            >
              <Image
                src={`${baseUrl}${image.image}`}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
