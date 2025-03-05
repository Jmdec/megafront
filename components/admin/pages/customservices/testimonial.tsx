import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";
import { FaEllipsisV } from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  message: string;
}

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonial`);
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDeleteTestimonial = async () => {
    if (testimonialToDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/testimonial/${testimonialToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchTestimonials();
          showToast("Testimonial deleted successfully", "success");
        }
      } catch (error) {
        console.error("Error deleting testimonial:", error);
      }
      setDeleteModalOpen(false);
    }
  };

  const columns = [
    { name: "Name", selector: (row: Testimonial) => row.name, sortable: true },
    { name: "Message", selector: (row: Testimonial) => row.message, sortable: true },
    {
      name: "Actions",
      right: true,
      cell: (row: Testimonial) => (
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
                  setEditingTestimonial(row);
                  setIsEditModalOpen(true);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setTestimonialToDelete(row);
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
        <h1 className="text-2xl font-semibold">Testimonial Management</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Testimonial</button>
      </div>

      <DataTable columns={columns} data={testimonials} pagination highlightOnHover striped />

      <AddModal modalOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} fetchData={fetchTestimonials} itemType="testimonial" />
      {editingTestimonial && (
        <EditModal modalOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} item={editingTestimonial} fetchData={fetchTestimonials} itemType="testimonial" />
      )}

      {deleteModalOpen && testimonialToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete the testimonial from "{testimonialToDelete.name}"?</p>
            <div className="flex justify-end gap-1">
              <button onClick={handleDeleteTestimonial} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Confirm</button>
              <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}