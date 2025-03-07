"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { montserrat } from "@/utils/fonts";

// ✅ Updated Navigation Items
const navItems = [
  { title: "WHAT'S NEW", href: "/user/", submenu: ["Seminars", "Meeting", "Events", "Closed Deals", "Real Estate News", "Real Estate Tips", "On-Going Infrastructure", "Watch Videos"] },
  { title: "PROPERTIES", href: "/user/property", submenu: ["New Project", "Pre-selling", "Ready for Occupancy", "Payment Channels"] },
  { title: "OFFICES", href: "/user/office", submenu: ["For Lease", "For Rent", "For Sale"] },
  { title: "AGENT", href: "/user/agent", submenu: [] },
  { title: "CUSTOM SERVICES", href: "/user/service", submenu: ["Contact Us", "About Us", "Careers", "Privacy Policy"] },
  { 
    title: "VISIT OUR SHOWROOM", 
    href: "/user/property/all", 
    submenu: [
      { label: "Schedule a Visit", link: "/user/property/all-schedule-a-visit" },
      { label: "Inquire a Property", link: "/user/property/all-inquire-a-property" }
    ]
  }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const pathname = usePathname();
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // ✅ Handle Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-black shadow-md" : "bg-black"}`}>
        <div className="container mx-auto flex justify-between items-center px-6 py-3">
          {/* ✅ Logo */}
          <div className="flex-shrink-0">
            <Link href="/user">
              <Image src="/logo/megaworld-white.png" alt="MegaWorld Logo" width={200} height={50} priority className="w-36 sm:h-5 md:w-48 md:h-full" />
            </Link>
          </div>

          <nav className={`hidden md:flex items-center space-x-6 ${montserrat.className}`}>
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => {
                  if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                  setActiveDropdown(index);
                }}
                onMouseLeave={() => {
                  dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
                }}
              >
                <NavLink href={item.href} active={pathname === item.href}>
                  {item.title}
                </NavLink>

                {/* ✅ Dropdown Menu */}
                {item.submenu.length > 0 && activeDropdown === index && (
                  <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 transition-all duration-300 ease-in-out transform scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={typeof subItem === "string" ? `${item.href}/${subItem.toLowerCase().replace(/\s+/g, "-")}` : subItem.link}
                        className="block px-5 py-3 text-gray-700 font-medium hover:bg-[#B8986E] hover:text-white transition-all duration-200 rounded-md"
                      >
                        {typeof subItem === "string" ? subItem : subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ✅ Mobile Menu Button */}
          <button className="md:hidden text-xl text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* ✅ Mobile Menu */}
        <div className={`absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out ${isOpen ? "block opacity-100" : "hidden opacity-0"}`}>
          <nav className="flex flex-col py-4 space-y-3">
            {navItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200">
                <div
                  className="flex justify-between px-6 py-2 text-gray-800 text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                >
                  {item.title}
                  {item.submenu.length > 0 && <span>{activeDropdown === index ? "▲" : "▼"}</span>}
                </div>

                {/* ✅ Mobile Dropdown */}
                {activeDropdown === index && (
                  <div className="bg-gray-100 px-6 py-2">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={typeof subItem === "string" ? `${item.href}/${subItem.toLowerCase().replace(/\s+/g, "-")}` : subItem.link}
                        className="block py-2 text-gray-700 hover:text-[#B8986E]"
                        onClick={() => setIsOpen(false)} // ✅ Close menu on click
                      >
                        {typeof subItem === "string" ? subItem : subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

/* ✅ Reusable NavLink Component */
function NavLink({ href, children, active, onClick }: { href: string; children: string; active?: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 transition-colors duration-300 text-sm ${active ? "text-[#B8986E]" : "text-white"} hover:text-[#B8986E]`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
