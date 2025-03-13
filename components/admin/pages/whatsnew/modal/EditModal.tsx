import React, { useState, useEffect } from "react";
import { showToast } from "@/components/toast";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { updateSeminar } from "@/app/redux/services/seminarService";
import { updateMeeting } from "@/app/redux/services/meetingService";
import { updateEvent } from "@/app/redux/services/eventService";
import { updateClosedDeal } from "@/app/redux/services/closedDealService";
import { updateRealEstateNews } from "@/app/redux/services/realestateNewsService";
import { updateRealEstateTip } from "@/app/redux/services/realestateTipsService";
import { updateOngoingInfrastructure } from "@/app/redux/services/ongoingInfrastructure";
import { updateVideo } from "@/app/redux/services/videoService";

interface EditItemModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  item: any | null;
  fetchData: () => void;
  itemType: string;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  modalOpen,
  closeModal,
  item,
  fetchData,
  itemType,
}) => {
  const dispatch = useDispatch();
  const [editedItem, setEditedItem] = useState<any | null>(item);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
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
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split(" ")[0]; // Extracts only the "YYYY-MM-DD" part
  };
  useEffect(() => {
    setEditedItem(item);
  }, [item]);
  const handleSave = async (values: any) => {
    if (!values?.title.trim() || !values?.date.trim()) {
      showToast("Title and Date are required.", "error");
      return;
    }

    const formData = new FormData();

    // Preserve previous values if not changed
    formData.append(
      "title",
      values.title !== editedItem.title ? values.title : editedItem.title
    );
    formData.append(
      "date",
      values.date !== editedItem.date ? values.date : editedItem.date
    );
    formData.append(
      "description",
      values.description !== editedItem.description
        ? values.description
        : editedItem.description || ""
    );

    if (itemType === "video") {
      formData.append(
        "location",
        values.location !== editedItem.location
          ? values.location
          : editedItem.location || ""
      );
      formData.append("views", String(parseInt(values.views || "0", 10)));
      formData.append(
        "url",
        values.url !== editedItem.url ? values.url : editedItem.url || ""
      );

      if (values.file instanceof File) {
        formData.append("file", values.file);
      }

      if (values.thumbnail instanceof File) {
        formData.append("thumbnail", values.thumbnail);
      }
    } else if (itemType === "event") {
      formData.append(
        "media_type",
        values.mediaType !== editedItem.mediaType
          ? values.mediaType
          : editedItem.mediaType || ""
      );

      if (values.mediaType === "image" && values.image instanceof File) {
        formData.append("image", values.image);
      } else if (values.file instanceof File) {
        formData.append("file", values.file);
      }
    } else {
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
    }

    console.log(
      "Sending FormData:",
      [...formData.entries()].map(([key, value]) => [
        key,
        value instanceof File ? value.name : value,
      ])
    );

    try {
      let updateAction;
      switch (itemType) {
        case "seminar":
          updateAction = updateSeminar({
            id: editedItem.id,
            updatedSeminar: formData,
          });
          break;
        case "meeting":
          updateAction = updateMeeting({
            id: editedItem.id,
            updatedMeeting: formData,
          });
          break;
        case "event":
          updateAction = updateEvent({
            id: editedItem.id,
            updatedEvent: formData,
          });
          break;
        case "closedDeal":
          updateAction = updateClosedDeal({
            id: editedItem.id,
            updatedClosedDeal: formData,
          });
          break;
        case "realEstateNews":
          updateAction = updateRealEstateNews({
            id: editedItem.id,
            updatedNews: formData,
          });
          break;
        case "realEstateTips":
          updateAction = updateRealEstateTip({
            id: editedItem.id,
            updatedTip: formData,
          });
          break;
        case "ongoingInfrastructure":
          updateAction = updateOngoingInfrastructure({
            id: editedItem.id,
            updatedProject: formData,
          });
          break;
        case "video":
          updateAction = updateVideo({
            id: editedItem.id,
            updatedVideo: formData,
          });
          break;
        default:
          showToast("Invalid item type.", "error");
          return;
      }

      await dispatch(updateAction as any).unwrap();
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  return modalOpen && editedItem ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">
          Edit {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </h2>

        <Formik
          initialValues={{
            ...editedItem,
            date: formatDate(editedItem.date), // Format the date properly
          }}
          onSubmit={handleSave}
          validationSchema={getValidationSchema(itemType)}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="mb-4">
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter Title"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <Field
                  type="date"
                  name="date"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {itemType === "event" && (
                <>
                  <div className="mb-4">
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
                  </div>

                  <label className="block text-gray-700 font-medium mb-1">
                    Media Type
                  </label>
                  <Field
                    as="select"
                    name="mediaType"
                    className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </Field>

                  {values.mediaType === "image" && (
                    <>
                      <label className="block text-gray-700 font-medium mb-1">
                        Upload Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFieldValue("image", e.target.files?.[0] || null)
                        }
                        className="w-full mb-4"
                      />
                      <ErrorMessage
                        name="image"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </>
                  )}

                  {values.mediaType === "video" && (
                    <>
                      <label className="block text-gray-700 font-medium mb-1">
                        Upload Video File
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setFieldValue("file", e.target.files?.[0] || null)
                        }
                        className="w-full mb-4"
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
                  <div className="mb-4">
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
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFieldValue("image", e.target.files?.[0] || null)
                    }
                    className="w-full mb-4"
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </>
              )}

              {itemType === "video" && (
                <>
                  <Field
                    type="text"
                    name="location"
                    placeholder="Enter Video Location"
                    className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <Field
                    type="number"
                    name="views"
                    placeholder="Initial Views"
                    className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="views"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <Field
                    type="text"
                    name="url"
                    placeholder="Enter YouTube URL"
                    className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="url"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setFieldValue("file", e.target.files?.[0] || null)
                    }
                    className="w-full mb-4"
                  />
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFieldValue("thumbnail", e.target.files?.[0] || null)
                    }
                    className="w-full mb-4"
                  />
                  <ErrorMessage
                    name="thumbnail"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </>
              )}

              <div className="flex justify-end gap-2">
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

export default EditItemModal;
