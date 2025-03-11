"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import Sidebar from "@/components/admin/components/sidebar";
import Header from "@/components/admin/components/header";
import Dashboard from "@/components/admin/pages/dashboard/page";

// Other imports
import Agent from "@/components/admin/pages/agent/page";
import Office from "@/components/admin/pages/office/page";
import Property from "@/components/admin/pages/properties/page";
import Careers from "@/components/admin/pages/customservices/careers";
import Testimonial from "@/components/admin/pages/customservices/testimonial";
import Seminar from "@/components/admin/pages/whatsnew/seminar";
import Meeting from "@/components/admin/pages/whatsnew/meeting";
import Event from "@/components/admin/pages/whatsnew/event";
import ClosedDeals from "@/components/admin/pages/whatsnew/closedDeals";
import RealEstateNews from "@/components/admin/pages/whatsnew/realEstateNews";
import RealEstateTips from "@/components/admin/pages/whatsnew/realEstateTips";
import OnGoingInfrastructure from "@/components/admin/pages/whatsnew/onGoingInfrastructure";
import ClientAppointment from "@/components/admin/pages/clientappointment/page";


import Video from "@/components/admin/pages/whatsnew/video";
import Location from "@/components/admin/pages/formfiller/location";
import { Provider } from 'react-redux';
import store from "@/app/redux/store"; // Default import for store

import Loading from "@/components/loading/logo"; // Import Loading Component

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading screen
  const router = useRouter();

  // Function to verify token
  const verifyToken = () => {
    const token = Cookies.get("auth_token");
    if (!token) {
      router.push("/auth");
    } else {
      setIsLoading(false); // Hide loading spinner once token is verified
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Simulate loading delay for token verification
    setTimeout(() => verifyToken(), 1500);
  }, []);

  // useEffect(() => {
  //   // Show loading state when activeTab changes
  //   setIsLoading(true);
  //   const timeout = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1500); // Simulate loading time

  //   return () => clearTimeout(timeout); // Clear timeout on tab change to prevent side effects
  // }, [activeTab]);

  console.log(activeTab);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Show loading screen if `isLoading` is true */}
      {isLoading && <Loading />}

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} />

        <div className="p-6">
          <Provider store={store}>
            {activeTab === "DASHBOARD" && <Dashboard />}
            {activeTab === "Seminars" && <Seminar />}
            {activeTab === "Meetings" && <Meeting />}
            {activeTab === "Events" && <Event />}
            {activeTab === "Location" && <Location />}
            {activeTab === "Closed Deals" && <ClosedDeals />}
            {activeTab === "Real Estate News" && <RealEstateNews />}
            {activeTab === "Real Estate Tips" && <RealEstateTips />}
            {activeTab === "On-Going Infrastructure" && <OnGoingInfrastructure />}
            {activeTab === "Watch Videos" && <Video />}
            {activeTab === "Careers" && <Careers />}
            {activeTab === "Testimonials" && <Testimonial />}
            {activeTab === "AGENT" && <Agent />}
            {activeTab === "OFFICES" && <Office />}
            {activeTab === "PROPERTIES" && <Property />}
            {activeTab === "CLIENT APPOINTMENT" && <ClientAppointment />}
    
          </Provider>
        </div>
      </div>
    </div>
  );
}
