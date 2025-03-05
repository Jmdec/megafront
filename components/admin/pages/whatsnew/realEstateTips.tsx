import { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";

interface RealEstateTip {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function RealEstateTipsPage() {
  const [tips, setTips] = useState<RealEstateTip[]>([]);
  const [filteredTips, setFilteredTips] = useState<RealEstateTip[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<RealEstateTip | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tipToDelete, setTipToDelete] = useState<RealEstateTip | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchTips = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateTips`);
      const data = await response.json();
      setTips(data);
      setFilteredTips(data);
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  useEffect(() => {
    fetchTips();
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

  const handleDeleteTip = async () => {
    if (tipToDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/realEstateTips/${tipToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchTips();
          showToast("Tip deleted successfully", "success");
        }
      } catch (error) {
        console.error("Error deleting tip:", error);
      }
      setDeleteModalOpen(false);
    }
  };

  const columns = [
    { name: "Title", selector: (row: RealEstateTip) => row.title, sortable: true },
    { name: "Description", selector: (row: RealEstateTip) => row.description, sortable: true },
    { name: "Date", selector: (row: RealEstateTip) => new Date(row.date).toISOString().split('T')[0], sortable: true },
    {
      name: "Image",
      cell: (row: RealEstateTip) => (
        <img src={`${API_BASE_URL}${row.image}`} alt={row.title} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
      ),
      sortable: false,
    },
    {
      name: "Actions",
      right: true,
      cell: (row: RealEstateTip) => (
        <div className="relative">
          <button onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)} className="p-2 rounded-full hover:bg-gray-200">
            <FaEllipsisV />
          </button>
          {openMenu === row.id && (
            <div ref={menuRef} className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50">
              <button onClick={() => { setEditingTip(row); setIsEditModalOpen(true); setOpenMenu(null); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Edit</button>
              <button onClick={() => { setTipToDelete(row); setDeleteModalOpen(true); setOpenMenu(null); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Delete</button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg overflow-visible">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Real Estate Tips Management</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Tips</button>
      </div>

      <div className="mb-4">
        <input type="text" placeholder="Search tips..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500" />
      </div>

      <DataTable columns={columns} data={filteredTips} pagination highlightOnHover striped />

      <AddModal modalOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} fetchData={fetchTips} itemType="realEstateTips" />
      {editingTip && <EditModal modalOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} item={editingTip} fetchData={fetchTips} itemType="realEstateTips" />}

      {deleteModalOpen && tipToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete the tip "{tipToDelete.title}"?</p>
            <div className="flex justify-end gap-1">
              <button onClick={handleDeleteTip} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Confirm</button>
              <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
