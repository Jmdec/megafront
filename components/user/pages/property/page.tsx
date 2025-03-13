"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchPropertyById } from "@/app/redux/services/propertyService";
import { Building, Ruler, ParkingCircle, Layers } from "lucide-react"; // ✅ Import Lucide icons

export default function Property({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const property = useSelector(
    (state: RootState) => state.propertyData.selectedProperty
  );
  const loading = useSelector((state: RootState) => state.propertyData.loading);
  const error = useSelector((state: RootState) => state.propertyData.error);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(Number(id))); // Fetch property by ID
    }
  }, [dispatch, id]);

  if (loading)
    return <p className="text-center text-lg">Loading property details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!property)
    return <p className="text-center text-gray-500">No property found.</p>;

  // ✅ Status Badge Colors
  const statusColors: Record<string, string> = {
    New: "bg-blue-500",
    "Ready for Occupancy": "bg-green-500",
    "Pre-Selling": "bg-yellow-500",
    "Under Construction": "bg-red-500",
    Sold: "bg-gray-500",
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* ✅ Property Image & Status */}
      <div className="relative w-full h-96">
        <img
          src={`${API_BASE_URL}${property.image}`}
          alt={property.name}
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
        <span
          className={`absolute top-4 left-4 text-white py-2 px-4 rounded-lg text-sm font-bold ${
            statusColors[property.status] || "bg-gray-500"
          }`}
        >
          {property.status}
        </span>
      </div>

      {/* ✅ Property Info */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
        <p className="text-lg text-gray-600 mt-1">
          {property.location} - {property.specificLocation}
        </p>
        <p className="text-xl font-semibold text-black mt-2">
          ₱ {Number(property.priceRange.split(" - ")[0]).toLocaleString()} - ₱{" "}
          {Number(property.priceRange.split(" - ")[1]).toLocaleString()}
        </p>

        {/* ✅ Units - Parse it first before joining */}
        <p className="text-md text-gray-700 mt-2">
          <strong>Available Units:</strong>{" "}
          {Array.isArray(property.units)
            ? property.units.join(", ")
            : JSON.parse(property.units).join(", ")}
        </p>
      </div>

      {/* ✅ Features Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">Features</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          {JSON.parse(property.features).map(
            (feature: { name: string }, index: number) => (
              <li key={index}>{feature.name}</li>
            )
          )}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* ✅ Master Plan Image */}
        <div className="w-full">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Master Plan:
          </p>
          <img
            src={`${API_BASE_URL}${property.masterPlan}`}
            alt="Master Plan"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>

        {/* ✅ Property Details with Icons */}
        <div className="text-gray-700 space-y-3">
          <div className="mt-6 text-gray-700">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="mt-2">{property.description}</p>
          </div>
          <p className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-700" />
            <strong>Development Type:</strong> {property.developmentType}
          </p>
          <p className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-gray-700" />
            <strong>Lot Area:</strong> {property.lotArea} sqm
          </p>
          <p className="flex items-center gap-2">
            <Building className="w-5 h-5 text-gray-700" />
            <strong>Floors:</strong> {property.floors}
          </p>
          <p className="flex items-center gap-2">
            <ParkingCircle className="w-5 h-5 text-gray-700" />
            <strong>Parking Lots:</strong> {property.parkingLots}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          {(typeof property.amenities === "string"
            ? JSON.parse(property.amenities)
            : property.amenities
          )?.map((amenity: { name: string; image: string }, index: number) => (
            <div key={index} className="text-center">
              <img
                src={`${API_BASE_URL}${amenity.image}`}
                alt={amenity.name}
                className="w-full h-24 object-cover rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
              />
              <p className="text-sm text-gray-700 mt-2">{amenity.name}</p>
            </div>
          )) ?? <p className="text-sm text-gray-500">No amenities available</p>}
        </div>
      </div>
    </div>
  );
}
