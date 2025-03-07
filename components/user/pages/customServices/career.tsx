"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchCareers } from "@/app/redux/services/careerService";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store'; // Ensure correct path

export default function Career() {
  const dispatch = useDispatch<AppDispatch>();  // ✅ Fix: Typed Dispatch

  // Get careers from Redux store
  const { careers, loading, error } = useSelector((state: RootState) => state.careerData);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [slots, setSlots] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCareers());  // ✅ No more type errors
  }, [dispatch]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    const foundRole = careers.find((career) => career.roleName === role);
    setSlots(foundRole ? foundRole.quantity : null);
  };

  return (
    <div className="bg-gray-50 py-10 px-6">
      <div className="w-[60%] py-16 mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
       
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Careers</h1>
        <p className="text-lg text-gray-700 text-center mb-6 w-7/12 mx-auto">
          Experience exceptional real estate services, tailored to meet your needs and exceed expectations.
        </p>

        {/* Loading & Error Handling */}
        {loading && <p className="text-center text-gray-500">Loading career roles...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-[70%] mx-auto bg-white shadow-2xl rounded-xl p-4 border border-gray-200">
          
          {/* Left Column - Role Selection */}
          <div className="text-end md:text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h2>
            <p className="text-gray-600 mb-6">
              Choose a role that best fits you and explore exciting career opportunities in real estate.
            </p>

            <label className="block text-lg font-medium text-gray-800 mb-2">Select a Role</label>

       <div className="w-64 ml-auto">
  <Select onValueChange={handleRoleChange}>
    <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm hover:border-gray-400 transition">
      <SelectValue placeholder="Choose a role" />
    </SelectTrigger>
    <SelectContent className="bg-white shadow-lg border rounded-lg">
      {careers.length > 0 ? (
        careers.map((career) => (
          <SelectItem key={career.id} value={career.roleName} className="hover:bg-gray-100 transition px-4 py-2">
            {career.roleName}
          </SelectItem>
        ))
      ) : (
        <div className="text-center py-3 text-gray-500">No Vacant yet</div>
      )}
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
