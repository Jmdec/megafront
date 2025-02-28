"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/toast";

interface DevelopmentType {
  id: number;
  name: string;
}

export default function DevelopmentTypePage() {
  const [developmentTypes, setDevelopmentTypes] = useState<DevelopmentType[]>([]);
  const [filteredDevelopmentTypes, setFilteredDevelopmentTypes] = useState<DevelopmentType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newDevelopmentType, setNewDevelopmentType] = useState("");
  const [editingDevelopmentType, setEditingDevelopmentType] = useState<DevelopmentType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchDevelopmentTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/developmenttype`);
      const data = await response.json();
      setDevelopmentTypes(data);
      setFilteredDevelopmentTypes(data);
    } catch (error) {
      console.error("Error fetching development types:", error);
    }
  };

  useEffect(() => {
    fetchDevelopmentTypes();
  }, []);

  // Handle modal open/close
  const openModal = (developmentType?: DevelopmentType) => {
    setEditingDevelopmentType(developmentType || null);
    setNewDevelopmentType(developmentType?.name || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewDevelopmentType("");
    setEditingDevelopmentType(null);
  };

  // Add or Update development type
  const handleSaveDevelopmentType = async () => {
    if (!newDevelopmentType.trim()) return;

    const url = editingDevelopmentType
      ? `${API_BASE_URL}/api/developmenttype/${editingDevelopmentType.id}`
      : `${API_BASE_URL}/api/developmenttype`;

    const method = editingDevelopmentType ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDevelopmentType }),
      });

      if (response.ok) {
        if (method === "PUT") {
          showToast("Development type updated successfully", "success");
        } else if (method === "POST") {
          showToast("Development type added successfully", "success");
        }

        closeModal();
        fetchDevelopmentTypes();
      }
    } catch (error) {
      console.error("Error saving development type:", error);
    }
  };

  // Delete development type
  const deleteDevelopmentType = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/developmenttype/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDevelopmentTypes();
        showToast("Development type deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting development type:", error);
    }
  };

  // Search filter logic
  useEffect(() => {
    const filtered = developmentTypes.filter((type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevelopmentTypes(filtered);
  }, [searchTerm, developmentTypes]);

  // Define DataTable columns
  const columns = [
    {
      name: "Development Type",
      selector: (row: DevelopmentType) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      right: true,
      cell: (row: DevelopmentType) => (
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
                  deleteDevelopmentType(row.id);
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
        <h1 className="text-2xl font-semibold">Development Type Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Development Type
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search development type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredDevelopmentTypes}
        pagination
        highlightOnHover
        striped
      />

      {/* Development Type Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingDevelopmentType ? "Edit Development Type" : "Add Development Type"}
            </h2>
            <input
              type="text"
              placeholder="Enter development type"
              value={newDevelopmentType}
              onChange={(e) => setNewDevelopmentType(e.target.value)}
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
                onClick={handleSaveDevelopmentType}
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
