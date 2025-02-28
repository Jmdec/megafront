"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/toast";
interface Status {
  id: number;
  name: string;
}

export default function StatusPage() {
  const [status, setStatus] = useState<Status[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<Status[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status`);
      const data = await response.json();
      setStatus(data);
      setFilteredStatus(data);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Handle modal open/close
  const openModal = (status?: Status) => {
    setEditingStatus(status || null);
    setNewStatus(status?.name || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewStatus("");
    setEditingStatus(null);
  };

  // Add or Update status
  const handleSaveStatus = async () => {
    if (!newStatus.trim()) return;

    const url = editingStatus
      ? `${API_BASE_URL}/api/status/${editingStatus.id}`
      : `${API_BASE_URL}/api/status`;

    const method = editingStatus ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStatus }),
      });

      if (response.ok) {
        if (method==="PUT"){
   showToast("Status updated successfully", "success")
        } else if (method==="POST"){
   showToast("Status added successfully", "success")
        }
    
        closeModal();
        fetchStatus();
      }
    } catch (error) {
      console.error("Error saving status:", error);
    }
  };

  // Delete status
  const deleteStatus = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchStatus();
        showToast("Status deleted successfully", "success")
      }
    } catch (error) {
      console.error("Error deleting status:", error);
    }
  };

  // Search filter logic
  useEffect(() => {
    const filtered = status.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStatus(filtered);
  }, [searchTerm, status]);

  // Define DataTable columns
  const columns = [

    {
      name: "Status",
      selector: (row: Status) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      right: true,
      cell: (row: Status) => (
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
                  deleteStatus(row.id);
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
        <h1 className="text-2xl font-semibold">Status Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Status
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
<DataTable
  columns={columns}
  data={filteredStatus}
  pagination
  highlightOnHover
  striped

/>


      {/* Status Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingStatus ? "Edit Status" : "Add Status"}
            </h2>
            <input
              type="text"
              placeholder="Enter status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
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
                onClick={handleSaveStatus}
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
