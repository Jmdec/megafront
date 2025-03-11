import { useState, useEffect } from "react";
import { showToast } from "@/components/toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchLocations } from "@/app/redux/services/locationService";
import { fetchOffices, updateOffice } from "@/app/redux/services/officeService";

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
  const dispatch = useDispatch<AppDispatch>();
  const locations = useSelector((state: RootState) => state.locationData.locations);
  const { error } = useSelector((state: RootState) => state.officeData);

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

  // Set initial state when office prop changes
  useEffect(() => {
    if (office) {
      setUpdatedOffice({
        name: office.name,
        description: office.description,
        image: null,
        location: office.location,
        status: office.status,
        price: office.price,
        lotArea: office.lotArea,
        amenities: Array.isArray(office.amenities) ? office.amenities : JSON.parse(office.amenities || "[]"),
      });
    }
  }, [office]);

  // Fetch locations on mount
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  // ✅ Function to Add an Amenity
  const handleAddAmenity = () => {
    setUpdatedOffice((prev) => ({
      ...prev,
      amenities: [...prev.amenities, ""], // Add an empty string for the new input field
    }));
  };

  // ✅ Function to Remove an Amenity
  const handleRemoveAmenity = (index: number) => {
    setUpdatedOffice((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index), // Remove selected amenity
    }));
  };

  // ✅ Function to Update Office
  const handleUpdateOffice = () => {
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
    formData.append("amenities", JSON.stringify(updatedOffice.amenities.filter(Boolean))); // ✅ Filter out empty values

    if (updatedOffice.image) {
      formData.append("image", updatedOffice.image);
    } else {
      formData.append("image", office?.image || ""); // Keep existing image if not updated
    }

    console.log("🔹 Form Data to be submitted:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    if (office?.id) {
      dispatch(updateOffice({ id: office.id, updatedOffice: formData }))
        .unwrap()
        .then(() => {
          dispatch(fetchOffices());
          closeModal();
        });
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
              <option value="For Lease">For Lease</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>

            <label className="block font-medium mb-1">Price</label>
            <input
              type="text"
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
              value={updatedOffice.lotArea}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, lotArea: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={updatedOffice.description}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

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
              />
              <button onClick={() => handleRemoveAmenity(index)} className="bg-red-500 text-white px-3 py-2 rounded-md">
                ✕
              </button>
            </div>
          ))}
          <button onClick={handleAddAmenity} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            + Add Amenity
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={handleUpdateOffice} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Update
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditModal;
