"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store"; // Adjust path as needed

interface PropertyProps {
  property?: string;
}

const Property = ({ property }: PropertyProps) => {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const properties = useSelector((state: RootState) => state.propertyData.properties);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, locationFilter, divisionFilter]);

  useEffect(() => {
    if (property) {
      if (property === "new-project") {
        property = "New";
      } else if (property === "all-schedule-a-visit" || property === "all-inquire-a-property") {
        property = "all";
      }
      setDivisionFilter(property);
    }
  }, [property]);

  const uniqueLocations = [...new Set(properties.map((item) => item.location))];
  const uniqueDivisions = [...new Set(properties.map((item) => item.division))];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = `${property.name} ${property.location}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      locationFilter.toLowerCase() === "all" ||
      property.location.toLowerCase() === locationFilter.toLowerCase();

    const matchesDivision =
      !divisionFilter ||
      divisionFilter.toLowerCase().replace(/-/g, " ").trim() === "all" ||
      (divisionFilter.toLowerCase().replace(/-/g, " ").trim() === "new" &&
        (property.division.toLowerCase().trim() === "new" || property.division.toLowerCase().trim() === "new project")) ||
      divisionFilter.toLowerCase().replace(/-/g, " ").trim() === property.division.toLowerCase().replace(/-/g, " ").trim();

    return matchesSearch && matchesLocation && matchesDivision;
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
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
          >
            <option value="">All Divisions</option>
            {uniqueDivisions.map((division, index) => (
              <option key={index} value={division}>
                {division}
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
              const divisionColors: Record<string, string> = {
                "New": "bg-blue-500",
                "Ready for Occupancy": "bg-green-500",
                "Pre-Selling": "bg-yellow-500",
                "Under Construction": "bg-red-500",
              };
              const divisionLabel = residence.division ?? "Unknown";
              const badgeColor = divisionColors[divisionLabel] || "bg-gray-500";

              return (
                <Card key={index} className="relative  rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300">
                  <CardHeader className="p-0 relative">
                    <span className={`absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md ${badgeColor}`}>
                      {residence.division}
                    </span>
                    <img src={residence.image} alt={residence.name} className="w-full h-64 object-cover rounded-lg p-4" />
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardTitle className="text-lg font-bold text-black">{residence.name}</CardTitle>
                    <hr className="my-2 border-gray-300" />
                    <p className="text-gray-700">{residence.location}</p>
                   
                    <p className="text-[#B8986E] font-semibold text-lg mt-2">
  {residence.price
    ? residence.price
        .split(" - ") // Split if it's a range
        .map((price) => `₱${Number(price).toLocaleString()}`) // Format with ₱ and commas
        .join(" - ") // Rejoin formatted prices
    : "Price upon request"}
</p>

                    <button className="mt-4 px-4 bg-[#B8986E] text-white rounded-lg hover:bg-[#A07E5A] transition">
                      View Details
                    </button>
                  </CardContent>
                </Card>
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
