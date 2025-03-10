import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import {
  fetchOffices,
  deleteOffice,
} from "@/app/redux/services/officeService";

interface Office {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  status: string;
  price: string;
  lotArea: string;
  amenities: string[];
}

export default function OfficePage() {
  const dispatch = useDispatch<any>();
  const { offices, loading } = useSelector((state: RootState) => state.officeData);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState<Office | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Fetch offices when component mounts
  useEffect(() => {
    dispatch(fetchOffices());
  }, [dispatch]);

  // ✅ Delete office using Redux
  const handleDeleteOffice = async () => {
    if (officeToDelete) {
      try {
        await dispatch(deleteOffice(officeToDelete.id)).unwrap();
  
      } catch (error) {
        console.error("Error deleting office:", error);
      
      }
      setDeleteModalOpen(false);
    }
  };
  const columns = [
    { name: "Name", selector: (row: Office) => row.name || "N/A", sortable: true },
    { name: "Location", selector: (row: Office) => row.location || "N/A", sortable: true },
    { name: "Status", selector: (row: Office) => row.status || "N/A", sortable: true }, // 🔹 Changed from "Division" to "Status"
    { name: "Price", selector: (row: Office) => row.price || "N/A", sortable: true,wrap:true },
    { name: "Lot Area", selector: (row: Office) => row.lotArea || "N/A", sortable: true },
    {
      name: "Image",
      cell: (row: Office) =>
        row.image ? <img src={`${API_BASE_URL}${row.image}`} alt={row.name} className="w-12 h-12 rounded-md" /> : "No Image",
      sortable: false,
    },
{
  name: "Amenities",
  cell: (row: Office) => {
    const isExpanded = expandedRows[row.id] || false;
    
    // Ensure displayedAmenities is always an array
    const displayedAmenities = Array.isArray(row.amenities) 
      ? (isExpanded ? row.amenities : row.amenities.slice(0, 2)) 
      : [];

    return (
      <div>
        <ul className="list-disc pl-4 text-gray-600">
          {displayedAmenities.length > 0 ? (
            displayedAmenities.map((amenity, index) => <li key={index}>{amenity}</li>)
          ) : (
            <p>No Amenities</p>
          )}
        </ul>

        {row.amenities && Array.isArray(row.amenities) && row.amenities.length > 2 && (
          <button
            onClick={() => toggleExpand(row.id)}
            className="text-blue-500 hover:underline text-sm mt-1"
          >
            {isExpanded ? "See Less" : "See More"}
          </button>
        )}
      </div>
    );
  },
  sortable: false,
},
{
  name: "Actions",
  right: true,
  cell: (row: Office) => (
    <div className="relative">
      <button
        onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <FaEllipsisV />
      </button>

      {openMenu === row.id && (
        <div
          className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50"
        >
          <button
            onClick={() => {
              setEditingOffice(row);
              setIsEditModalOpen(true);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOfficeToDelete(row);
              setDeleteModalOpen(true);
              setOpenMenu(null); // Close menu on delete click
            }}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  ),
}


  ];

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Office Management</h1>
        <button
          onClick={() => {
            console.log("Opening Add Modal"); // ✅ Debugging
            setIsAddModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Office
        </button>
      </div>

      <DataTable columns={columns} data={offices} pagination highlightOnHover striped />

      <AddModal modalOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} fetchData={fetchOffices} />
      
      {editingOffice && (
        <EditModal modalOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} office={editingOffice} fetchData={fetchOffices} />
      )}

      {deleteModalOpen && officeToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete the office "{officeToDelete.name}"?</p>
            <div className="flex justify-end gap-1">
              <button onClick={handleDeleteOffice} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Confirm
              </button>
              <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
