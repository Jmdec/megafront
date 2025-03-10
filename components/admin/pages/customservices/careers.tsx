import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";
import { FaEllipsisV } from "react-icons/fa";
import { RootState } from "@/app/redux/store"; // Import RootState type
import { fetchCareers, deleteCareer } from "@/app/redux/services/careerService";

export default function CareerPage() {
  const dispatch = useDispatch<any>();
  const { careers, loading } = useSelector((state: RootState) => state.careerData);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<any | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<any | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCareers());
  }, [dispatch]);

  const handleDeleteCareer = async () => {
    if (careerToDelete) {
      try {
        await dispatch(deleteCareer(careerToDelete.id)).unwrap();
        showToast("Career deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting career:", error);
        showToast("Failed to delete career", "error");
      }
      setDeleteModalOpen(false);
    }
  };

  const columns = [
    { name: "Role Name", selector: (row: any) => row.roleName, sortable: true },
    { name: "Quantity", selector: (row: any) => row.quantity, sortable: true },
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
                  setEditingCareer(row);
                  setIsEditModalOpen(true);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setCareerToDelete(row);
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
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Career Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Career
        </button>
      </div>

      <DataTable columns={columns} data={careers} pagination highlightOnHover striped />

      <AddModal modalOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} fetchData={fetchCareers} itemType="career" />
      {editingCareer && (
        <EditModal modalOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} item={editingCareer} fetchData={fetchCareers} itemType="career" />
      )}


      {deleteModalOpen && careerToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete the career "{careerToDelete.roleName}"?</p>
            <div className="flex justify-end gap-1">
              <button onClick={handleDeleteCareer} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
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
