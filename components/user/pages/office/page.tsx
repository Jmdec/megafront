"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchOfficeById } from "@/app/redux/services/officeService";
import { Building, Ruler, Layers } from "lucide-react"; // ✅ Import icons

export default function Office({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const office = useSelector(
    (state: RootState) => state.officeData.selectedOffice
  );
  const loading = useSelector((state: RootState) => state.officeData.loading);
  const error = useSelector((state: RootState) => state.officeData.error);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (id) {
      dispatch(fetchOfficeById(Number(id))); // Fetch office by ID
    }
  }, [dispatch, id]);

  // ✅ Log office data whenever it updates
  useEffect(() => {
    console.log("Fetched Office Data:", office);
  }, [office]); // 🔹 Runs whenever office data updates

  if (loading)
    return <p className="text-center text-lg">Loading office details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!office)
    return <p className="text-center text-gray-500">No office found.</p>;

  // ✅ Status Badge Colors
  const statusColors: Record<string, string> = {
    "For Lease": "bg-yellow-500",
    "For Sale": "bg-red-500",
    "For Rent": "bg-green-500",
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* ✅ Office Image & Status */}
      <div className="relative w-full h-96">
        <img
          src={`${API_BASE_URL}${office.image}`}
          alt={office.name}
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
        <span
          className={`absolute top-4 left-4 text-white py-2 px-4 rounded-lg text-sm font-bold ${
            statusColors[office.status] || "bg-gray-500"
          }`}
        >
          {office.status}
        </span>
      </div>

      {/* ✅ Office Info */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{office.name}</h1>
        <p className="text-lg text-gray-600 mt-1">{office.location}</p>
        <p className="text-xl font-semibold text-black mt-2">
          ₱{" "}
          {office.price
            .split(" - ")
            .map((num) => Number(num).toLocaleString())
            .join(" - ₱ ")}
        </p>
      </div>

      {/* ✅ Office Details Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* ✅ Office Details with Icons */}
        <div className="text-gray-700 space-y-3">
          <p className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-700" />
            <strong>Lot Area:</strong> {office.lotArea} sqm
          </p>
        </div>
      </div>

      {/* ✅ Description */}
      <div className="mt-6 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">Description</h2>
        <p className="mt-2">{office.description}</p>
      </div>

      {/* ✅ Amenities Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          {office.amenities.length > 0 ? (
            office.amenities.map((amenity: string, index: number) => (
              <div
                key={index}
                className="text-center bg-gray-100 p-3 rounded-lg shadow"
              >
                <p className="text-sm text-gray-700">{amenity}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No amenities available</p>
          )}
        </div>
      </div>
    </div>
  );
}
