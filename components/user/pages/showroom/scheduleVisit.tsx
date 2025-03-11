"use client";
import Link from "next/link";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/store";
import { addClientAppointment } from "@/app/redux/services/clientappointmentService"; // Redux action
import { AppDispatch } from "@/app/redux/store";
import Cookies from "js-cookie"; // For authentication token
import { showToast } from "@/components/toast"; // Import Toast notifications

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ScheduleVisitProps {
  onClose: () => void; // Function to handle modal closing
}

const ScheduleVisit: React.FC<ScheduleVisitProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    property: "",
    propertyId: "",
    name: "",
    email: "",
    contactNumber: "",
    date: "", // Added Date input
    message: "", // ✅ Added message field
    status: "Pending", // Default status
    type: "Visit", // Appointment type
  });

  const projects = useSelector((state: RootState) => state.propertyData.properties);
  const selectedProperty = projects.find((p) => p.name === formData.property);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "property") {
      const selected = projects.find((p) => p.name === value);
      setFormData({
        ...formData,
        property: value,
        propertyId: selected ? selected.id.toString() : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = Cookies.get("auth_token");

    if (!authToken) {
      showToast("Authentication required. Please log in.", "error");
      return;
    }

    const selected = projects.find((p) => p.name === formData.property);

    const visitData = {
      property_id: selected ? selected.id : parseInt(formData.propertyId), // Ensure it's a number
      property_name: formData.property,
      name: formData.name,
      email: formData.email,
      contact_number: formData.contactNumber, // ✅ Included contact number
      date: formData.date,
      message: formData.message, // ✅ Included message
      status: formData.status,
      type: formData.type, // Always "Schedule to Visit"
    };

    try {
      const result = await dispatch(addClientAppointment(visitData));

      if (result.type === "clientAppointments/add/fulfilled") {
        
        onClose(); // Close modal on success
      }
    } catch (error) {
      console.error("❌ Error scheduling visit:", error);
 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-[90%] transition-all duration-300 ease-in-out ${
          selectedProperty ? "max-w-4xl flex flex-col sm:flex-row" : "max-w-md"
        } relative`}
      >
        {/* Close Button */}
        <button onClick={() => onClose()} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl">
          <Link href="/user/property/all">&times;</Link>
        </button>

        {/* Property Details */}
        {selectedProperty && (
          <div className="w-full sm:w-1/2 p-4 text-xs sm:text-sm">
            <img
              src={`${API_BASE_URL}${selectedProperty.image}`}
              alt={selectedProperty.name}
              className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3"
            />

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{selectedProperty.name}</h2>
            <p className="text-gray-600">{selectedProperty.location} - {selectedProperty.specificLocation}</p>
            <p className="mt-2 font-semibold text-xs sm:text-sm text-black">
              {selectedProperty.priceRange
                ? selectedProperty.priceRange
                    .split(" - ")
                    .map((price) => `₱${Number(price).toLocaleString()}`)
                    .join(" - ")
                : "Price upon request"}
            </p>
            <p className="mt-2"><strong>Status:</strong> {selectedProperty.status}</p>
            <p className="mt-2"><strong>Development Type:</strong> {selectedProperty.developmentType}</p>
            <p className="mt-2"><strong>Floors:</strong> {selectedProperty.floors} | <strong>Parking Lots:</strong> {selectedProperty.parkingLots}</p>
            <p className="mt-2"><strong>Lot Area:</strong> {selectedProperty.lotArea} sqm</p>
          </div>
        )}

        {/* Schedule Visit Form */}
        <div className={`w-full p-4 transition-all ${selectedProperty ? "sm:w-1/2 border-l border-gray-300" : "text-start"}`}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Schedule a Visit</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Property Selection */}
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

            {/* Contact Number */}
            <div>
              <label className="block text-gray-700 font-medium">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700 font-medium">Preferred Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
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
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition">
                Schedule Visit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleVisit;
