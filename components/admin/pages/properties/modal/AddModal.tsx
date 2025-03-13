import { useState, useEffect } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { showToast } from "@/components/toast";
import { addProperty } from "@/app/redux/services/propertyService"; // Import addProperty action
import { AppDispatch } from "@/app/redux/store"; // Import AppDispatch to type dispatch correctly
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
}

const AddModal: React.FC<AddModalProps> = ({
  modalOpen,
  closeModal,
  fetchData,
}) => {
  const dispatch = useDispatch<AppDispatch>(); // Correctly type dispatch using AppDispatch
  const initialValues = {
    name: "",
    description: "",
    specificLocation: "",
    units: [],
    priceRange: "",
    lotArea: "",
    location: "",
    status: "",
    developmentType: "",
    image: null,
    masterPlan: null,
    floors: "",
    parkingLots: "",
    amenities: [{ name: "", image: null }],
    features: [{ name: "" }],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Property Name is required"),
    description: Yup.string().required("Description is required"),
    specificLocation: Yup.string().required("Specific Location is required"),
    priceRange: Yup.string().required("Price Range is required"),
    lotArea: Yup.string().required("Lot Area is required"),
    location: Yup.string().required("Location is required"),
    status: Yup.string().required("Status is required"),
    developmentType: Yup.string().required("Development Type is required"),
    floors: Yup.number()
      .required("Floors are required")
      .min(1, "Must be at least 1"),
    parkingLots: Yup.number()
      .required("Parking Lots are required")
      .min(0, "Cannot be negative"),
    units: Yup.array()
      .of(Yup.string())
      .min(1, "At least one unit must be selected"),
    image: Yup.mixed().required("Property Image is required"),
    masterPlan: Yup.mixed().required("Master Plan is required"),
  });
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    []
  );
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
    amenities: [{ name: "", image: null as File | null }] as {
      name: string;
      image: File | null;
    }[], // amenities with name and image
    floors: "", // Stores number of floors
    parkingLots: "", // Stores number of parking lots
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  const handleAmenityImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    formData.append("specificLocation", newProperty.specificLocation);
    formData.append("status", newProperty.status);
    formData.append("developmentType", newProperty.developmentType);

    // Append units (as JSON string)
    formData.append("units", JSON.stringify(newProperty.units));

    // Append floors and parking lots
    formData.append("floors", newProperty.floors);
    formData.append("parkingLots", newProperty.parkingLots);

    // Handle files
    if (newProperty.image) {
      formData.append("image", newProperty.image);
    }
    if (newProperty.masterPlan) {
      formData.append("masterPlan", newProperty.masterPlan);
    }

    // Handle amenities data
    newProperty.amenities.forEach((amenity, index) => {
      formData.append(`amenities[${index}][name]`, amenity.name);
      if (amenity.image) {
        formData.append(`amenities[${index}][image]`, amenity.image);
      }
    });

    // Handle features data
    newProperty.features.forEach((feature, index) => {
      formData.append(`features[${index}][name]`, feature.name);
    });

    // ✅ Log all form data before sending
    console.log("Form Data:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Dispatch Redux action to add the property
      await dispatch(addProperty(formData));

      // Refresh property data after successful addition
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error adding property:", error);
      showToast("Error adding property.", "error");
    }
  };

  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Add Property</h2>

        <div className="flex border-b mb-4">
          {["Property", "Features", "Amenities"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Formik
          initialValues={{
            name: "",
            description: "",
            specificLocation: "",
            units: [], // Array handling
            priceRange: "",
            lotArea: "",
            location: "",
            status: "",
            developmentType: "",
            image: null, // File handling
            masterPlan: null, // File handling
            floors: "",
            parkingLots: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const formData = new FormData();

            // Append text fields
            Object.keys(values).forEach((key) => {
              const typedKey = key as keyof typeof values; // 🔹 Explicitly cast key
              if (key !== "image" && key !== "masterPlan" && key !== "units") {
                formData.append(key, values[typedKey] as string); // 🔹 Ensure type safety
              }
            });

            // Append units as JSON string
            formData.append("units", JSON.stringify(values.units));

            // Append files
            if (values.image) formData.append("image", values.image);
            if (values.masterPlan)
              formData.append("masterPlan", values.masterPlan);

            // ✅ Debugging: Check if FormData is populated
            console.log("Form Data:");
            for (let [key, value] of formData.entries()) {
              console.log(`${key}:`, value);
            }

            // Send formData to backend (Replace with Redux action or fetch request)
            dispatch(addProperty(formData));
            closeModal();
          }}
        >
          {({ values, setFieldValue, setFieldTouched, validateField }) => (
            <Form className=" gap-6">
              {activeTab === "Property" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium">Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Enter property name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block font-medium">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Enter property description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Specific Location */}
                  <div>
                    <label className="block font-medium">
                      Specific Location
                    </label>
                    <Field
                      type="text"
                      name="specificLocation"
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Enter specific location"
                    />
                    <ErrorMessage
                      name="specificLocation"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Unit Selection */}
                  <div>
                    <label className="block font-medium">Unit</label>
                    <div className="space-x-4">
                      {["1BR", "2BR", "3BR", "Studio"].map((unit) => (
                        <label key={unit} className="inline-flex items-center">
                          <Field
                            type="checkbox"
                            name="units"
                            value={unit}
                            className="form-checkbox"
                          />
                          <span className="ml-2">{unit}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name="units"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block font-medium">Price Range</label>
                    <Field
                      type="text"
                      name="priceRange"
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Enter price range"
                    />
                    <ErrorMessage
                      name="priceRange"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Lot Area */}
                  <div>
                    <label className="block font-medium">Lot Area</label>
                    <Field
                      type="text"
                      name="lotArea"
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Enter lot area"
                    />
                    <ErrorMessage
                      name="lotArea"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Location Dropdown */}
                  <div>
                    <label className="block font-medium">Location</label>
                    <Field
                      as="select"
                      name="location"
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">Select location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.name}>
                          {location.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block font-medium">Status</label>
                    <Field
                      as="select"
                      name="status"
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">Select status</option>
                      <option value="New">New</option>
                      <option value="Ready for occupancy">
                        Ready for occupancy
                      </option>
                      <option value="Pre-selling">Pre-selling</option>
                      <option value="Sold-out">Sold-out</option>
                      <option value="Under Construction">
                        Under Construction
                      </option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Development Type Dropdown */}
                  <div>
                    <label className="block font-medium">
                      Development Type
                    </label>
                    <Field
                      as="select"
                      name="developmentType"
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">Select development type</option>
                      <option value="High Rise Condominium">
                        High Rise Condominium
                      </option>
                      <option value="Mid Rise Condominium">
                        Mid Rise Condominium
                      </option>
                      <option value="Low Rise Condominium">
                        Low Rise Condominium
                      </option>
                    </Field>
                    <ErrorMessage
                      name="developmentType"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block font-medium">Image</label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFieldValue("image", file);
                        setFieldTouched("image", true);
                        validateField("image");
                      }}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Master Plan</label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFieldValue("masterPlan", file);
                        setFieldTouched("masterPlan", true);
                        validateField("masterPlan");
                      }}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    <ErrorMessage
                      name="masterPlan"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Floors Input */}
                  <div>
                    <label className="block font-medium">Floors</label>
                    <Field
                      type="number"
                      name="floors"
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Enter number of floors"
                    />
                    <ErrorMessage
                      name="floors"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Parking Lots Input */}
                  <div>
                    <label className="block font-medium">Parking Lots</label>
                    <Field
                      type="number"
                      name="parkingLots"
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Enter number of parking lots"
                    />
                    <ErrorMessage
                      name="parkingLots"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Buttons */}
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
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
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
                        onChange={(e) =>
                          handleAmenityChange(index, e.target.value)
                        }
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
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  ) : null;
};

export default AddModal;
