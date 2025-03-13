import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAgent } from "@/app/redux/services/agentService";
import { RootState } from "@/app/redux/store";
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
  const dispatch = useDispatch<any>();
  const loading = useSelector((state: RootState) => state.agentData.loading);

  const initialValues = {
    name: "",
    role: "",
    image: null,
    description: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    certificates: null,
    gallery: null,
  };

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
    image: Yup.mixed().required("Image is required"),
    certificates: Yup.mixed().required("Certificate is required"),
    gallery: Yup.mixed().required("Gallery is required"),
  });

  const handleAddAgent = async (values: any) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (value instanceof FileList) {
          Array.from(value).forEach((file) =>
            formData.append(`${key}[]`, file)
          );
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    try {
      await dispatch(addAgent(formData)).unwrap();
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error adding agent:", error);
    }
  };

  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Add Agent</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAddAgent}
        >
          {({ setFieldValue, setFieldTouched, validateField }) => (
            <Form>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label>Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full border rounded-md px-3 py-2 mb-2"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <label>Role</label>
                  <Field
                    as="select"
                    name="role"
                    className="w-full border rounded-md px-3 py-2 mb-2"
                  >
                    <option value="">Select Role</option>
                    <option value="Real Estate Agent">Real Estate Agent</option>
                    <option value="Marketing Specialist">
                      Marketing Specialist
                    </option>
                    <option value="Property Manager">Property Manager</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <label>Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="w-full border rounded-md px-3 py-2 mb-2"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label>Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full border rounded-md px-3 py-2 mb-2"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <label>Phone</label>
                  <Field
                    type="text"
                    name="phone"
                    className="w-full border rounded-md px-3 py-2 mb-2"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <label>Facebook</label>
                  <Field
                    type="text"
                    name="facebook"
                    className="w-full border rounded-md px-3 py-2 mb-2"
                  />
                  <ErrorMessage
                    name="facebook"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <label>Instagram</label>
                  <Field
                    type="text"
                    name="instagram"
                    className="w-full border rounded-md px-3 py-2 mb-2"
                  />
                  <ErrorMessage
                    name="instagram"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setFieldValue("image", file);
                      setFieldTouched("image", true);
                      validateField("image");
                    }}
                    onBlur={() => {
                      setFieldTouched("image", true);
                      validateField("image");
                    }}
                    className="w-full mb-4"
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label>Certificates</label>
                  <input
                    type="file"
                    multiple
                    onChange={(event) => {
                      setFieldValue("certificates", event.target.files);
                      setFieldTouched("certificates", true);
                      validateField("certificates");
                    }}
                    onBlur={() => {
                      setFieldTouched("certificates", true);
                      validateField("certificates");
                    }}
                    className="w-full mb-4"
                  />
                  <ErrorMessage
                    name="certificates"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label>Gallery</label>
                  <input
                    type="file"
                    multiple
                    onChange={(event) => {
                      setFieldValue("gallery", event.target.files);
                      setFieldTouched("gallery", true);
                      validateField("gallery");
                    }}
                    onBlur={() => {
                      setFieldTouched("gallery", true);
                      validateField("gallery");
                    }}
                    className="w-full mb-4"
                  />
                  <ErrorMessage
                    name="gallery"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
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
