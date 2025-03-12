"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaTelegramPlane,
  FaViber,
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { IoBedOutline } from "react-icons/io5";
import { PiCalculatorThin, PiHouseLight } from "react-icons/pi";
import Link from "next/link"; // Import Link for routing

const iconsWithLabels = [
  { icon: FaFacebook, route: "/facebook" },
  { icon: FaViber, route: "/viber" },
  { icon: FaTelegramPlane, route: "/telegram" },
  { icon: FaInstagram, route: "/instagram" },
];

const horizontalIcons = [
  {
    icon: IoBedOutline,
    label: "Room Planner",
    route: "https://roomplanner-nu.vercel.app/roomplanner/megaworld",
    isExternal: true,
  },
  {
    icon: PiCalculatorThin,
    label: "Loan Calculator",
    route: "/user/loancalculator",
  },
  {
    icon: PiHouseLight,
    label: "Submit Property",
    route: "/user/submitproperty",
  },
];

const SocialMediaIcons = () => {
  const [showIcons, setShowIcons] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [labelPosition, setLabelPosition] = useState({ top: 0, left: 0 });

  const handleToggle = () => {
    setShowIcons(!showIcons);
  };

  const handleMouseEnter = (label: any, event: React.MouseEvent) => {
    const { top, left, width, height } =
      event.currentTarget.getBoundingClientRect();
    setHoveredLabel(label);
    setLabelPosition({ top: top + height / 2, left: left + width });
  };

  const handleMouseLeave = () => {
    setHoveredLabel(null);
  };

  const transitionSettings = { duration: 0.3, ease: "easeInOut" };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-center w-fit">
      {/* Rotating & Enlarging Main Icon */}
      <motion.div
        onClick={handleToggle}
        className="w-12 h-12 cursor-pointer flex items-center justify-center bg-black border-2 border-black text-white rounded-full p-2 hover:bg-gray-600 transition"
        animate={{ rotate: showIcons ? 180 : 0, scale: showIcons ? 1.1 : 1 }}
        transition={transitionSettings}
      >
        <motion.div
          animate={{ scale: showIcons ? 1.2 : 1 }}
          transition={transitionSettings}
        >
          <CiSettings size={24} />
        </motion.div>
      </motion.div>

      {/* Floating Hover Label */}
      <AnimatePresence>
        {hoveredLabel && (
          <motion.div
            className="fixed bg-black text-white text-xs px-2 py-1 rounded-md z-50"
            style={{
              top: `${labelPosition.top + 20}px`,
              left: `${labelPosition.left - 65}px`, // Reduce left margin here
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {hoveredLabel}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Social Icons (Vertically) */}
      <AnimatePresence>
        {showIcons && (
          <motion.div
            className="flex flex-col space-y-2 mt-2 w-fit h-fit"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={transitionSettings}
          >
            {iconsWithLabels.map(({ icon: Icon, route }, index) => (
              <motion.div
                key={index}
                className="w-12 h-12 flex items-center justify-center rounded-full text-white bg-black border-2 border-black cursor-pointer hover:bg-gray-500 transition relative"
              >
                <Link href={route}>
                  <Icon size={24} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Horizontal Icons (Move Left) */}
      <div className="relative -mt-[270px] mr-14 flex w-fit h-fit">
        <AnimatePresence>
          {showIcons &&
            horizontalIcons.map(
              ({ icon: Icon, label, route, isExternal }, index) => (
                <motion.div
                  key={index}
                  className="absolute w-12 h-12 flex items-center justify-center rounded-full text-white bg-black border-2 border-black cursor-pointer hover:bg-gray-500 transition"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: -(index + 1) * 55, opacity: 1 }}
                  exit={{ x: 0, opacity: 0 }}
                  transition={transitionSettings}
                  onMouseEnter={(e) => handleMouseEnter(label, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {isExternal ? (
                    <a href={route} target="_blank" rel="noopener noreferrer">
                      <Icon size={24} />
                    </a>
                  ) : (
                    <Link href={route}>
                      <Icon size={24} />
                    </Link>
                  )}
                </motion.div>
              )
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialMediaIcons;
