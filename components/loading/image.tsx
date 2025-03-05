import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loaderText?: string;
  loaderBg?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  loaderText = "MEGAWORLD",
  loaderBg = "bg-gray-100",
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Loading Animation with MEGAWORLD Text */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className={`absolute flex items-center justify-center w-full h-full ${loaderBg} rounded-lg`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.span
              className="text-lg font-bold text-gray-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              {loaderText}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rotating Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute w-12 h-12 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </AnimatePresence>

      {/* Actual Image with Smooth Fade-in */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-700 ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        onLoad={() => setIsLoading(false)} // ✅ Changed from onLoadingComplete to onLoad
      />
    </div>
  );
};

export default ImageWithLoader;
