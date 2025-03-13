"use client";
import Image from "next/image";
import { useState } from "react";
import {
  FaUser,
  FaHome,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface SubmenuItem {
  label: string;
  link: string;
}

const navItems: { title: string; submenu: (string | SubmenuItem)[] }[] = [
  { title: "DASHBOARD", submenu: [] },
  { title: "PROPERTIES", submenu: [] },
  { title: "OFFICES", submenu: [] },
  { title: "AGENT", submenu: [] },
  { title: "CLIENT PROPERTY", submenu: [] },
  { title: "CLIENT APPOINTMENT", submenu: [] },

  { title: "CUSTOM SERVICES", submenu: ["Careers", "Testimonials"] },
  {
    title: "WHAT'S NEW",
    submenu: [
      "Seminars",
      "Meetings",
      "Events",
      "Closed Deals",
      "Real Estate News",
      "Real Estate Tips",
      "On-Going Infrastructure",
      "Watch Videos",
    ],
  },
  { title: "FORM FILLER", submenu: ["Location"] },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter(); // Next.js router for navigation

  const toggleMenu = (title: string) => {
    setOpenMenu(openMenu === title ? null : title);
  };
  const handleLogout = () => {
    Cookies.remove("auth_token"); // Remove the authentication token
    router.push("/auth"); // Redirect to login page
  };

  return (
    <div className="w-64 bg-black text-white flex flex-col p-5 space-y-6">
      {/* Logo */}
      <div className="flex justify-center -ml-16">
        <Image
          src="/logo/megaworld-white.png"
          alt="Megaworld Logo"
          width={150}
          height={50}
        />
      </div>

      <h2 className="text-xl font-bold text-start">Admin Panel</h2>
      <nav className="space-y-3">
        {navItems.map((item) => (
          <div key={item.title}>
            <button
              onClick={() =>
                item.submenu.length
                  ? toggleMenu(item.title)
                  : setActiveTab(item.title)
              }
              className={`text-sm flex justify-between items-center p-2 rounded-md w-full hover:bg-gray-800 ${
                activeTab === item.title ? "bg-gray-800" : ""
              }`}
            >
              <span>{item.title}</span>
              {item.submenu.length > 0 && (
                <FaChevronDown
                  className={`transition ${
                    openMenu === item.title ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            {openMenu === item.title && item.submenu.length > 0 && (
              <div className="ml-4 space-y-2">
                {item.submenu.map((sub) =>
                  typeof sub === "string" ? (
                    <button
                      key={sub}
                      className="block w-full text-left p-2 rounded-md hover:bg-gray-700 text-sm"
                      onClick={() => setActiveTab(sub)}
                    >
                      {sub}
                    </button>
                  ) : (
                    <button
                      key={sub.label}
                      className="block w-full text-left p-2 rounded-md hover:bg-gray-700"
                      onClick={() => setActiveTab(sub.label)}
                    >
                      {sub.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
      <button
        className="mt-auto flex items-center p-2 rounded-md w-full hover:bg-red-600"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  );
}
