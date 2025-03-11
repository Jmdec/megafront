"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchProperties } from "@/app/redux/services/propertyService";
import { FaMapMarkerAlt, FaRulerCombined, FaCar, FaBuilding,FaMoneyBillWave } from "react-icons/fa"; 
import { MdOutlineMapsHomeWork } from "react-icons/md";  
import Link from "next/link";
interface PropertyProps {
  property?: string;
}

const Property = ({ property }: PropertyProps) => {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // ✅ Get properties from Redux
  const properties = useSelector((state: RootState) => state.propertyData.properties);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

useEffect(() => {
  dispatch(fetchProperties()); // Fetch properties on mount
}, [dispatch]);

useEffect(() => {
  console.log("✅ Fetched Properties:", properties);
}, [properties]); // Logs properties whenever it updates

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  
  }, [search, locationFilter, statusFilter]);

  useEffect(() => {
    
    if (property) {
      if (property === "new-project") {
        property = "New";
      } else if (property === "all-schedule-a-visit" || property === "all-inquire-a-property") {
        property = "all";
      }
      setStatusFilter(property);
    }
  }, [property]);

  const uniqueLocations = [...new Set(properties.map((item) => item.location))];
  const uniqueStatuses = [...new Set(properties.map((item) => item.status))];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = `${property.name} ${property.location}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      locationFilter.toLowerCase() === "all" ||
      property.location.toLowerCase() === locationFilter.toLowerCase();

    const matchesStatus =
      !statusFilter ||
      statusFilter.toLowerCase().replace(/-/g, " ").trim() === "all" ||
      (statusFilter.toLowerCase().replace(/-/g, " ").trim() === "new" &&
        (property.status.toLowerCase().trim() === "new" || property.status.toLowerCase().trim() === "new project")) ||
      statusFilter.toLowerCase().replace(/-/g, " ").trim() === property.status.toLowerCase().replace(/-/g, " ").trim();

    return matchesSearch && matchesLocation && matchesStatus;
  });

  return (
    <div className="mx-auto px-6 py-16 bg-[#F9FAF1] w-full sm:w-[90%] md:w-[80%] lg:w-[70%]">
      <h2 className="text-xl sm:text-lg md:text-xl text-center text-black mb-2 tracking-widest uppercase">
        Discover Premier Properties
      </h2>
      <p className="text-sm sm:text-base md:text-md text-center text-black mb-2 tracking-widest uppercase">
        Find the perfect residence that fits your lifestyle and business needs.
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mb-6 mt-10">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h2 className="text-xl font-semibold text-gray-700">PROPERTIES</h2>
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

{loading ? (
  <div className="flex justify-center items-center h-60">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-[#B8986E] rounded-full animate-spin"></div>
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
    {filteredProperties.length > 0 ? (
      filteredProperties.map((residence, index) => {
        const statusColors: Record<string, string> = {
          "New": "bg-blue-500",
          "Ready for Occupancy": "bg-green-500",
          "Pre-Selling": "bg-yellow-500",
          "Under Construction": "bg-red-500",
          "Sold": "bg-gray-500",
        };

        const badgeColor = statusColors[residence.status] || "bg-gray-500";

        return (
          <Link key={index} href={`/user/property/${residence.id}`} passHref>
            <Card className="relative rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300 cursor-pointer">
              <CardHeader className="p-0 relative">
                <span className={`absolute top-4 right-4 text-white text-xs font-semibold px-3 py-1 rounded-md ${badgeColor}`}>
                  {residence.status}
                </span>
                <img src={`${API_BASE_URL}${residence.image}`} alt={residence.name} className="w-full h-64 object-cover rounded-lg p-4" />
              </CardHeader>
              <CardContent className="text-center">
           

                <CardTitle className="text-lg font-bold text-black">{residence.name}</CardTitle>
                <hr className="my-2 border-gray-300" />

                <p className="text-gray-700 text-sm">{residence.location}</p>
                <p className="text-gray-700 text-sm">{residence.developmentType}</p>
                <p className="text-gray-700 text-sm">Lot Area: {residence.lotArea} sqm</p>

           <p className="text-gray-700 text-sm">
  Units: {Array.isArray(residence.units) ? residence.units.join(", ") : "N/A"}
</p>

                     <p className="text-gray-700  text-sm"> Price:  {" "}
                  {residence.priceRange
                    ? residence.priceRange
                        .split(" - ")
                        .map((price: any) => `₱${Number(price).toLocaleString()}`)
                        .join(" - ")
                    : "Price upon request"}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })
    ) : (
      <p className="text-center text-gray-700 text-lg col-span-full">No properties found.</p>
    )}
  </div>
)}


    </div>
  );
};

export default Property;
