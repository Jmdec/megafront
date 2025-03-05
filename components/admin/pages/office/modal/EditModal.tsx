import { useState, useEffect } from "react";
import { showToast } from "@/components/toast";

interface EditModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
  office: {
    id: number;
    name: string;
    description: string;
    image: string;
    location: string;
    status: string;
    price: string;
    lotArea: string;
    amenities: string[];
  } | null;
}

const EditModal: React.FC<EditModalProps> = ({ modalOpen, closeModal, fetchData, office }) => {
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [updatedOffice, setUpdatedOffice] = useState({
    name: "",
    description: "",
    image: null as File | null,
    location: "",
    status: "",
    price: "",
    lotArea: "",
    amenities: [""],
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (office) {
      setUpdatedOffice({
        name: office.name,
        description: office.description,
        image: null, // Keep existing image unless changed
        location: office.location,
        status: office.status,
        price: office.price,
        lotArea: office.lotArea,
        amenities: Array.isArray(office.amenities) ? office.amenities : JSON.parse(office.amenities || "[]"),
      });
    }
  }, [office]);

  // ✅ Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/location`);
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleUpdateOffice = async () => {
  if (!updatedOffice.name.trim() || !updatedOffice.location || !updatedOffice.status || !updatedOffice.price.trim()) {
    showToast("Name, Location, Status, and Price are required.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("name", updatedOffice.name);
  formData.append("description", updatedOffice.description);
  formData.append("location", updatedOffice.location);
  formData.append("status", updatedOffice.status);
  formData.append("price", updatedOffice.price);
  formData.append("lotArea", updatedOffice.lotArea);
  formData.append("amenities", JSON.stringify(updatedOffice.amenities.filter(Boolean)));

  if (updatedOffice.image) {
    formData.append("image", updatedOffice.image);
  } else {
    formData.append("image", office?.image || ""); // ✅ Keep the existing image
  }

  // ✅ Debug: Log FormData before sending
  console.log("🔹 Updating Office with FormData:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/office/${office?.id}`, {
      method: "POST", // ✅ Using POST directly
      body: formData,
    });

    if (response.ok) {
      showToast("Office updated successfully", "success");
      fetchData();
      closeModal();
    } else {
      showToast("Failed to update office.", "error");
    }
  } catch (error) {
    console.error("Error updating office:", error);
    showToast("Error updating office.", "error");
  }
};



  return modalOpen && office ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4">Edit Office</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={updatedOffice.name}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block font-medium mb-1">Location</label>
            <select
              value={updatedOffice.location}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, location: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>

            <label className="block font-medium mb-1">Status</label>
            <select
              value={updatedOffice.status}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, status: e.target.value })}
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
              placeholder="Enter Price"
              value={updatedOffice.price}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, price: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
          </div>

          {/* Right Column */}
          <div>
            <label className="block font-medium mb-1">Lot Area</label>
            <input
              type="text"
              placeholder="Enter Lot Area in SQM"
              value={updatedOffice.lotArea}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, lotArea: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter Description"
              value={updatedOffice.description}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            {/* Image Upload */}
            <label className="block font-medium mb-1">Image</label>
            <input
              type="file"
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, image: e.target.files?.[0] || null })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
          </div>
        </div>

        {/* Amenities Section */}
        <div className="mt-4">
          <label className="block font-medium mb-1">Amenities</label>
          {updatedOffice.amenities.map((amenity, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenity}
                onChange={(e) => {
                  const updatedAmenities = [...updatedOffice.amenities];
                  updatedAmenities[index] = e.target.value;
                  setUpdatedOffice({ ...updatedOffice, amenities: updatedAmenities });
                }}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter Amenity"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={handleUpdateOffice} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Update
          </button>
          <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditModal;
