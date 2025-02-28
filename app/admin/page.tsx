"use client";
import { useState } from "react";
import Sidebar from "@/components/admin/components/sidebar";
import Header from "@/components/admin/components/header";

// Form Filler
import Status from "@/components/admin/pages/formfiller/status";

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
          
          <div className=" p-6 bg-white rounded-lg shadow-md">
           
            {activeTab === "Status" && <Status />} {/* Render Status component */}
          </div>
        </div>
      </div>
    </div>
  );
}
