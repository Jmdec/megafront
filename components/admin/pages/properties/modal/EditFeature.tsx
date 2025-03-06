import { useState } from "react";
import { showToast } from "@/components/toast";

interface Feature {
  id: number;  // Ensure ID exists
  name: string;
}

interface EditFeaturesModalProps {
  propertyId: number;
  features: Feature[];
  setFeatures: (features: Feature[]) => void;
  closeModal: () => void;
  fetchProperties: () => void; // ✅ Ensure it's included
}


export default function EditFeaturesModal({ features, setFeatures, closeModal,propertyId,fetchProperties }: EditFeaturesModalProps) {
  const [newFeature, setNewFeature] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].name = value;
    setFeatures(updatedFeatures);
  };

const handleAddFeature = () => {
  if (newFeature.trim() !== "") {
    const newFeatureObject: Feature = {
      id: features.length > 0 ? Math.max(...features.map(f => f.id)) + 1 : 1, // Assign unique ID
      name: newFeature,
    };
    setFeatures([...features, newFeatureObject]); // Ensure ID is always included
    setNewFeature("");
  }
};


  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Ensure all features have only `name`
  const updatedFeatures = features.map((feature) => ({
    name: feature.name, // Remove `id`
  }));

  const formData = new FormData();
  formData.append("propertyId", propertyId.toString());
  formData.append("features", JSON.stringify(updatedFeatures));

  console.log("Submitting FormData:", Object.fromEntries(formData.entries()));

  try {
    const response = await fetch(`${API_BASE_URL}/api/property/updateFeature/${propertyId}`, {
      method: "POST",
      headers: { "Accept": "application/json" }, // Ensure correct response type
      body: formData,
    });

    if (response.ok) {
      showToast("✅ Features updated successfully","success");

      // 🔹 Fetch latest properties to update UI immediately
      fetchProperties();

      // 🔹 Close modal after update
      closeModal();
    } else {
      const errorText = await response.text();
      console.error("❌ Failed to update features:", errorText);
    }
  } catch (error) {
    showToast("✅ Failed updating features"+ error,"error");

  }
};



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Edit Features</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature.name}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter feature name"
              />
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="New feature name"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-blue-500"
            >
              Add
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Save
            </button>
            <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 ml-2">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}