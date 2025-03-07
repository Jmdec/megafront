"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { fetchOffices } from '@/app/redux/services/officeService';

interface OfficeProps {
  office?: string;
}

const Office = ({ office }: OfficeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch data from Redux
  const offices = useSelector((state: RootState) => state.officeData.offices);
  const loading = useSelector((state: RootState) => state.officeData.loading);
  const error = useSelector((state: RootState) => state.officeData.error);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchOffices());
  }, [dispatch]);

  useEffect(() => {
    console.log(office)
    if (office) {
      setStatusFilter(office);
    }
  }, [office]);

  const uniqueLocations = [...new Set(offices.map((item) => item.location))];
  const uniqueStatuses = [...new Set(offices.map((item) => item.status))];

 const filteredOffices = offices.filter((officeItem) => {
  const matchesSearch = `${officeItem.name} ${officeItem.location}`
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesLocation =
    !locationFilter ||
    locationFilter.toLowerCase() === "all" ||
    officeItem.location.toLowerCase() === locationFilter.toLowerCase();

  // ✅ Normalize `status` and `office` for comparison
  const normalizedStatus = officeItem.status.toLowerCase().replace(/\s+/g, "-"); // "For Lease" → "for-lease"
  const normalizedOffice = office?.toLowerCase().trim(); // "for-lease"

const matchesStatus =
  !statusFilter ||
  statusFilter.toLowerCase().replace(/\s+/g, "-") === "all" ||
  officeItem.status.toLowerCase().replace(/\s+/g, "-") === statusFilter.toLowerCase().replace(/\s+/g, "-");

  return matchesSearch && matchesLocation && matchesStatus;
});


  return (
    <div className="mx-auto px-6 py-16 bg-[#F9FAF1] w-full sm:w-[90%] md:w-[80%] lg:w-[70%]">
      <h2 className="text-xl sm:text-lg md:text-xl text-center text-black mb-2 tracking-widest uppercase">
        Discover Premier Office Spaces
      </h2>
      <p className="text-sm sm:text-base md:text-md text-center text-black mb-2 tracking-widest uppercase">
        Find the ideal office space tailored for your business.
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mb-6 mt-10">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h2 className="text-xl font-semibold text-gray-700">OFFICES</h2>
          <input
            type="text"
            placeholder="Search by name or location..."
            className="px-4 py-2 w-full sm:w-60 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8986E] transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <select
            className="px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8986E] transition"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8986E] transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {uniqueStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading & Error Handling */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#B8986E] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredOffices.length > 0 ? (
            filteredOffices.map((office, index) => {
              const imageUrl = office.image ? `${API_BASE_URL}${office.image}` : "/default-office.jpg";
            

              const statusColors: Record<string, string> = {
                "For Lease": "bg-yellow-500",
                "For Sale": "bg-red-500",
                "For Rent": "bg-green-500",
              };
              const badgeColor = statusColors[office.status] || "bg-gray-500";

              return (
                <Card key={index} className="relative p-2 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300">
                  <CardHeader className="p-0 relative">
                    <span className={`absolute top-6 right-5 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md ${badgeColor}`}>
                      {office.status}
                    </span>
                    <img src={imageUrl} alt={office.name} className="w-full p-3 h-64 object-cover rounded-2xl" />
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardTitle className="text-lg font-bold text-black mt-2">{office.name}</CardTitle>
                    <hr className=" border-gray-300" />
                    <p className="text-gray-700">{office.location}</p>
                    <p className="text-sm text-gray-600">Lot Area: {office.lotArea} sqm</p>
              <p className="text-sm text-gray-600">
  Price: ₱{office.price
    .split("-")
    .map((p) => parseInt(p.trim(), 10).toLocaleString())
    .join(" - ₱")}
</p>

                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-gray-700 text-lg col-span-full">No offices found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Office;
