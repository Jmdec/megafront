"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";

import Properties from "@/components/user/pages/property/propertyParent";
import Header from "@/components/user/components/header/page";
import Footer from "@/components/user/components/footer/footer";
import WatchVideos from "@/components/user/pages/whatsnew/watchVideos"

import { Provider } from 'react-redux'; // Import Provider
import store from "@/app/redux/store"; // Default import for store
import Agent from "@/components/user/pages/agent/agent"
import Seminars from "@/components/user/pages/whatsnew/seminars"
import Meetings from "@/components/user/pages/whatsnew/meetings"
import Events from "@/components/user/pages/whatsnew/events"
import ClosedDeals from "@/components/user/pages/whatsnew/closedDeals"
import RealEstateNews from "@/components/user/pages/whatsnew/realEstateNews"
import RealEstateTips from "@/components/user/pages/whatsnew/realEstateTips"
import Infastructure from "@/components/user/pages/whatsnew/onGoingInfastucture"
import ServiceWorker from "@/app/Serviceworkerregister"

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
          <ServiceWorker />  
      <Header />
      <Provider store={store}>
      <div className="mx-auto px-6 py-16 bg-[#F9FAF1] w-full">
        {slug === "properties" ? (
             <Properties />
        ) : slug === "watch-videos" ? ( 
             <WatchVideos />  
        ): slug ==="agent"? (
          <Agent/>
        ): slug ==="seminars"? (
          <Seminars/>
        ): slug ==="meeting"? (
          <Meetings/>
        ): slug ==="events"? (
          <Events/>
        ): slug ==="closed-deals" ? (
          <ClosedDeals/>
        ): slug ==="real-estate-news" ? (
          <RealEstateNews/>
        ): slug ==="real-estate-tips"? (
          <RealEstateTips/>
        ): slug ==="on-going-infrastructure"? (
          <Infastructure/>
        ) : slug ? (
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
      </Provider>
      <Footer />
    </>
  );
}
