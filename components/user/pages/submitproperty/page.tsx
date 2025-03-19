"use client";
import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { addClientProperty } from "@/app/redux/services/clientpropertyService";
import { FaImage } from "react-icons/fa";

interface FormValues {
  last_name: string;
  first_name: string;
  email: string;
  number: string;
  property_name: string;
  development_type: string;
  unit_type: string[];
  price: string;
  location: string;
  status: string;
  images: FileList | null;
}

const SetAppointment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.clientpropertyData
  );

  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<string>("");

  const initialValues: FormValues = {
    last_name: "",
    first_name: "",
    email: "",
    number: "",
    property_name: "",
    unit_type: [],
    price: "",
    location: "",
    images: null,
    status: "Pending",
    development_type: "",
  };

  const validationSchema = Yup.object({
    last_name: Yup.string().required("Last name is required"),
    first_name: Yup.string().required("First name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    number: Yup.string()
      .matches(/^\d{11}$/, "Phone number must be 11 digits")
      .required("Phone number is required"),
    property_name: Yup.string().required("Property name is required"),

    // ✅ Conditionally require unit_type based on development_type
    unit_type: Yup.array()
      .of(Yup.string())
      .when("development_type", {
        is: (devType: string) =>
          [
            "High Rise Condominium",
            "Mid Rise Condominium",
            "Low Rise Condominium",
          ].includes(devType),
        then: (schema) =>
          schema.min(1, "At least one unit type must be selected"),
        otherwise: (schema) => schema.notRequired(),
      }),

    price: Yup.string()
      .required("Price is required")
      .min(0, "Price must be at least 0"),
    location: Yup.string().required("Location is required"),
    images: Yup.mixed().test(
      "fileSize",
      "Each file must be smaller than 2MB",
      (value) => {
        if (value) {
          const files = Array.from(value as FileList);
          return files.every((file) => file.size <= 2048 * 1024);
        }
        return true;
      }
    ),
  });
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "unit_type" && Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach((unit) => formData.append("unit_type[]", unit));
        }
      } else if (key === "images" && value) {
        Array.from(value as FileList).forEach((file) => {
          formData.append("images[]", file);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    // ✅ Ensure status is explicitly added
    if (!formData.has("status")) {
      formData.append("status", initialValues.status);
    }



    try {
      await dispatch(addClientProperty(formData)).unwrap();
      setMessageType("success");
      resetForm();
      setImagesPreview([]);
    } catch (error) {
      console.error("Error submitting property:", error);
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const files = event.currentTarget.files;
    if (files) {
      const fileArray = Array.from(files);
      setFieldValue("images", fileArray);

      // Generate image previews
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagesPreview(previews);
    }
  };

  const removeImage = (
    index: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));

    setFieldValue("images", (prevImages: FileList | null) => {
      if (!prevImages) return null;

      // Use DataTransfer to create a new FileList
      const dataTransfer = new DataTransfer();
      Array.from(prevImages)
        .filter((_, i) => i !== index)
        .forEach((file) => dataTransfer.items.add(file));

      return dataTransfer.files;
    });
  };

  return (
    <div className="bg-white">
      <div className="flex flex-wrap mt-4 justify-center">
        {/* Left Column (Data Privacy Reminder) */}
        <div className="w-full sm:w-2/4 md:w-1/3 lg:w-1/3 p-8 bg-white border border-customBlue my-6 mx-auto lg:h-[967px] flex flex-col">
          <h2 className="font-thin text-2xl text-customBlue mb-6 text-center">
            Data Privacy Reminder
          </h2>
          <p className="text-lg text-gray-600 mb-4 indent-10 text-justify leading-10 ">
            By submitting your property information, you agree that the data
            provided will be used solely for the purposes of managing property
            listings and related communications.
          </p>
          <p className="text-lg text-gray-600 mb-4 indent-10 text-justify leading-10">
            Your personal details such as name, contact number, and email will
            be kept confidential and will not be shared with any third parties
            without your consent.
          </p>
          <p className="text-lg text-gray-600 mb-4 indent-10 text-justify leading-10">
            Please ensure that the information you provide is accurate and does
            not contain any sensitive personal details unless absolutely
            necessary.
          </p>
          <p className="text-lg text-gray-600 mb-4 indent-10 text-justify leading-10">
            You may review our Privacy Policy for more information on how we
            handle your data.
          </p>
        </div>

        <div className="lg:w-2/3 w-full p-4 lg:h-[967px] flex flex-col">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="bg-white p-6 rounded-lg shadow-md space-y-4 flex-grow">
                <div className="text-center mb-2 mt-4">
                  <h1 className="text-4xl font-semibold text-black">
                    Submit Property
                  </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Last Name</label>
                    <Field
                      type="text"
                      name="last_name"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-gray-700">First Name</label>
                    <Field
                      type="text"
                      name="first_name"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <Field
                      type="text"
                      name="number"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <ErrorMessage
                      name="number"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700">Property Name</label>
                  <Field
                    type="text"
                    name="property_name"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="property_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Price</label>
                  <Field
                    type="text"
                    name="price"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Location</label>
                  <Field
                    type="text"
                    name="location"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    Development Type
                  </label>
                  <Field
                    as="select"
                    name="development_type"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const selectedValue = e.target.value;
                      setFieldValue("development_type", selectedValue);

                      // Reset unit_type if a condominium type is selected
                      if (
                        [
                          "High Rise Condominium",
                          "Mid Rise Condominium",
                          "Low Rise Condominium",
                        ].includes(selectedValue)
                      ) {
                        setFieldValue("unit_type", []);
                      }
                    }}
                  >
                    <option value="">Select type</option>
                    <option value="High Rise Condominium">
                      High Rise Condominium
                    </option>
                    <option value="Mid Rise Condominium">
                      Mid Rise Condominium
                    </option>
                    <option value="Low Rise Condominium">
                      Low Rise Condominium
                    </option>
                    <option value="Office">Office</option>
                  </Field>
                  <ErrorMessage
                    name="development_type"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Unit Type (Checkbox) - Only for Condominiums */}
                {[
                  "High Rise Condominium",
                  "Mid Rise Condominium",
                  "Low Rise Condominium",
                ].includes(values.development_type) && (
                  <div>
                    <label className="block text-gray-700">Unit Type</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {["1BR", "2BR", "3BR", "Studio"].map((unit) => (
                        <label key={unit} className="flex items-center">
                          <Field
                            type="checkbox"
                            name="unit_type"
                            value={unit}
                            className="mr-2"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const checked = e.target.checked;
                              let newValues = [...values.unit_type];

                              if (checked) {
                                newValues.push(unit);
                              } else {
                                newValues = newValues.filter(
                                  (val) => val !== unit
                                );
                              }
                              setFieldValue("unit_type", newValues);
                            }}
                          />
                          {unit}
                        </label>
                      ))}
                      {/* Select All */}
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFieldValue(
                              "unit_type",
                              e.target.checked
                                ? ["1BR", "2BR", "3BR", "Studio"]
                                : []
                            );
                          }}
                        />
                        Select All
                      </label>
                    </div>
                    <ErrorMessage
                      name="unit_type"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700">Upload Images</label>

                  {/* Choose File Button */}
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                    onChange={(event) =>
                      handleImageChange(event, setFieldValue)
                    }
                  />

                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />

                  {/* Preview Images with Close Button */}
                  {imagesPreview.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {imagesPreview.map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-36 h-36 bg-gray-200 rounded-md overflow-hidden"
                        >
                          {/* Close Button */}
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs"
                            onClick={() => removeImage(index, setFieldValue)}
                          >
                            ✕
                          </button>

                          {/* Image Preview */}
                          <img
                            src={preview}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
                  >
                    Submit Property
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SetAppointment;
