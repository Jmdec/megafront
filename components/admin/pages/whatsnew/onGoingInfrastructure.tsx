import { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";

interface OngoingInfrastructure {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function OngoingInfrastructurePage() {
  const [infrastructures, setInfrastructures] = useState<OngoingInfrastructure[]>([]);
  const [filteredInfrastructures, setFilteredInfrastructures] = useState<OngoingInfrastructure[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInfrastructure, setEditingInfrastructure] = useState<OngoingInfrastructure | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [infrastructureToDelete, setInfrastructureToDelete] = useState<OngoingInfrastructure | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchInfrastructures = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure`);
      const data = await response.json();
      setInfrastructures(data);
      setFilteredInfrastructures(data);
    } catch (error) {
      console.error("Error fetching infrastructures:", error);
    }
  };

  useEffect(() => {
    fetchInfrastructures();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDeleteInfrastructure = async () => {
    if (infrastructureToDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure/${infrastructureToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchInfrastructures();
          showToast("Infrastructure deleted successfully", "success");
        }
      } catch (error) {
        console.error("Error deleting infrastructure:", error);
      }
      setDeleteModalOpen(false);
    }
  };

  const columns = [
    { name: "Title", selector: (row: OngoingInfrastructure) => row.title, sortable: true },
    { name: "Description", selector: (row: OngoingInfrastructure) => row.description, sortable: true },
    { name: "Date", selector: (row: OngoingInfrastructure) => new Date(row.date).toISOString().split('T')[0], sortable: true },
    {
      name: "Image",
      cell: (row: OngoingInfrastructure) => (
        <img src={`${API_BASE_URL}${row.image}`} alt={row.title} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
      ),
      sortable: false,
    },
    {
      name: "Actions",
      right: true,
      cell: (row: OngoingInfrastructure) => (
        <div className="relative">
          <button onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)} className="p-2 rounded-full hover:bg-gray-200">
            <FaEllipsisV />
          </button>
          {openMenu === row.id && (
            <div ref={menuRef} className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50">
              <button onClick={() => { setEditingInfrastructure(row); setIsEditModalOpen(true); setOpenMenu(null); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Edit</button>
              <button onClick={() => { setInfrastructureToDelete(row); setDeleteModalOpen(true); setOpenMenu(null); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Delete</button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg overflow-visible">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Ongoing Infrastructure Management</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Infrastructure</button>
      </div>

      <div className="mb-4">
        <input type="text" placeholder="Search infrastructures..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500" />
      </div>

      <DataTable columns={columns} data={filteredInfrastructures} pagination highlightOnHover striped />

      <AddModal modalOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} fetchData={fetchInfrastructures} itemType="ongoingInfrastructure" />
      {editingInfrastructure && <EditModal modalOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} item={editingInfrastructure} fetchData={fetchInfrastructures} itemType="ongoingInfrastructure" />}

      {deleteModalOpen && infrastructureToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete the infrastructure "{infrastructureToDelete.title}"?</p>
            <div className="flex justify-end gap-1">
              <button onClick={handleDeleteInfrastructure} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Confirm</button>
              <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}