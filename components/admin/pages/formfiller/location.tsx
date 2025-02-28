"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/toast";

interface Location {
  id: number;
  name: string;
}

export default function LocationPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location`);
      const data = await response.json();
      setLocations(data);
      setFilteredLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle modal open/close
  const openModal = (location?: Location) => {
    setEditingLocation(location || null);
    setNewLocation(location?.name || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewLocation("");
    setEditingLocation(null);
  };

  // Add or Update location
  const handleSaveLocation = async () => {
    if (!newLocation.trim()) return;

    const url = editingLocation
      ? `${API_BASE_URL}/api/location/${editingLocation.id}`
      : `${API_BASE_URL}/api/location`;

    const method = editingLocation ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLocation }),
      });

      if (response.ok) {
        if (method === "PUT") {
          showToast("Location updated successfully", "success");
        } else if (method === "POST") {
          showToast("Location added successfully", "success");
        }

        closeModal();
        fetchLocations();
      }
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  // Delete location
  const deleteLocation = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchLocations();
        showToast("Location deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  // Search filter logic
  useEffect(() => {
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchTerm, locations]);

  // Define DataTable columns
  const columns = [
    {
      name: "Location",
      selector: (row: Location) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      right: true,
      cell: (row: Location) => (
        <div className="relative">
          <button
            onClick={() =>
              setOpenMenu(openMenu === row.id ? null : row.id)
            }
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
                  deleteLocation(row.id);
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
      <DataTable
        columns={columns}
        data={filteredLocations}
        pagination
        highlightOnHover
        striped
      />

      {/* Location Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingLocation ? "Edit Location" : "Add Location"}
            </h2>
            <input
              type="text"
              placeholder="Enter location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
