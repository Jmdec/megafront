"use client";
import { useState,useEffect } from "react";
import Sidebar from "@/components/admin/components/sidebar";
import Header from "@/components/admin/components/header";

//Whats New
import Seminar from "@/components/admin/pages/whatsnew/seminar";
import Meeting from "@/components/admin/pages/whatsnew/meeting";
import Event from "@/components/admin/pages/whatsnew/event";

// Form Filler
import Status from "@/components/admin/pages/formfiller/status";
import Location from "@/components/admin/pages/formfiller/location";
import DevelopmentType from "@/components/admin/pages/formfiller/developmentType";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  console.log(activeTab);


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} />

        <div className="p-6">
          {activeTab === "Seminars" && <Seminar />} 
          {activeTab === "Meetings" && <Meeting />} 
          {activeTab === "Events" && <Event />} 
            {activeTab === "Status" && <Status />} 
             {activeTab === "Location" && <Location />} 
              {activeTab === "Development Type" && <DevelopmentType />} 
      </div>
      </div>
    </div>
  );
}
