"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
  activeTab: string;
  user?: string;
}

export default function Header({ activeTab, user = "Admin" }: HeaderProps) {
  const [showLogout, setShowLogout] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    Cookies.remove("auth_token"); // Remove the authentication token
    router.push("/auth"); // Redirect to login page
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo and Active Tab */}
      <div className="flex items-center space-x-3">
        {/* You can add your logo or active tab here */}
      </div>
      
      {/* User Profile */}
      <div className="relative flex items-center space-x-3" ref={logoutRef}>
        <span className="text-gray-600 hidden sm:block">Welcome, {user}</span>
        <div className="relative">
          <FaUserCircle 
            className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800" 
            onClick={() => setShowLogout((prev) => !prev)}
          />
          
          {/* Logout Button */}
          {showLogout && (
            <button 
              onClick={handleLogout} // ✅ Call the logout function
              className="absolute right-0 mt-2 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600 transition"
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
