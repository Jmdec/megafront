"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { showToast } from "@/components/toast";
import { fetchLocations } from "@/app/redux/services/locationService";
import { updateProperty } from "@/app/redux/services/propertyService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface EditPropertyModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  property: any;
  fetchData: () => void;
}

export default function EditPropertyModal({
  modalOpen,
  closeModal,
  property,
  fetchData,
}: EditPropertyModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const locations = useSelector(
    (state: RootState) => state.locationData.locations
  );

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
    image: Yup.mixed().nullable(),
    masterPlan: Yup.mixed().nullable(),
  });

  useEffect(() => {
    dispatch(fetchLocations());

  }, [dispatch]);

  if (!property) return null; // Prevent rendering if no property is selected

  return (
    modalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Edit Property</h2>
          <Formik
            initialValues={{
              name: property.name || "",
              description: property.description || "",
              specificLocation: property.specificLocation || "",
              priceRange: property.priceRange || "",
              lotArea: property.lotArea || "",
              location: property.location || "",
              status: property.status || "",
              developmentType: property.developmentType || "",
              floors: property.floors || "",
              parkingLots: property.parkingLots || "",
              image: null, // New image input
              masterPlan: null, // New masterPlan input
              units: property?.units || [],
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const formData = new FormData();

                // ✅ Ensure all values are included, converting numbers & arrays properly
                Object.entries(values).forEach(([key, value]) => {
                  if (value instanceof File || typeof value === "string") {
                    formData.append(key, value);
                  } else if (typeof value === "number") {
                    formData.append(key, String(value)); // Convert numbers to strings
                  } else if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value)); // Convert arrays to JSON
                  }
                });

                // ✅ Only append image and masterPlan if a new file is uploaded
                if (values.image) {
                  formData.append("image", values.image);
                }
                if (values.masterPlan) {
                  formData.append("masterPlan", values.masterPlan);
                }

         

                // ✅ Dispatch the update action
                const responseAction = await dispatch(
                  updateProperty({ id: property.id, updatedProperty: formData })
                );

                if (updateProperty.fulfilled.match(responseAction)) {
                  fetchData();
                  closeModal();
                }
              } catch (error) {
                showToast("Error updating property.", "error");
              }
              setSubmitting(false);
            }}
          >
            {({ setFieldValue, setFieldTouched, validateField, values }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block font-medium">Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full border rounded-md px-3 py-2"
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
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Specific Location */}
                <div>
                  <label className="block font-medium">Specific Location</label>
                  <Field
                    type="text"
                    name="specificLocation"
                    className="w-full border rounded-md px-3 py-2"
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
                        <input
                          type="checkbox"
                          checked={values.units.includes(unit)} // ✅ Fix: Ensure correct check state
                          onChange={(e) => {
                            const updatedUnits = e.target.checked
                              ? [...values.units, unit]
                              : values.units.filter((u: any) => u !== unit);

                            setFieldValue("units", updatedUnits); // ✅ Ensure Formik updates
                          }}
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
                  <label className="block font-medium">Development Type</label>
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

                {/* Floors Input */}
                <div>
                  <label className="block font-medium">Floors</label>
                  <Field
                    type="number"
                    name="floors"
                    className="w-full border rounded-md px-3 py-2"
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
                  />
                  <ErrorMessage
                    name="parkingLots"
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

                {/* Master Plan Upload */}
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

                {/* Buttons */}
                <div className="col-span-2 flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  );
}
