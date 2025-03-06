import { useState } from "react";
import { showToast } from "@/components/toast";

interface Amenity {
  name: string;
  image?: File | string; // Can be an existing URL or new File
  originalImage?: string; // Store the previous image URL
}

interface EditAmenitiesModalProps {
  propertyId: number;
  amenities: Amenity[];
  setAmenities: (amenities: Amenity[]) => void;
  closeModal: () => void;
  fetchProperties: () => void; // Refresh after update
}

export default function EditAmenitiesModal({
  propertyId,
  amenities,
  setAmenities,
  closeModal,
  fetchProperties,
}: EditAmenitiesModalProps) {
  const [newAmenity, setNewAmenity] = useState<Amenity>({ name: "", image: undefined });
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Handle name change for existing amenities
  const handleAmenityChange = (index: number, value: string) => {
    const updatedAmenities = [...amenities];
    updatedAmenities[index].name = value;
    setAmenities(updatedAmenities);
  };

  // Handle image change
const handleAmenityImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const updatedAmenities = [...amenities];

    updatedAmenities[index] = {
      ...updatedAmenities[index],
      image: e.target.files[0], // ✅ Store new file
      originalImage:
        typeof updatedAmenities[index].image === "string"
          ? updatedAmenities[index].image // ✅ Ensure only a string (old URL) is stored
          : updatedAmenities[index].originalImage,
    };

    setAmenities(updatedAmenities);
  }
};

  // Add new amenity
  const handleAddAmenity = () => {
    if (newAmenity.name.trim() !== "") {
      setAmenities([...amenities, { ...newAmenity, originalImage: undefined }]);
      setNewAmenity({ name: "", image: undefined });
    }
  };

  // Remove an amenity
  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  // Handle form submission
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("propertyId", propertyId.toString());

  amenities.forEach((amenity, index) => {
    formData.append(`amenities[${index}][name]`, amenity.name);

    if (amenity.image instanceof File) {
      formData.append(`amenities[${index}][image]`, amenity.image); // ✅ Upload new image
    } 
    
    // ✅ Ensure original image is sent when no new file is chosen
    if (typeof amenity.image === "string") {
      formData.append(`amenities[${index}][originalImage]`, amenity.image); // ✅ Keep old image URL
    } else if (amenity.originalImage) {
      formData.append(`amenities[${index}][originalImage]`, amenity.originalImage); // ✅ Backup old image
    }
  });

  // 🔹 Log FormData before sending
  console.log("🔹 Submitting FormData:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/property/updateAmenities/${propertyId}`, {
      method: "POST",
      headers: { Accept: "application/json" }, // ✅ Ensure proper response handling
      body: formData,
    });

    if (response.ok) {
      showToast("Amenities updated successfully", "success");
      fetchProperties(); // ✅ Refresh property data
      closeModal(); // ✅ Close modal
    } else {
      const errorText = await response.text();
      console.error("❌ Failed to update amenities:", errorText);
    }
  } catch (error) {
    showToast("Error updating amenities: " + error, "error");
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Edit Amenities</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={amenity.name}
                  onChange={(e) => handleAmenityChange(index, e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter amenity name"
                />
                <input
                  type="file"
                  onChange={(e) => handleAmenityImageChange(index, e)}
                  className="w-full border rounded-md px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>

              {/* Image Comparison: Old vs New */}
              <div className="flex items-center justify-between space-x-4 mt-2">
                {/* Old Image */}
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">Current Image</span>
                  <img
                    src={
                      amenity.image instanceof File
                        ? URL.createObjectURL(amenity.image) // ✅ Preview new image
                        : `${API_BASE_URL}${amenity.originalImage || amenity.image}` // ✅ Keep old image
                    }
                    alt={amenity.name}
                    className="w-20 h-20 rounded-md object-cover border border-gray-300"
                  />
                </div>

                <span className="text-xl font-semibold">→</span>

                {/* New Image Preview */}
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">New Image</span>
                  {amenity.image instanceof File ? (
                    <img
                      src={URL.createObjectURL(amenity.image)}
                      alt="New Image Preview"
                      className="w-20 h-20 rounded-md object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center border border-dashed border-gray-400 text-gray-500 text-xs">
                      No new image
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Amenity */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newAmenity.name}
              onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              placeholder="New amenity name"
            />
            <input
              type="file"
              onChange={(e) =>
                setNewAmenity({ ...newAmenity, image: e.target.files?.[0] || undefined })
              }
              className="w-full border rounded-md px-3 py-2"
            />
            <button type="button" onClick={handleAddAmenity} className="text-blue-500">
              Add
            </button>
          </div>

          {/* Submit & Close Buttons */}
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Save
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 ml-2"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
