"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import {
  fetchClientProperties,
  deleteClientProperty,
  updateClientPropertyStatus,
} from "@/app/redux/services/clientpropertyService";

interface ClientProperty {
  id: number;
  last_name: string;
  first_name: string;
  email: string;
  number: string;
  property_name: string;
  development_type: string;
  unit_type: string[];
  price: string;
  location: string;
  images: string[];
  status: string;
}

export default function ClientPropertyPage() {
  const dispatch = useDispatch<any>();
  const { properties, loading } = useSelector(
    (state: RootState) => state.clientpropertyData
  );
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] =
    useState<ClientProperty | null>(null);
  const [propertyToUpdate, setPropertyToUpdate] =
    useState<ClientProperty | null>(null);

  useEffect(() => {
    dispatch(fetchClientProperties());
  }, [dispatch]);

  const handleDeleteProperty = async () => {
    if (propertyToDelete) {
      try {
        await dispatch(deleteClientProperty(propertyToDelete.id)).unwrap();
        showToast("Property deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting property:", error);
        showToast("Failed to delete property", "error");
      }
      setDeleteModalOpen(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    console.log(propertyToUpdate);
    if (propertyToUpdate) {
      try {
        await dispatch(
          updateClientPropertyStatus({
            id: propertyToUpdate.id,
            status: newStatus,
          })
        ).unwrap();
        setStatusModalOpen(false);
        dispatch(fetchClientProperties());
        showToast("Status updated successfully", "success");
      } catch (error) {
        console.error("Error updating property status:", error);
        showToast("Failed to update status", "error");
      }
    }
  };
  const filteredProperties = properties.filter((property: ClientProperty) =>
    [`${property.first_name} ${property.last_name}`].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );
  const columns = [
    {
      name: "Client Name",
      selector: (row: ClientProperty) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: ClientProperty) => row.email || "N/A",
      sortable: true,
    },
    {
      name: "Contact",
      selector: (row: ClientProperty) => row.number || "N/A",
      sortable: true,
    },
    {
      name: "Property",
      selector: (row: ClientProperty) => row.property_name || "N/A",
      sortable: true,
    },
    {
      name: "Development Type",
      selector: (row: ClientProperty) => row.development_type || "N/A",
      sortable: true,
    },
    {
      name: "Unit Type",
      selector: (row: ClientProperty) => row.unit_type?.join(", ") || "N/A",
      sortable: true,
    },
    {
      name: "Price",
      selector: (row: ClientProperty) =>
        row.price
          ? row.price
              .split(" - ") // Split the range
              .map((num) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 0, // Adjust decimal places as needed
                }).format(Number(num))
              )
              .join(" - ")
          : "N/A",
      sortable: true,
      wrap: true,
    },

    {
      name: "Location",
      selector: (row: ClientProperty) => row.location || "N/A",
      sortable: true,
    },
    {
      name: "Images",
      selector: (row: ClientProperty) =>
        row.images.length > 0 ? "Available" : "None",
      cell: (row: ClientProperty) => (
        <div className="flex gap-2">
          {row.images.map((img, index) => (
            <img
              key={index}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${img}`}
              alt="Property"
              className="w-10 h-10 rounded-md"
            />
          ))}
        </div>
      ),
      sortable: false,
    },
    {
      name: "Status",
      selector: (row: ClientProperty) => row.status || "N/A",
      sortable: true,
      cell: (row: ClientProperty) => (
        <button
          className={`px-2 py-1 rounded-md text-white ${
            row.status === "Pending"
              ? "bg-yellow-500"
              : row.status === "Approved"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
          onClick={() => {
            if (row.status !== "Rejected") {
              setPropertyToUpdate(row);
              setStatusModalOpen(true);
            }
          }}
        >
          {row.status.toLocaleUpperCase()}
        </button>
      ),
    },
    {
      name: "Actions",
      right: true,
      cell: (row: ClientProperty) => (
        <div className="relative">
          <button
            onClick={() => {
              setPropertyToDelete(row);
              setDeleteModalOpen(true);
            }}
            className="p-2 rounded-full hover:bg-gray-200 text-red-500"
          >
            <FaEllipsisV />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Client Properties</h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by client name."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/4 px-4 py-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredProperties}
        pagination
        highlightOnHover
        striped
      />

      {/* ✅ Status Change Modal */}
      {statusModalOpen && propertyToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Update Status</h3>
            <p className="mb-4">
              Change status for{" "}
              <strong>{propertyToUpdate.property_name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              {propertyToUpdate.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleUpdateStatus("Approved")}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("Rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
              {propertyToUpdate.status === "Approved" && (
                <>
                  <button
                    onClick={() => handleUpdateStatus("Pending")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("Rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setStatusModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {deleteModalOpen && propertyToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the property{" "}
              <strong>{propertyToDelete.property_name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDeleteProperty}
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
