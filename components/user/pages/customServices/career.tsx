"use client";

import { useState } from "react";
import Image from "next/image";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function Career() {
  const [slots, setSlots] = useState<number | null>(null);
  
  const roleSlots: Record<string, number> = {
    "Property Manager": 5,
    "Real Estate Agent": 10,
    "Marketing Specialist": 3,
  };
  
  const handleRoleChange = (role: string) => {
    setSlots(roleSlots[role] || null);
  };

  return (
    <div className="bg-gray-50 py-10 px-6">
      <div className="w-[60%] py-16 mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
       
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Careers</h1>
      <p className="text-lg text-gray-700 text-center mb-6 w-7/12 mx-auto">
        Experience exceptional real estate services, tailored to meet your needs and exceed expectations.
      </p>
      
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-[70%] mx-auto bg-white shadow-2xl rounded-xl p-4 border border-gray-200">
  {/* Left Column - Role Selection */}
  <div className="text-end md:text-right">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h2>
    <p className="text-gray-600 mb-6">
      Choose a role that best fits you and explore exciting career opportunities in real estate.
    </p>

    <label className="block text-lg font-medium text-gray-800 mb-2">Select a Role</label>
    
    <div className="w-64 ml-auto"> {/* Ensures alignment to the right */}
      <Select onValueChange={handleRoleChange}>
        <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm hover:border-gray-400 transition">
          <SelectValue placeholder="Choose a role" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg border rounded-lg">
          {Object.keys(roleSlots).map((role) => (
            <SelectItem key={role} value={role} className="hover:bg-gray-100 transition px-4 py-2">
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    
    {/* Slots Display */}
    {slots !== null && (
      <p className="text-lg text-gray-800 font-semibold mt-4">
        Available Slots: <span className="text-blue-600">{slots}</span>
      </p>
    )}

    {/* Apply Button */}
    <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-700 transition">
      Apply Now
    </button>
  </div>

  {/* Right Column - Image */}
  <div className="flex justify-center">
    <div className="bg-blue-50 p-3 rounded-lg shadow-lg animate-pulse">
      <Image
        src="/hiring-career.png"
        width={400}
        height={100}
        alt="Real Estate Career"
        className="rounded-lg shadow-lg transition-transform hover:scale-105 duration-300"
      />
    </div>
  </div>
</div>

      
   
    </div>
    </div>
  );
}
