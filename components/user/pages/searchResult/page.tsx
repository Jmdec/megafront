"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store"; // Adjust path as needed

const PropertyPage = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use correctly typed dispatch

  // Access the property data from Redux store (searchResults)
  const searchResults = useSelector((state: RootState) => state.propertyData.searchResults);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  // If searchResults is empty, show loading state
  if (searchResults.length === 0) {
    return <div>Loading...</div>;
  }

  // Price formatting function (with comma and peso sign)
  const formatPrice = (priceRange: string) => {
    const prices = priceRange.split(" - ");
    return prices
      .map((price) => `₱ ${Number(price.replace(/[^\d]/g, "")).toLocaleString()}`)
      .join(" - ");
  };

  // Render search results as cards with image on the left and info on the right
  return (
    <div className="container mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Search Results</h1>

      <div className="flex flex-wrap justify-start gap-8">
        {searchResults.map((property) => (
          <div
            key={property.id}
            className="flex bg-white rounded-lg shadow-lg overflow-hidden w-full"
          >
            {/* Image on the left */}
            <div className="relative w-1/3">
              {/* Status Badge */}
              <span className="absolute top-2 left-2 bg-blue-500 text-white py-1 px-3 rounded-lg text-xs font-bold">
                {property.status}
              </span>
              <img
                src={`${API_BASE_URL}${property.image}`}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Information on the right */}
            <div className="p-6 flex-1 relative">
              {/* Price in upper-right corner */}
          

             <h2 className="text-2xl font-semibold text-gray-800">
  {property.name} ({JSON.parse(property.units).join(", ")})
</h2>
    <p className=" top-2 right-2 text-lg font-bold text-gray-900">
                {formatPrice(property.priceRange)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{property.location} - {property.developmentType}</p>

              {/* Limit the description to one sentence */}
              <p className="text-md text-gray-700 mt-2">{property.description.split('.')[0]}.</p>

      

              {/* Amenities Slider */}
   <div className="mt-4">
  <h3 className="text-lg font-semibold text-gray-800">Amenities</h3>
  <div className="grid grid-cols-4 gap-4 py-2">
    {JSON.parse(property.amenities).map((amenity:any, index:any) => (
      <div key={index} className="flex-shrink-0">
        <img
          src={`${API_BASE_URL}${amenity.image}`}
          alt={amenity.name}
          className="w-full h-16 object-cover rounded-lg"
        />
        <p
          className="text-center text-sm text-gray-600 mt-2 overflow-hidden whitespace-nowrap text-ellipsis"
          title={amenity.name}
        >
          {amenity.name}
        </p>
      </div>
    ))}
  </div>
</div>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyPage;
