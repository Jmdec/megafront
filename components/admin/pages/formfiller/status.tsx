"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

interface Status {
  id: number;
  name: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function StatusPage() {
  const [status, setStatus] = useState<Status[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
    console.log(process.env.NEXT_PUBLIC_SERVER_PORT)
  // Fetch status
  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status`);
      const data = await response.json();
  
      setStatus(data);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

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
      }
    } catch (error) {
      console.error("Error deleting status:", error);
    }
  };

  // Fetch status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  // Define DataTable columns
  const columns = [
    {
      name: "ID",
      selector: (row: Status) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Status",
      selector: (row: Status) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Status) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(row)}
            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => deleteStatus(row.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">Status Management</h1>

      {/* Add Status Button */}
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
      >
        Add Status
      </button>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={status}
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
