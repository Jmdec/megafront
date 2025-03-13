"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/components/toast";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchLocations } from "@/app/redux/services/locationService";
import { addOffice } from "@/app/redux/services/officeService";

interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Office Name is required"),
  location: Yup.string().required("Location is required"),
  status: Yup.string().required("Status is required"),
  price: Yup.string().required("Price is required"),
  lotArea: Yup.string().required("Lot Area is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().required("Image is required"),
  amenities: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one amenity is required"),
});

const AddModal: React.FC<AddModalProps> = ({
  modalOpen,
  closeModal,
  fetchData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const locations = useSelector(
    (state: RootState) => state.locationData.locations
  );
  const { error } = useSelector((state: RootState) => state.officeData);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4">Add Office</h2>

        <Formik
          initialValues={{
            name: "",
            description: "",
            image: null as File | null,
            location: "",
            status: "",
            price: "",
            lotArea: "",
            amenities: [""],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("location", values.location);
            formData.append("status", values.status);
            formData.append("price", values.price);
            formData.append("lotArea", values.lotArea);
            formData.append(
              "amenities",
              JSON.stringify(values.amenities.filter((a) => a.trim() !== ""))
            );

            if (values.image) {
              formData.append("image", values.image);
            }

            try {
              await dispatch(addOffice(formData)).unwrap();
              fetchData();
              resetForm();
              closeModal();
            } catch (error: any) {
              showToast(error.message || "Failed to add office", "error");
            }

            setSubmitting(false);
          }}
        >
          {({ setFieldValue, values, setFieldTouched, validateField }) => (
            <Form className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <label className="block font-medium mb-1">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full border rounded-md px-3 py-2 mb-4"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <label className="block font-medium mb-1">Location</label>
                <Field
                  as="select"
                  name="location"
                  className="w-full border rounded-md px-3 py-2 mb-4"
                >
                  <option value="">Select Location</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <label className="block font-medium mb-1">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="w-full border rounded-md px-3 py-2 mb-4"
                >
                  <option value="">Select Status</option>
                  <option value="For Lease">For Lease</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <label className="block font-medium mb-1">Price</label>
                <Field
                  type="text"
                  name="price"
                  className="w-full border rounded-md px-3 py-2 mb-4"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Right Column */}
              <div>
                <label className="block font-medium mb-1">Lot Area</label>
                <Field
                  type="text"
                  name="lotArea"
                  className="w-full border rounded-md px-3 py-2 mb-4"
                />
                <ErrorMessage
                  name="lotArea"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <label className="block font-medium mb-1">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full border rounded-md px-3 py-2 mb-4"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Image Upload */}
                <label className="block font-medium mb-1">Image</label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setFieldValue("image", file); // Set the selected file
                    setFieldTouched("image", true); // Mark the field as touched
                    validateField("image"); // Trigger validation for the image field
                  }}
                  onBlur={() => {
                    setFieldTouched("image", true); // Mark the field as touched on blur
                    validateField("image"); // Trigger validation on blur
                  }}
                  className="w-full border rounded-md px-3 py-2 mb-4"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Amenities Section */}
              <div className="col-span-2">
                <label className="block font-medium mb-1">Amenities</label>
                {values.amenities.map((amenity, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Field
                      type="text"
                      name={`amenities[${index}]`}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedAmenities = [...values.amenities];
                        updatedAmenities.splice(index, 1);
                        setFieldValue("amenities", updatedAmenities);
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue("amenities", [...values.amenities, ""])
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
                >
                  + Add Amenity
                </button>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-end gap-2 mt-6">
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
  );
};

export default AddModal;
