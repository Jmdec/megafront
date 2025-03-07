"use client";
import { useState,useEffect } from "react";



import Sidebar from "@/components/admin/components/sidebar";
import Header from "@/components/admin/components/header";
import Dashboard from "@/components/admin/pages/dashboard/page";

import Agent from "@/components/admin/pages/agent/page";
import Office from "@/components/admin/pages/office/page";
import Property from "@/components/admin/pages/properties/page";

//Custom Services
import Careers from "@/components/admin/pages/customservices/careers";
import Testimonial from "@/components/admin/pages/customservices/testimonial";

//Whats New
import Seminar from "@/components/admin/pages/whatsnew/seminar";
import Meeting from "@/components/admin/pages/whatsnew/meeting";
import Event from "@/components/admin/pages/whatsnew/event";
import ClosedDeals from "@/components/admin/pages/whatsnew/closedDeals";
import RealEstateNews from "@/components/admin/pages/whatsnew/realEstateNews";
import RealEstateTips from "@/components/admin/pages/whatsnew/realEstateTips";
import OnGoingInfrastructure from "@/components/admin/pages/whatsnew/onGoingInfrastructure";
import Video from "@/components/admin/pages/whatsnew/video";

// Form Filler
import Status from "@/components/admin/pages/formfiller/status";
import Location from "@/components/admin/pages/formfiller/location";
import { Provider } from 'react-redux'; // Import Provider
import store from "@/app/redux/store"; // Default import for store

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  console.log(activeTab);


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} />

        <div className="p-6">
           <Provider store={store}>    {activeTab === "DASHBOARD" && <Dashboard />} </Provider>
        
          {activeTab === "Seminars" && <Seminar />} 
          {activeTab === "Meetings" && <Meeting />} 
          {activeTab === "Events" && <Event />} 
          {activeTab === "Status" && <Status />} 
          {activeTab === "Location" && <Location />} 
          {activeTab === "Closed Deals" && <ClosedDeals />} 
          {activeTab === "Real Estate News" && <RealEstateNews />} 
          {activeTab === "Real Estate Tips" && <RealEstateTips />} 
          {activeTab === "On-Going Infrastructure" && <OnGoingInfrastructure />} 
          {activeTab === "Watch Videos" && <Video/>} 
          {activeTab === "Careers" && <Careers/>} 
          {activeTab === "Testimonials" && <Testimonial/>} 
          {activeTab === "AGENT" && <Agent/>} 
          {activeTab === "OFFICES" && <Office/>} 
          {activeTab === "PROPERTIES" && <Property/>} 
      </div>
      </div>
    </div>
  );
}
