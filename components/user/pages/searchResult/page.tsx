"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store"; // Adjust path as needed
import { setSearchResults } from "@/app/redux/slice/propertyData";
import { setOfficeSearchResults } from "@/app/redux/slice/officeData"; // Import office slice
import { Eye } from "lucide-react";
const statusOfficeColors: Record<string, string> = {
  "For Lease": "bg-yellow-500",
  "For Sale": "bg-green-500",
  "For Rent": "bg-red-500",
};
const statusPropertyColors: Record<string, string> = {
  New: "bg-blue-500",
  "Ready for Occupancy": "bg-green-500",
  "Pre-Selling": "bg-yellow-500",
  "Under Construction": "bg-red-500",
  Sold: "bg-gray-500",
};
const PropertyPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const searchResults = useSelector(
    (state: RootState) => state.propertyData.searchResults
  );
  const officeResults = useSelector(
    (state: RootState) => state.officeData.offices
  );

  useEffect(() => {
    if (searchResults.length === 0) {
      const savedResults = localStorage.getItem("searchResults");
      if (savedResults) {
        const restoredProperties = JSON.parse(savedResults);
        dispatch(setSearchResults(restoredProperties));
      }
    }

    if (officeResults.length === 0) {
      const savedOfficeResults = localStorage.getItem("officeSearchResults");
      if (savedOfficeResults) {
        const restoredOffices = JSON.parse(savedOfficeResults).map(
          (office: any) => ({
            ...office,
            developmentType: "Office", // ✅ Ensure `developmentType` is set
          })
        );
        dispatch(setOfficeSearchResults(restoredOffices));
      }
    }
  }, [dispatch, searchResults, officeResults]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {

  }, [searchResults, officeResults]);

  // ✅ Manage hover state for images
  const [hoveredImages, setHoveredImages] = useState<{
    [key: number]: string | null;
  }>({});

  const handleMouseEnter = (id: number, newImage: string) => {
    setHoveredImages((prev) => ({
      ...prev,
      [id]: newImage,
    }));
  };

  const handleMouseLeave = (id: number, defaultImage: string) => {
    setHoveredImages((prev) => ({
      ...prev,
      [id]: defaultImage,
    }));
  };

  // ✅ Price formatting function
  const formatPrice = (priceRange: string) => {
    const prices = priceRange.split(" - ");
    return prices
      .map(
        (price) => `₱ ${Number(price.replace(/[^\d]/g, "")).toLocaleString()}`
      )
      .join(" - ");
  };

  return (
    <div className="container mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
        Search Results
      </h1>

      {/* ✅ Property Container */}
      {searchResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center sm:text-left">
            Properties
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-8">
            {searchResults.map((property) => {
              const displayedImage =
                hoveredImages[property.id] ||
                `${API_BASE_URL}${property.image}`;
              const statusColor =
                statusPropertyColors[property.status] || "bg-gray-500";

              return (
                <div
                  key={property.id}
                  className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full lg:w-full"
                >
                  <div className="relative w-full sm:w-1/3">
                    {/* ✅ Status Badge */}
                    <span
                      className={`absolute top-2 left-2 ${statusColor} text-white py-1 px-3 rounded-lg text-xs font-bold`}
                    >
                      {property.status}
                    </span>
                    <img
                      src={displayedImage}
                      alt={property.name}
                      className="w-full h-52 sm:h-full object-cover transition-all duration-300"
                    />
                  </div>

                  <div className="p-6 flex-1 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {property.name}{" "}
                        <span className="text-sm font-semibold text-gray-700">
                          {Array.isArray(property.units)
                            ? property.units.join(", ")
                            : typeof property.units === "string"
                            ? JSON.parse(property.units).join(", ")
                            : "N/A"}
                        </span>
                      </h2>

                      <Link
                        href={`/user/property/${property.id}`}
                        className="bg-blue-700 text-white text-sm font-semibold px-3 py-1 rounded-sm shadow-md transition-all duration-300 hover:bg-blue-800"
                      >
                        View More
                      </Link>
                    </div>

                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {formatPrice(property.priceRange)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {property.location} - {property.developmentType}
                    </p>

                    <p className="text-md text-gray-700 mt-2 line-clamp-2">
                      {property.description.split(".")[0]}.
                    </p>

                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Amenities
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 py-2">
                        {JSON.parse(property.amenities).map(
                          (amenity: any, index: any) => (
                            <div
                              key={index}
                              className="flex-shrink-0 cursor-pointer"
                              onMouseEnter={() =>
                                handleMouseEnter(
                                  property.id,
                                  `${API_BASE_URL}${amenity.image}`
                                )
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(
                                  property.id,
                                  `${API_BASE_URL}${property.image}`
                                )
                              }
                            >
                              <img
                                src={`${API_BASE_URL}${amenity.image}`}
                                alt={amenity.name}
                                className="w-full h-16 object-cover rounded-lg transition-transform duration-200 hover:scale-110"
                              />
                              <p className="text-center text-sm text-gray-600 mt-2">
                                {amenity.name}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ Office Container */}
      {officeResults.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center sm:text-left">
            Offices
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-8">
            {officeResults.map((office) => {
              const displayedImage =
                hoveredImages[office.id] || `${API_BASE_URL}${office.image}`;
              const statusColor =
                statusOfficeColors[office.status] || "bg-gray-500";

              return (
                <div
                  key={office.id}
                  className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full lg:w-full"
                >
                  <div className="relative w-full sm:w-1/3">
                    {/* ✅ Status Badge */}
                    <span
                      className={`absolute top-2 left-2 ${statusColor} text-white py-1 px-3 rounded-lg text-xs font-bold`}
                    >
                      {office.status}
                    </span>
                    <img
                      src={displayedImage}
                      alt={office.name}
                      className="w-full h-52 sm:h-full object-cover transition-all duration-300"
                    />
                  </div>

                  <div className="p-6 flex-1 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {office.name}
                      </h2>

                      <Link
                        href={`/user/office/${office.id}`}
                        className="bg-blue-700 text-white text-sm font-semibold px-3 py-1 rounded-sm shadow-md transition-all duration-300 hover:bg-blue-800"
                      >
                        View More
                      </Link>
                    </div>

                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {formatPrice(office.price)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {office.location}
                    </p>

                    <p className="text-md text-gray-700 mt-2 line-clamp-2">
                      {office.description.split(".")[0]}.
                    </p>

                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Amenities
                      </h3>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {office.amenities.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;
