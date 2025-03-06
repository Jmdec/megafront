"use client";
import { useState, useEffect } from "react";
import { showToast } from "@/components/toast";

interface EditPropertyModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  property: any;
  fetchData: () => void;
}

export default function EditPropertyModal({ modalOpen, closeModal, property, fetchData }: EditPropertyModalProps) {
  const [newProperty, setNewProperty] = useState(property);
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (property) {
      setNewProperty(property);
    }
  }, [property]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/location`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setLocations(data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProperty({ ...newProperty, image: e.target.files?.[0] || null });
  };

  const handleMasterPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProperty({ ...newProperty, masterPlan: e.target.files?.[0] || null });
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const formData = new FormData();

    Object.entries(newProperty).forEach(([key, value]) => {
      if (key !== "amenities" && key !== "features") { // Ignore amenities and features
        if (typeof value === "string" || value instanceof Blob) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Convert arrays to JSON
        }
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${API_BASE_URL}/api/property/updateProperty/${newProperty.id}`, {
      method: "POST", // Use POST as per your preference
      body: formData,
    });

    if (response.ok) {
      showToast("Property updated successfully", "success");
      fetchData();
      closeModal();
    } else {
      showToast("Failed to update property", "error");
    }
  } catch (error) {
    showToast("Error updating property: " + error, "error");
  }
};


return (
  modalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Edit Property</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Name</label>
            <input type="text" name="name" value={newProperty.name} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea name="description" value={newProperty.description} onChange={handleTextareaChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Specific Location</label>
            <input type="text" name="specificLocation" value={newProperty.specificLocation} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Unit</label>
            <div className="space-x-4">
              {["1BR", "2BR", "3BR", "Studio"].map((unit) => (
                <label key={unit} className="inline-flex items-center">
                  <input type="checkbox" checked={newProperty.units.includes(unit)} onChange={() => {}} className="form-checkbox" />
                  <span className="ml-2">{unit}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Price Range</label>
            <input type="text" name="priceRange" value={newProperty.priceRange} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Lot Area</label>
            <input type="text" name="lotArea" value={newProperty.lotArea} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Location</label>
            <select name="location" value={newProperty.location} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2">
              <option value="">Select location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.name}>{location.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <select name="status" value={newProperty.status} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2">
              <option value="">Select status</option>
              <option value="New">New</option>
              <option value="Ready for occupancy">Ready for occupancy</option>
              <option value="Pre-selling">Pre-selling</option>
              <option value="Sold-out">Sold-out</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Development Type</label>
            <select name="developmentType" value={newProperty.developmentType} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2">
              <option value="">Select development type</option>
              <option value="High Rise Condominium">High Rise Condominium</option>
              <option value="Mid Rise Condominium">Mid Rise Condominium</option>
              <option value="Low Rise Condominium">Low Rise Condominium</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Floors</label>
            <input type="number" name="floors" value={newProperty.floors} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Parking Lots</label>
            <input type="number" name="parkingLots" value={newProperty.parkingLots} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Image</label>
            <input type="file" onChange={handleImageChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Master Plan</label>
            <input type="file" onChange={handleMasterPlanChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
);
}