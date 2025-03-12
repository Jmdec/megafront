import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Loading = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loader after 3 seconds
    const timeout = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }} // Smooth fade out
        >
          <motion.div
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8], // Zoom in and out
              rotate: [0, 360], // Full rotation
            }}
            transition={{
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
          >
            <Image src="/logo/loading.png" alt="Loading..." width={40} height={30} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
