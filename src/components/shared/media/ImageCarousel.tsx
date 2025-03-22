import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Media {
  id: string;
  mediaUrl: string;
  type: string;
  width?: number;
  height?: number;
}

interface ImageCarouselProps {
  images: Media[];
  className?: string;
}

const ImageCarousel = ({ images, className }: ImageCarouselProps) => {
  const [showNavigation, setShowNavigation] = useState(true);

  // If only one image, hide navigate button
  useEffect(() => {
    setShowNavigation(images.length > 1);
  }, [images.length]);

  // If no image, not render
  if (images.length === 0) {
    return null;
  }

  return (
    <Carousel className={cn("w-full relative", className)}>
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <div className="flex aspect-square items-center justify-center p-0 overflow-hidden">
              <img
                src={image.mediaUrl}
                alt="Image"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {showNavigation && (
        <>
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90" />
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90" />
        </>
      )}
    </Carousel>
  );
};

export default ImageCarousel;
