"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Link from "next/link";
interface PropertyInquiryProps {
  onClose: () => void; // Function to handle modal closing
}

const PropertyInquiry: React.FC<PropertyInquiryProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    property: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Get properties from Redux store
  const projects = useSelector((state: RootState) => state.propertyData.properties);

  // Find selected property details
  const selectedProperty = projects.find((p) => p.name === formData.property);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inquiry Submitted:", formData);
  };
return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-[90%] transition-all duration-300 ease-in-out ${
          selectedProperty ? "max-w-4xl flex flex-col sm:flex-row" : "max-w-md"
        } relative`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            onClose(); // Close the popup first
          }}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
        >
          <Link href="/user/property/all">&times;</Link>
        </button>

        {/* Left Side: Property Details (Only Show If Selected) */}
        {selectedProperty && (
          <div className="w-full sm:w-1/2 p-4">
            <img
              src={selectedProperty.image}
              alt={selectedProperty.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800">{selectedProperty.name}</h2>
            <p className="text-gray-600">{selectedProperty.location}</p>
            <p className="mt-2 text-sm text-gray-700">{selectedProperty.description}</p>
         <p className="mt-2 font-semibold text-lg text-[#B8986E]">
  {selectedProperty.price
    ? selectedProperty.price
        .split(" - ") // Split the range
        .map((price) => `₱${new Intl.NumberFormat("en-PH").format(Number(price))}`) // Format & add ₱ to each
        .join(" - ") // Rejoin formatted range
    : "Price upon request"}
</p>

          </div>
        )}

        {/* Right Side: Inquiry Form */}
        <div
          className={`w-full p-4 transition-all ${
            selectedProperty ? "sm:w-1/2 border-l border-gray-300" : "text-start"
          }`}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Inquire About a Property</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Property */}
            <div>
              <label className="block text-gray-700 font-medium">Select Property</label>
              <select
                name="property"
                value={formData.property}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select a property</option>
                {projects.map((property) => (
                  <option key={property.name} value={property.name}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Link href="/user/property/all">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition"
                >
                  Submit Inquiry
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyInquiry;
