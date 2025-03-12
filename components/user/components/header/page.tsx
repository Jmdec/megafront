"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { montserrat } from "@/utils/fonts";
import ClientAppointment from "@/components/user/pages/showroom/clientappointment";
import { Provider } from "react-redux"; // Import Provider
import store from "@/app/redux/store"; // Default import for store

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showInquiryPopup, setShowInquiryPopup] = useState(false);
  const [showVisitPopup, setShowVisitPopup] = useState(false);
  const pathname = usePathname();
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // ✅ Handle Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        { label: "Schedule a Visit", href: "#", action: () => setShowVisitPopup(true) }, // ✅ Opens Visit popup
        { label: "Inquire a Property", href: "#", action: () => setShowInquiryPopup(true) } // ✅ Opens Inquiry popup
      ]
    }
  ];

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
                {Array.isArray(item.submenu) && item.submenu.length > 0 && activeDropdown === index && (
                  <div className="absolute left-0 mt-2 w-56 text-black bg-white shadow-lg rounded-lg border border-gray-200 transition-all duration-300 ease-in-out transform scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                    {item.submenu.map((subItem, subIndex) => (
                      typeof subItem === "string" ? (
                        <Link
                          key={subIndex}
                          href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block px-5 py-3 text-gray-700 font-medium hover:bg-[#B8986E] hover:text-white transition-all duration-200 rounded-md"
                        >
                          {subItem}
                        </Link>
                      ) : (
                        <button
                          key={subIndex}
                          onClick={subItem.action}
                          className="block w-full text-left px-5 py-3 text-gray-700 font-medium hover:bg-[#B8986E] hover:text-white transition-all duration-200 rounded-md"
                        >
                          {subItem.label}
                        </button>
                      )
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
      </header>

      <Provider store={store}>
        {/* ✅ Conditionally render ClientAppointment with the correct type */}
        {showInquiryPopup && <ClientAppointment type="Inquiry" onClose={() => setShowInquiryPopup(false)} />}
        {showVisitPopup && <ClientAppointment type="Visit" onClose={() => setShowVisitPopup(false)} />}
      </Provider>
    </>
  );
}

/* ✅ Reusable NavLink Component */
function NavLink({ href, children, active }: { href: string; children: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 transition-colors duration-300 text-sm ${active ? "text-[#B8986E]" : "text-white"} hover:text-[#B8986E]`}
    >
      {children}
    </Link>
  );
}
