"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/store";
import { AppDispatch } from "@/app/redux/store";
import { fetchOffices } from "@/app/redux/services/officeService"; 
import { fetchProperties } from "@/app/redux/services/propertyService"; 
import { addClientAppointment } from "@/app/redux/services/clientappointmentService"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface PropertyInquiryProps {
  onClose: () => void;
}

const PropertyInquiry: React.FC<PropertyInquiryProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    property: "",
    propertyId: "",
    name: "",
    email: "",
    message: "",
    contactNumber: "",
  });

  const [selectedType, setSelectedType] = useState<"property" | "office">("property"); // State to switch between Property and Office

  const projects = useSelector((state: RootState) => state.propertyData.properties);
  const offices = useSelector((state: RootState) => state.officeData.offices);

const [selectedItem, setSelectedItem] = useState<any>(null);

useEffect(() => {
  if (!formData.property) return;

  const foundItem =
    selectedType === "property"
      ? projects.find((p) => p.name.toLowerCase() === formData.property.toLowerCase())
      : offices.find((o) => o.name.toLowerCase() === formData.property.toLowerCase());

  console.log("🔹 Selected Item:", foundItem);
  setSelectedItem(foundItem); // ✅ Update state when selection changes
}, [formData.property, selectedType, projects, offices]);

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchOffices());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "property") {
      const selectedItem = selectedType === "property"
        ? projects.find((p) => p.name === value)
        : offices.find((o) => o.name === value);

      console.log("Selected Item:", selectedItem);

      setFormData({
        ...formData,
        property: value,
        propertyId: selectedItem ? selectedItem.id.toString() : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    const status = "Pending";
    const date = new Date().toISOString();

    const appointmentData = {
      property_id: selectedItem ? selectedItem.id : parseInt(formData.propertyId),
      property_name: formData.property,
      name: formData.name,
      email: formData.email,
      date: date,
      message: formData.message,
      contact_number: formData.contactNumber,
      status: status,
      type: selectedType === "property" ? "Property Inquiry" : "Office Inquiry",
    };

    try {
      const result = await dispatch(addClientAppointment(appointmentData));

      if (result.type === "clientAppointments/add/fulfilled") {
        onClose();
      }

      console.log("✅ Appointment Submitted Successfully:", result);
    } catch (error) {
      console.error("❌ Error submitting the appointment", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-[90%] transition-all duration-300 ease-in-out ${
          formData.property ? "max-w-4xl flex flex-col sm:flex-row" : "max-w-md"
        } relative`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
        >
          <Link href="/user/property/all">&times;</Link>
        </button>
  {selectedItem && (
  <div className="w-full sm:w-1/2 p-4 text-xs sm:text-sm">
    <img
      src={`${API_BASE_URL}${selectedItem.image}`}
      alt={selectedItem.name}
      className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3"
    />
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{selectedItem.name}</h2>

    <p className="text-gray-600">
      {selectedItem.location}
    </p>

    {"priceRange" in selectedItem && (
      <>
        <p className="mt-2 font-semibold text-xs sm:text-sm text-black">
          {selectedItem.priceRange
            ? selectedItem.priceRange
                .split(" - ")
                .map((price:any) => `₱${Number(price).toLocaleString()}`)
                .join(" - ")
            : "Price upon request"}
        </p>
        <p className="mt-2"><strong>Status:</strong> {selectedItem.status}</p>
        <p className="mt-2"><strong>Development Type:</strong> {selectedItem.developmentType}</p>
        <p className="mt-2"><strong>Floors:</strong> {selectedItem.floors} | <strong>Parking Lots:</strong> {selectedItem.parkingLots}</p>
        <p className="mt-2"><strong>Lot Area:</strong> {selectedItem.lotArea} sqm</p>
      </>
    )}

    {"price" in selectedItem && (
      <>
      <p className="mt-2 font-semibold text-xs sm:text-sm text-black">
  {selectedItem.price
    ? selectedItem.price
        .split(" - ") // Split into two parts: ["7000000", "11000000"]
        .map((price:any) => `₱${Number(price).toLocaleString()}`) // Convert both parts
        .join(" - ") // Join them back with a hyphen
    : "Price upon request"}
</p>

        <p className="mt-2"><strong>Status:</strong> {selectedItem.status}</p>
        <p className="mt-2"><strong>Lot Area:</strong> {selectedItem.lotArea} sqm</p>

        {/* ✅ Office-Specific Amenities (If Available) */}
        {Array.isArray(selectedItem.amenities) && (
          <p className="mt-2"><strong>Amenities:</strong> {selectedItem.amenities.join(", ")}</p>
        )}
      </>
    )}

    <p className="mt-2 text-gray-700"><strong>Description:</strong> {selectedItem.description.split(".")[0]}.</p>
  </div>
)}


        <div className="w-full p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Submit an Inquiry</h2>

          {/* 🔹 Selection Type */}
          <div className="flex gap-4 justify-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectedType"
                value="property"
                checked={selectedType === "property"}
                onChange={() => setSelectedType("property")}
                className="form-radio"
              />
              Property
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectedType"
                value="office"
                checked={selectedType === "office"}
                onChange={() => setSelectedType("office")}
                className="form-radio"
              />
              Office
            </label>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 🔹 Property or Office Selection */}
            <div>
              <label className="block text-gray-700 font-medium">
                {selectedType === "property" ? "Select Property" : "Select Office"}
              </label>
              <select
                name="property"
                value={formData.property}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  {selectedType === "property" ? "Select a property" : "Select an office"}
                </option>
                {selectedType === "property"
                  ? projects.map((property) => (
                      <option key={property.name} value={property.name}>
                        {property.name}
                      </option>
                    ))
                  : offices.map((office) => (
                      <option key={office.name} value={office.name}>
                        {office.name}
                      </option>
                    ))}
              </select>
            </div>

            {/* 🔹 Name */}
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

            {/* 🔹 Email */}
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

            {/* 🔹 Contact Number */}
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

            {/* 🔹 Message */}
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

            {/* 🔹 Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition"
              >
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyInquiry;
