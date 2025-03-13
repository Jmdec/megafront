import React from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/components/toast";
import { addCareer } from "@/app/redux/services/careerService";
import { addTestimonial } from "@/app/redux/services/testimonialService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
  itemType: string;
}

const AddModal: React.FC<AddModalProps> = ({
  modalOpen,
  closeModal,
  fetchData,
  itemType,
}) => {
  const dispatch = useDispatch<any>();

  // ✅ Define validation schema dynamically based on itemType
  const validationSchema = Yup.object().shape({
    roleName:
      itemType === "career"
        ? Yup.string().required("Role Name is required.")
        : Yup.string(),
    quantity:
      itemType === "career"
        ? Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Quantity is required.")
        : Yup.number(),
    name:
      itemType === "testimonial"
        ? Yup.string().required("Name is required.")
        : Yup.string(),
    message:
      itemType === "testimonial"
        ? Yup.string().required("Message is required.")
        : Yup.string(),
  });

  const handleAddItem = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      if (itemType === "career") {
        await dispatch(
          addCareer({ roleName: values.roleName, quantity: values.quantity })
        ).unwrap();
      } else if (itemType === "testimonial") {
        await dispatch(
          addTestimonial({ name: values.name, message: values.message })
        ).unwrap();
      }

      fetchData();
      closeModal();
      resetForm(); // Reset form after successful submission
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
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
            roleName: "",
            quantity: "",
            name: "",
            message: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddItem}
        >
          {({ isSubmitting }) => (
            <Form>
              {itemType === "career" ? (
                <>
                  <label className="block text-gray-700 font-medium mb-1">
                    Role Name
                  </label>
                  <Field
                    type="text"
                    name="roleName"
                    placeholder="Enter Role Name"
                    className="w-full border rounded-md px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="roleName"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />

                  <label className="block text-gray-700 font-medium mb-1">
                    Quantity
                  </label>
                  <Field
                    type="number"
                    name="quantity"
                    placeholder="Enter Role Slot"
                    min="1"
                    className="w-full border rounded-md px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                </>
              ) : itemType === "testimonial" ? (
                <>
                  <label className="block text-gray-700 font-medium mb-1">
                    Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    className="w-full border rounded-md px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />

                  <label className="block text-gray-700 font-medium mb-1">
                    Message
                  </label>
                  <Field
                    as="textarea"
                    name="message"
                    placeholder="Enter Message"
                    className="w-full border rounded-md px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                </>
              ) : null}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save"}
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
