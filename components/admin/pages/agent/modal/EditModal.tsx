import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { showToast } from "@/components/toast";
import { updateAgent } from "@/app/redux/services/agentService";

interface EditModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  agent: Agent;
  fetchData: () => void;
}

interface Agent {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  email: string;
  phone: string;
  sociallinks: {
    facebook?: string;
    instagram?: string;
  };
  certificates: string[];
  gallery: string[];
}

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Agent Name is required"),
  role: Yup.string().required("Role is required"),
  description: Yup.string().trim().required("Description is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  facebook: Yup.string()
    .url("Invalid URL format")
    .required("Facebook is required"),
  instagram: Yup.string()
    .url("Invalid URL format")
    .required("Instagram is required"),
  // image: Yup.mixed().required("Image is required"),
  // certificates: Yup.mixed().required("Certificate is required"),
  // gallery: Yup.mixed().required("Gallery is required"),
});

export default function EditModal({
  modalOpen,
  closeModal,
  agent,
  fetchData,
}: EditModalProps) {
  const dispatch = useDispatch<any>();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [imagePreview, setImagePreview] = useState<string | null>(
    agent.image ? `${API_BASE_URL}${agent.image}` : null
  );
  const [certPreviews, setCertPreviews] = useState<string[]>(
    agent.certificates.map((cert) => `${API_BASE_URL}${cert}`)
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    agent.gallery.map((photo) => `${API_BASE_URL}${photo}`)
  );
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Edit Agent</h2>

        <Formik
          initialValues={{
            name: agent.name || "",
            role: agent.role || "",
            description: agent.description || "",
            email: agent.email || "",
            phone: agent.phone || "",
            facebook: agent.sociallinks?.facebook || "",
            instagram: agent.sociallinks?.instagram || "",
            image: null as File | null,
            certificates: null as FileList | null,
            gallery: null as FileList | null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData();
            console.log(values);
            formData.append("name", values.name);
            formData.append("role", values.role);
            formData.append("description", values.description);
            formData.append("email", values.email);
            formData.append("phone", values.phone);
            formData.append("facebook", values.facebook);
            formData.append("instagram", values.instagram);

            if (values.image) {
              formData.append("image", values.image);
            }
            if (values.certificates) {
              Array.from(values.certificates).forEach((file, index) => {
                formData.append(`certificates[${index}]`, file);
              });
            }
            if (values.gallery) {
              Array.from(values.gallery).forEach((file, index) => {
                formData.append(`gallery[${index}]`, file);
              });
            }

            try {
              await dispatch(
                updateAgent({ id: agent.id, updatedAgent: formData })
              ).unwrap();
              fetchData();
              closeModal();
            } catch (error: any) {
              showToast(error.message || "Failed to update agent", "error");
            }

            setSubmitting(false);
          }}
        >
          {({ setFieldValue, setFieldTouched, validateField, values }) => (
            <Form className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Name */}
                <label className="block font-medium">Name:</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Role */}
                <label className="block font-medium">Role:</label>
                <Field
                  type="text"
                  name="role"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Description */}
                <label className="block font-medium">Description:</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Email */}
                <label className="block font-medium">Email:</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Phone */}
                <label className="block font-medium">Phone:</label>
                <Field
                  type="text"
                  name="phone"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Facebook URL */}
                <label className="block font-medium">Facebook URL:</label>
                <Field
                  type="text"
                  name="facebook"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="facebook"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Instagram URL */}
                <label className="block font-medium">Instagram URL:</label>
                <Field
                  type="text"
                  name="instagram"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="instagram"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <label className="block font-medium">Profile Image:</label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      setFieldValue("image", file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                    setFieldTouched("image", true);
                    validateField("image");
                  }}
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Certificates Upload */}
                <label className="block font-medium">Certificates:</label>
                <div className="grid grid-cols-2 gap-2">
                  {certPreviews.map((cert, index) => (
                    <img
                      key={index}
                      src={cert}
                      alt="Certificate Preview"
                      className="w-full h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setFieldValue("certificates", e.target.files);
                      setCertPreviews(
                        Array.from(e.target.files).map((file) =>
                          URL.createObjectURL(file)
                        )
                      );
                    }
                    setFieldTouched("certificates", true);
                    validateField("certificates");
                  }}
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="certificates"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Gallery Upload */}
                <label className="block font-medium">Gallery:</label>
                <div className="grid grid-cols-2 gap-2">
                  {galleryPreviews.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt="Gallery Preview"
                      className="w-full h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setFieldValue("gallery", e.target.files);
                      setGalleryPreviews(
                        Array.from(e.target.files).map((file) =>
                          URL.createObjectURL(file)
                        )
                      );
                    }
                    setFieldTouched("gallery", true);
                    validateField("gallery");
                  }}
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="gallery"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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
  );
}
