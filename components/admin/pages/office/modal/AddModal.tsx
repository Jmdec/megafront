"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store"; // Correct import for RootState and AppDispatch
import { fetchLocations } from "@/app/redux/services/locationService"; // Fetch locations action
import { addOffice } from "@/app/redux/services/officeService"; // Correct import for the addOffice function

interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ modalOpen, closeModal, fetchData }) => {
  const dispatch = useDispatch<AppDispatch>(); // Correctly type dispatch here
  const locations = useSelector((state: RootState) => state.locationData.locations); // Get locations from Redux
  const { loading, error } = useSelector((state: RootState) => state.officeData); // Get office loading and error states

  const [newOffice, setNewOffice] = useState<{
    name: string;
    description: string;
    image: File | null;
    location: string;
    status: string;
    price: string;
    lotArea: string;
    amenities: string[];
  }>( {
    name: "",
    description: "",
    image: null,
    location: "",
    status: "",
    price: "",
    lotArea: "",
    amenities: [""],
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch locations on component mount
  useEffect(() => {
    dispatch(fetchLocations()); // Dispatch fetch locations action
  }, [dispatch]);

  const handleAddOffice = () => {
    if (!newOffice.name.trim() || !newOffice.location || !newOffice.status || !newOffice.price.trim()) {
      showToast("Name, Location, Status, and Price are required.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", newOffice.name);
    formData.append("description", newOffice.description);  
    formData.append("location", newOffice.location);
    formData.append("status", newOffice.status);
    formData.append("price", newOffice.price);
    formData.append("lotArea", newOffice.lotArea);
    formData.append("amenities", JSON.stringify(newOffice.amenities.filter(Boolean)));

    if (newOffice.image) {
      formData.append("image", newOffice.image);
    }

    // Dispatch the add office action (dispatching the thunk)
    dispatch(addOffice(formData)); // This line triggers the action correctly

    // Reset form after submission (optional)
    setNewOffice({
      name: "",
      description: "",
      image: null,
      location: "",
      status: "",
      price: "",
      lotArea: "",
      amenities: [""],
    });

    closeModal()
  };

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4">Add Office</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={newOffice.name}
              onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block font-medium mb-1">Location</label>
            <select
              value={newOffice.location}
              onChange={(e) => setNewOffice({ ...newOffice, location: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            >
              <option value="">Select Location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>

            <label className="block font-medium mb-1">Status</label>
            <select
              value={newOffice.status}
              onChange={(e) => setNewOffice({ ...newOffice, status: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            >
              <option value="">Select Status</option>
              <option value="For Lease">For Lease</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>

            <label className="block font-medium mb-1">Price</label>
            <input
              type="text"
              placeholder="Enter Price (Ex. 9400000 - 13600000)"
              value={newOffice.price}
              onChange={(e) => setNewOffice({ ...newOffice, price: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
          </div>

          {/* Right Column */}
          <div>
            <label className="block font-medium mb-1">Lot Area</label>
            <input
              type="text"
              placeholder="Enter Lot Area in SQM"
              value={newOffice.lotArea}
              onChange={(e) => setNewOffice({ ...newOffice, lotArea: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter Description"
              value={newOffice.description}
              onChange={(e) => setNewOffice({ ...newOffice, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            {/* Image Upload */}
            <label className="block font-medium mb-1">Image</label>
            <input
              type="file"
              onChange={(e) => setNewOffice({ ...newOffice, image: e.target.files?.[0] || null })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
          </div>
        </div>

        {/* Amenities Section */}
        <div className="mt-4">
          <label className="block font-medium mb-1">Amenities</label>
          {newOffice.amenities.map((amenity, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenity}
                onChange={(e) => {
                  const updatedAmenities = [...newOffice.amenities];
                  updatedAmenities[index] = e.target.value;
                  setNewOffice({ ...newOffice, amenities: updatedAmenities });
                }}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter Amenity"
              />
              <button
                type="button"
                onClick={() => {
                  const updatedAmenities = newOffice.amenities.filter((_, i) => i !== index);
                  setNewOffice({ ...newOffice, amenities: updatedAmenities });
                }}
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setNewOffice({ ...newOffice, amenities: [...newOffice.amenities, ""] })}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
          >
            + Add Amenity
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={handleAddOffice} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Save
          </button>
          <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddModal;
