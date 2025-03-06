import { useState, useEffect } from "react";
import { showToast } from "@/components/toast";

interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ modalOpen, closeModal, fetchData }) => {
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState("Property");

const [newProperty, setNewProperty] = useState({
  name: "",
  description: "",
  priceRange: "",
  lotArea: "",
  image: null as File | null,
  masterPlan: null as File | null,
  location: "",
  specificLocation: "", 
  status: "",
  developmentType: "", 
  units: [] as string[], // to store selected units
  features: [{ name: "" }] as { name: string }[], // to store dynamic features
  amenities: [{ name: "", image: null as File | null }] as { name: string; image: File | null }[], // amenities with name and image
  floors: "",  // Stores number of floors
  parkingLots: "",  // Stores number of parking lots
});



  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    const { name, value } = e.target;
    setNewProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNewProperty((prev) => ({ ...prev, image: file }));
    }
  };

  const handleMasterPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNewProperty((prev) => ({ ...prev, masterPlan: file }));
    }
  };

  const handleUnitSelection = (unitType: string) => {
    setNewProperty((prev) => ({
      ...prev,
      units: prev.units.includes(unitType)
        ? prev.units.filter((unit) => unit !== unitType)
        : [...prev.units, unitType],
    }));
  };

  const handleSelectAllUnits = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setNewProperty((prev) => ({
      ...prev,
      units: isChecked ? ["1BR", "2BR", "3BR", "Studio"] : [],
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    setNewProperty((prev) => ({
      ...prev,
      features: [...prev.features, { name: "" }],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setNewProperty((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newProperty.features];
    updatedFeatures[index].name = value;
    setNewProperty({ ...newProperty, features: updatedFeatures });
  };

  const handleAddAmenity = () => {
    setNewProperty((prev) => ({
      ...prev,
      amenities: [...prev.amenities, { name: "", image: null }],
    }));
  };

  const handleRemoveAmenity = (index: number) => {
    setNewProperty((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleAmenityChange = (index: number, value: string) => {
    const updatedAmenities = [...newProperty.amenities];
    updatedAmenities[index].name = value;
    setNewProperty({ ...newProperty, amenities: updatedAmenities });
  };

const handleAmenityImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files ? e.target.files[0] : null;
  if (file) {
    // Ensure we're updating the right amenity's image
    const updatedAmenities = [...newProperty.amenities];
    updatedAmenities[index].image = file;
    setNewProperty({ ...newProperty, amenities: updatedAmenities });
  }
};
const handleAddProperty = async () => {
  const formData = new FormData();

  // Append property details
  formData.append("name", newProperty.name);
  formData.append("description", newProperty.description);
  formData.append("priceRange", newProperty.priceRange);
  formData.append("lotArea", newProperty.lotArea);
  formData.append("location", newProperty.location);
formData.append("specificLocation", newProperty.specificLocation);  // Ensure it's sent

  formData.append("status", newProperty.status);
  formData.append("developmentType", newProperty.developmentType);

  // Append units (as JSON string)
  formData.append("units", JSON.stringify(newProperty.units));

  // Append floors and parking lots
  formData.append("floors", newProperty.floors); // Append floors
  formData.append("parkingLots", newProperty.parkingLots); // Append parking lots

  // Log the files being added to FormData (image and masterPlan)
  if (newProperty.image) {
    console.log("Image File:", newProperty.image);  // Log full file object
    formData.append("image", newProperty.image);
  }
  if (newProperty.masterPlan) {
    console.log("Master Plan File:", newProperty.masterPlan);  // Log full file object
    formData.append("masterPlan", newProperty.masterPlan);
  }

  // Handle amenities data
  newProperty.amenities.forEach((amenity, index) => {
    formData.append(`amenities[${index}][name]`, amenity.name);
    if (amenity.image) {
      console.log(`Amenity Image File ${index}:`, amenity.image); // Log full file object
      formData.append(`amenities[${index}][image]`, amenity.image);
    }
  });

  // Handle features data
  newProperty.features.forEach((feature, index) => {
    formData.append(`features[${index}][name]`, feature.name); // Assuming each feature has a name
  });

  // Log FormData for debugging
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": ", pair[1] instanceof File ? pair[1].name : pair[1]);  // If it's a file, log its name
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/property`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      showToast("Property added successfully", "success");
      fetchData();
      closeModal();
    } else {
      showToast("Failed to add property.", "error");
    }
  } catch (error) {
    console.error("Error adding property:", error);
    showToast("Error adding property.", "error");
  }
};




  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4">Add Property</h2>

        <div className="flex border-b mb-4">
          {["Property", "Features", "Amenities"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Conditional rendering based on active tab */}
        {activeTab === "Property" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Name */}
    <div>
      <label className="block font-medium">Name</label>
      <input
        type="text"
        name="name"
        value={newProperty.name}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
        placeholder="Enter property name"
      />
    </div>

    {/* Description */}
    <div className="col-span-2">
      <label className="block font-medium">Description</label>
      <textarea
        name="description"
        value={newProperty.description}
        onChange={handleTextareaChange}
        className="w-full border rounded-md px-3 py-2"
        placeholder="Enter property description"
      />
    </div>

    {/* Specific Location */}
    <div>
      <label className="block font-medium">Specific Location</label>
      <input
        type="text"
        name="specificLocation"
        value={newProperty.specificLocation}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
        placeholder="Enter specific location"
      />
    </div>

    {/* Unit Selection */}
    <div>
      <label className="block font-medium">Unit</label>
      <div className="space-x-4">
        {["1BR", "2BR", "3BR", "Studio"].map((unit) => (
          <label key={unit} className="inline-flex items-center">
            <input
              type="checkbox"
              checked={newProperty.units.includes(unit)}
              onChange={() => handleUnitSelection(unit)}
              className="form-checkbox"
            />
            <span className="ml-2">{unit}</span>
          </label>
        ))}
      </div>
      {/* Select All */}
      <label className="inline-flex items-center mt-2">
        <input
          type="checkbox"
          checked={newProperty.units.length === 4}
          onChange={handleSelectAllUnits}
          className="form-checkbox"
        />
        <span className="ml-2">Select All</span>
      </label>
    </div>

    {/* Price Range */}
    <div>
      <label className="block font-medium">Price Range</label>
      <input
        type="text"
        name="priceRange"
        value={newProperty.priceRange}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
        placeholder="Enter price range"
      />
    </div>

    {/* Lot Area */}
    <div>
      <label className="block font-medium">Lot Area</label>
      <input
        type="text"
        name="lotArea"
        value={newProperty.lotArea}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
        placeholder="Enter lot area"
      />
    </div>

    {/* Location Dropdown */}
    <div>
      <label className="block font-medium">Location</label>
      <select
        name="location"
        value={newProperty.location}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
      >
        <option value="">Select location</option>
        {locations.map((location) => (
          <option key={location.id} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>
    </div>

    {/* Status Dropdown */}
    <div>
      <label className="block font-medium">Status</label>
      <select
        name="status"
        value={newProperty.status}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
      >
        <option value="">Select status</option>
        <option value="New">New</option>
        <option value="Ready for occupancy">Ready for occupancy</option>
        <option value="Pre-selling">Pre-selling</option>
        <option value="Sold-out">Sold-out</option>
        <option value="Under Construction">Under Construction</option>
      </select>
    </div>

    {/* Development Type Dropdown */}
    <div>
      <label className="block font-medium">Development Type</label>
      <select
        name="developmentType"
        value={newProperty.developmentType}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
      >
        <option value="">Select development type</option>
        <option value="High Rise Condominium">High Rise Condominium</option>
        <option value="Mid Rise Condominium">Mid Rise Condominium</option>
        <option value="Low Rise Condominium">Low Rise Condominium</option>
      </select>
    </div>

    {/* Image Upload */}
    <div>
      <label className="block font-medium">Image</label>
      <input
        type="file"
        onChange={handleImageChange}
        className="w-full border rounded-md px-3 py-2"
      />
    </div>

    {/* Master Plan Upload */}
    <div>
      <label className="block font-medium">Master Plan</label>
      <input
        type="file"
        onChange={handleMasterPlanChange}
        className="w-full border rounded-md px-3 py-2"
      />
    </div>

    {/* Floors Input */}
    <div>
      <label className="block font-medium">Floors</label>
      <input
        type="number"
        name="floors"
        value={newProperty.floors}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
        placeholder="Enter number of floors"
      />
    </div>

    {/* Parking Lots Input */}
    <div>
      <label className="block font-medium">Parking Lots</label>
      <input
        type="number"
        name="parkingLots"
        value={newProperty.parkingLots}
        onChange={handleInputChange}
        className="w-full border rounded-md px-3 py-2"
        placeholder="Enter number of parking lots"
      />
    </div>
  </div>
)}



        {activeTab === "Features" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Features</h3>
            {newProperty.features.map((feature, index) => (
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
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-blue-500 mt-2"
            >
              Add Feature
            </button>
          </div>
        )}

        {activeTab === "Amenities" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Amenities</h3>
          {newProperty.amenities.map((amenity, index) => (
  <div key={index} className="flex items-center space-x-2">
    <input
      type="text"
      value={amenity.name}
      onChange={(e) => handleAmenityChange(index, e.target.value)}
      className="w-full border rounded-md px-3 py-2"
      placeholder="Enter amenity name"
    />
    <input
      type="file"
      onChange={(e) => handleAmenityImageChange(index, e)} // Ensure file is passed correctly
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
))}
            <button
              type="button"
              onClick={handleAddAmenity}
              className="text-blue-500 mt-2"
            >
              Add Amenity
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={handleAddProperty} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
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
