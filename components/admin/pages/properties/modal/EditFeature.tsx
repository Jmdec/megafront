import { useState } from "react";
import { useDispatch } from "react-redux"; // Add this import to use dispatch
import { AppDispatch } from "@/app/redux/store"; // Make sure to import AppDispatch
import { showToast } from "@/components/toast";
import { updatePropertyFeatures,fetchProperties } from "@/app/redux/services/propertyService"; // Import the Redux action

interface Feature {
  id: number;
  name: string;
}

interface EditFeaturesModalProps {
  propertyId: number;
  features: Feature[];
  setFeatures: (features: Feature[]) => void;
  closeModal: () => void;
// Ensure it's included
}

export default function EditFeaturesModal({
  features,
  setFeatures,
  closeModal,
  propertyId,
  
}: EditFeaturesModalProps) {
  const dispatch = useDispatch<AppDispatch>(); // Use the correct type for dispatch
  const [newFeature, setNewFeature] = useState("");

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
      setFeatures([...features, newFeatureObject]); // Update local state immediately
      setNewFeature(""); // Clear the input field
    }
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures); // Update local state immediately
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prepare the data
    const updatedFeatures = features.map((feature) => ({
      name: feature.name, // Remove ID
    }));

    const formData = new FormData();
    formData.append("propertyId", propertyId.toString());
    formData.append("features", JSON.stringify(updatedFeatures));


    try {
      // Dispatch Redux action to update features
      await dispatch(updatePropertyFeatures({ id: propertyId, updatedFeatures: formData }));

     
      dispatch(fetchProperties()); // Fetch properties to ensure data is refreshed from the server
      closeModal(); // Close the modal
    } catch (error) {
      console.error("Error updating features:", error);
      showToast("Error updating features", "error");
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
