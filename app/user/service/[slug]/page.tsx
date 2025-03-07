"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";

import Header from "@/components/user/components/header/page";
import Footer from "@/components/user/components/footer/footer";

import ContactUs from "@/components/user/pages/customServices/contactus"
import Careers from "@/components/user/pages/customServices/career"
import DataPrivacy from "@/components/user/pages/customServices/dataPrivacy"
import AboutUs from "@/components/user/pages/customServices/aboutus"
import { Provider } from 'react-redux'; // Import Provider
import store from "@/app/redux/store"; // Default import for store

export default function DynamicUserPage() {
  const [slug, setSlug] = useState<string | null>(null);
  const paramsPromise = useParams(); // This is a Promise

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await paramsPromise; // Await the resolved params

      // Ensure slug is a string and not an array
      const slugValue = Array.isArray(resolvedParams?.slug)
        ? resolvedParams.slug[0] // Take the first element if it's an array
        : resolvedParams?.slug || null; // Otherwise, use it as is or set null

      setSlug(slugValue);
    }
    fetchParams();
  }, [paramsPromise]);

  console.log("Slug:",slug);

  return (
    <>
      <Header />
      <div className="mx-auto  mt-16 bg-[#595a53] w-full">
            {slug === "contact-us" ? (
          <ContactUs />
            ): slug === "careers" ? (
              <Provider store={store}>
           <Careers/>
           </Provider>
            ): slug === "privacy-policy" ? (
           <DataPrivacy/>
            ): slug === "about-us" ? (
           <AboutUs/>
            ): slug ? (
      <div className="flex flex-col items-center text-center justify-center min-h-[60vh]">
  <h1 className="text-3xl font-bold text-gray-900">
    Oops! Page Not Found
  </h1>
  <p className="text-gray-600 text-lg mt-2">
    The page you’re looking for doesn’t exist or is under development.
  </p>
  <Link href="/user">
    <button className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-md shadow-md hover:bg-blue-700 transition">
      Go Back Home
    </button>
  </Link>
</div>

        ) : (
          <p className="text-center text-gray-700 text-lg">Loading...</p>
        )}
      </div>
      <Footer />
    </>
  );
}
