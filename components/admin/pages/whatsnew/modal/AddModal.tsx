import React, { useState } from "react";
import { showToast } from "@/components/toast";

import { useDispatch } from "react-redux"; // ✅ Import Redux hooks

import { addSeminar } from "@/app/redux/services/seminarService";
import { addMeeting } from "@/app/redux/services/meetingService";
import { addEvent } from "@/app/redux/services/eventService";
import { addClosedDeal } from "@/app/redux/services/closedDealService";
import { addRealEstateNews } from "@/app/redux/services/realestateNewsService";
import { addRealEstateTip } from "@/app/redux/services/realestateTipsService";
import { addOngoingInfrastructure } from "@/app/redux/services/ongoingInfrastructure";
import { addVideo } from "@/app/redux/services/videoService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
  itemType:
    | "seminar"
    | "meeting"
    | "event"
    | "closedDeal"
    | "realEstateNews"
    | "realEstateTips"
    | "ongoingInfrastructure"
    | "video";
}

const AddModal: React.FC<AddModalProps> = ({
  modalOpen,
  closeModal,
  fetchData,
  itemType,
}) => {
  const [newItem, setNewItem] = useState<{
    title: string;
    date: string;
    description?: string;
    image?: File | null;
    location?: string;
    views?: string;
    url?: string;
    file?: File | null;
    thumbnail?: File | null;
    mediaType?: "image" | "video";
  }>({
    title: "",
    date: "",
    description: "",
    image: null,
    location: "",
    views: "0",
    url: "",
    file: null,
    thumbnail: null,
    mediaType: "image",
  });
  const getValidationSchema = (itemType: any) => {
    return Yup.lazy((values) => {
      let schema = Yup.object({
        title: Yup.string().required("Title is required"),
        date: Yup.string().required("Date is required"),
      });

      // ✅ Enforce image requirement for specific types
      if (
        [
          "seminar",
          "meeting",
          "closedDeal",
          "realEstateNews",
          "realEstateTips",
          "ongoingInfrastructure",
        ].includes(itemType)
      ) {
        schema = schema.shape({
          image: Yup.mixed().nullable().required("Image is required"),
          description: Yup.string().required("Description is required"),
        });
      }

      if (itemType === "event") {
        schema = schema.shape({
          description: Yup.string().required("Description is required"),
          mediaType: Yup.string()
            .oneOf(["image", "video"], "Invalid media type")
            .required("Media type is required"),
          image: Yup.mixed()
            .nullable()
            .when("mediaType", {
              is: "image",
              then: (schema) =>
                schema.required(
                  "Image is required for events with media type 'image'"
                ),
            }),
          file: Yup.mixed()
            .nullable()
            .when("mediaType", {
              is: "video",
              then: (schema) =>
                schema.required(
                  "Video file is required for events with media type 'video'"
                ),
            }),
        });
      }
      if (itemType === "video") {
        schema = schema.shape({
          location: Yup.string().required("Location is required for videos"),
          views: Yup.string().required("Views are required for videos"),
          url: Yup.string()
            .url("Invalid URL")
            .required("YouTube URL is required for videos"),
          file: Yup.mixed()
            .nullable()
            .required("Video file is required for videos"),
          thumbnail: Yup.mixed()
            .nullable()
            .required("Thumbnail is required for videos"),
        });
      }

      return schema;
    });
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();

  const getReduxAction = () => {
    switch (itemType) {
      case "seminar":
        return addSeminar;
      case "meeting":
        return addMeeting;
      case "event":
        return addEvent;
      case "closedDeal":
        return addClosedDeal;
      case "realEstateNews":
        return addRealEstateNews;
      case "realEstateTips":
        return addRealEstateTip;
      case "ongoingInfrastructure":
        return addOngoingInfrastructure;
      case "video":
        return addVideo;
      default:
        return null;
    }
  };
  const handleAddItem = async (values: any) => {
    try {
      // Validate the form data
      // await validationSchema.validate(values, { abortEarly: false });

  
      // if (!values.title.trim() || !values.date.trim()) {
      //   showToast("Title and Date are required.", "error");
      //   return;
      // }

      // if (itemType === "video" && !values.url?.trim() && !values.file) {
      //   showToast(
      //     "Please provide a YouTube URL or upload a video file.",
      //     "error"
      //   );
      //   return;
      // }

      // if (itemType === "event" && !values.description?.trim()) {
      //   showToast("Description is required for events.", "error");
      //   return;
      // }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("date", values.date);

      if (itemType === "video") {
        formData.append("location", values.location || "");
        formData.append("views", String(parseInt(values.views || "0", 10)));

        if (values.url) formData.append("url", values.url);
        if (values.file) {
          formData.append("file", values.file);
      
        }
        if (values.thumbnail) formData.append("thumbnail", values.thumbnail);
      } else if (itemType === "event") {
        formData.append("description", values.description || "");
        formData.append("media_type", values.mediaType || "");

        if (values.mediaType === "image" && values.image) {
          formData.append("image", values.image);
        
        }

        if (values.mediaType === "video" && values.file) {
          formData.append("file", values.file);
     
        }
      } else {
        formData.append("description", values.description || "");
        if (values.image) {
          formData.append("image", values.image);
     
        }
      }

      // **Log FormData Contents**


      const reduxAction = getReduxAction();
      if (reduxAction) {
        await dispatch(reduxAction(formData) as any).unwrap();
        fetchData();
        closeModal();
      } else {
        showToast("Invalid item type.", "error");
      }
    } catch (error: any) {
      console.error("Validation Error:", error);

      if (error.inner) {
        error.inner.forEach((err: any) => {
          console.error("❌ Validation Error:", err.path, err.message);
        });
      }
    }
  };

  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          Add {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </h2>

        <Formik
          initialValues={{
            title: "",
            date: "",
            description: "",
            location: "",
            views: "",
            url: "",
            image: null, // ✅ Ensure image starts as null
            file: null,
            thumbnail: null,
            itemType: itemType,
            mediaType: "image",
          }}
          validationSchema={getValidationSchema(itemType)}
          onSubmit={(values, { setSubmitting }) => {
      
            handleAddItem(values);
            setSubmitting(false);
            closeModal();
          }}
        >
          {({
            setFieldValue,
            values,
            isSubmitting,
            errors,
            setTouched,
            setFieldTouched,
            validateField,
          }) => (
            <Form>
              {/* Date */}
              <label className="block text-gray-700 font-medium mb-1">
                Date
              </label>
              <Field
                type="date"
                name="date"
                className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500 text-sm"
              />

              {/* Title */}
              <label className="block text-gray-700 font-medium mb-1">
                Title
              </label>
              <Field
                type="text"
                name="title"
                placeholder="Enter Title"
                className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />

              {/* Event-Specific Fields */}
              {itemType === "event" && (
                <>
                  <label className="block text-gray-700 font-medium mb-1">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Enter Description"
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  {/* Media Type Selection */}
                  <label className="block text-gray-700 font-medium mb-1">
                    Media Type
                  </label>
                  <Field
                    as="select"
                    name="mediaType"
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </Field>
                  <ErrorMessage
                    name="mediaType"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  {values.mediaType === "image" && (
                    <>
                      <label className="block text-gray-700 font-medium mb-1">
                        Upload Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0] || null;
                          setFieldValue("image", file);
                        }}
                        onBlur={() => {
                          setTouched({ image: true }); // ✅ Mark as touched when user leaves
                          validateField("image"); // ✅ Force validation to run
                        }}
                        className="w-full"
                      />
                      <ErrorMessage
                        name="image"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </>
                  )}

                  {/* Video Upload */}
                  {values.mediaType === "video" && (
                    <>
                      <label className="block text-gray-700 font-medium mb-1">
                        Upload Video
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0] || null;
                          setFieldValue("file", file);
                        }}
                        onBlur={() => {
                          setTouched({ file: true }); // ✅ Mark as touched when user leaves
                          validateField("file"); // ✅ Force validation to run
                        }}
                        className="w-full"
                      />
                      <ErrorMessage
                        name="file"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </>
                  )}
                </>
              )}

              {itemType !== "video" && itemType !== "event" && (
                <>
                  <label className="block text-gray-700 font-medium mb-1">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Enter Description"
                    className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
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
                    className="w-full mb-4"
                  />

                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </>
              )}

              {/* Video-Specific Fields */}
              {itemType === "video" && (
                <>
                  {/* Video Location */}
                  <label className="block text-gray-700 font-medium mb-1">
                    Video Location
                  </label>
                  <Field
                    type="text"
                    name="location"
                    placeholder="Enter Video Location"
                    className="w-full border rounded-md px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm mb-4"
                  />

                  {/* Initial Views */}
                  <label className="block text-gray-700 font-medium mb-1">
                    Initial Views
                  </label>
                  <Field
                    type="number"
                    name="views"
                    placeholder="Initial Views"
                    className="w-full border rounded-md px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="views"
                    component="div"
                    className="text-red-500 text-sm mb-4"
                  />

                  {/* YouTube URL */}
                  <label className="block text-gray-700 font-medium mb-1">
                    YouTube URL
                  </label>
                  <Field
                    type="text"
                    name="url"
                    placeholder="Enter YouTube URL"
                    className="w-full border rounded-md px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="url"
                    component="div"
                    className="text-red-500 text-sm mb-4"
                  />

                  {/* Upload Video File */}
                  <label className="block text-gray-700 font-medium mb-1">
                    Upload Video File
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      setFieldValue("file", event.target.files?.[0] || null);
                      setFieldTouched("file", true); // ✅ Ensure validation runs
                    }}
                    className="w-full mb-1"
                  />
                  {errors.file && (
                    <div className="text-red-500 text-sm mb-4">
                      {errors.file}
                    </div>
                  )}

                  {/* Upload Thumbnail */}
                  <label className="block text-gray-700 font-medium mb-1">
                    Upload Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      setFieldValue(
                        "thumbnail",
                        event.target.files?.[0] || null
                      );
                      setFieldTouched("thumbnail", true); // ✅ Ensure validation runs
                    }}
                    className="w-full mb-1"
                  />
                  {errors.thumbnail && (
                    <div className="text-red-500 text-sm mb-4">
                      {errors.thumbnail}
                    </div>
                  )}
                </>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button" // Prevents default form submission
                  onClick={() => handleAddItem(values)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Item
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
