"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import {
  fetchLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} from "@/app/redux/services/locationService";
import { showToast } from "@/components/toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
export default function LocationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { locations, loading } = useSelector(
    (state: RootState) => state.locationData
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  // Handle modal open/close
  const openModal = (location?: any) => {
    setEditingLocation(location || null);
    setNewLocation(location?.name || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewLocation("");
    setEditingLocation(null);
  };

  // Add or Update location using Redux
  const handleSaveLocation = () => {
    if (!newLocation.trim()) return;
    if (editingLocation) {
      dispatch(updateLocation({ id: editingLocation.id, name: newLocation }));
    } else {
      dispatch(addLocation(newLocation));
    }
    closeModal();
  };

  // Delete location using Redux
  const handleDeleteLocation = (id: number) => {
    dispatch(deleteLocation(id));
  };

  // Search filter logic
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define DataTable columns
  const columns = [
    {
      name: "Location",
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      right: true,
      cell: (row: any) => (
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaEllipsisV />
          </button>

          {openMenu === row.id && (
            <div className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50">
              <button
                onClick={() => {
                  openModal(row);
                  setOpenMenu(null);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDeleteLocation(row.id);
                  setOpenMenu(null);
                }}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg overflow-visible">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Location Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Location
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
      {loading ? (
        <p>Loading locations...</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredLocations}
          pagination
          highlightOnHover
          striped
        />
      )}

      {/* Location Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingLocation ? "Edit Location" : "Add Location"}
            </h2>

            <Formik
              initialValues={{
                name: editingLocation ? editingLocation.name : "",
              }}
              validationSchema={Yup.object({
                name: Yup.string()
                  .trim()
                  .required("Location name is required")
                  .min(4, "Location name must be at least 4 characters"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                if (editingLocation) {
                  dispatch(
                    updateLocation({
                      id: editingLocation.id,
                      name: values.name,
                    })
                  );
                } else {
                  dispatch(addLocation(values.name));
                }
                setSubmitting(false);
                closeModal();
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter location"
                    className="w-full border rounded-md px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
