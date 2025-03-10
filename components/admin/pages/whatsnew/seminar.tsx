"use client";

import { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/toast";
import EditModal from "./modal/EditModal"; 
import AddModal from "./modal/AddModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchSeminars, deleteSeminar } from "@/app/redux/services/seminarService";
interface Seminar {
  id: number;
  title: string;
  description: string;
  image: File | string | null;
  date: string;
}

export default function SeminarPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { seminars, loading } = useSelector((state: RootState) => state.seminarsData);

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<Seminar | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [seminarToDelete, setSeminarToDelete] = useState<Seminar | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch seminars using Redux
  useEffect(() => {
    dispatch(fetchSeminars());
  }, [dispatch]);

  // ✅ Filter seminars based on search input
  const filteredSeminars = seminars.filter((seminar) =>
    seminar.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle seminar deletion
  const handleDeleteSeminar = async () => {
    if (seminarToDelete) {
      await dispatch(deleteSeminar(seminarToDelete.id));
      setDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      name: "Title",
      selector: (row: Seminar) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: Seminar) => row.description,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: Seminar) => new Date(row.date).toISOString().split("T")[0],
      sortable: true,
    },
    {
      name: "Image",
      cell: (row: Seminar) => (
        <img
          src={row.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${row.image}` : "/placeholder.png"}
          alt={row.title}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
      sortable: false,
    },
    {
      name: "Actions",
      right: true,
      cell: (row: Seminar) => (
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaEllipsisV />
          </button>

          {openMenu === row.id && (
            <div
              ref={menuRef}
              className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50"
            >
              <button
                onClick={() => setEditingSeminar(row)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSeminarToDelete(row);
                  setDeleteModalOpen(true);
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Seminar Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Seminar
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search seminar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p>Loading seminars...</p>
      ) : (
        <DataTable columns={columns} data={filteredSeminars} pagination highlightOnHover striped />
      )}

      <AddModal
        modalOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        fetchData={() => dispatch(fetchSeminars())}
        itemType="seminar"
      />

      {editingSeminar && (
        <EditModal
          modalOpen={true}
          closeModal={() => setEditingSeminar(null)}
          item={editingSeminar}
          fetchData={() => dispatch(fetchSeminars())}
          itemType="seminar"
        />
      )}

      {deleteModalOpen && seminarToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete the seminar "{seminarToDelete.title}"?</p>
            <div className="flex justify-end gap-1">
              <button
                onClick={handleDeleteSeminar}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
