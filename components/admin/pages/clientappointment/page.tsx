"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import {
  fetchClientAppointments,
  deleteClientAppointment,
  updateClientAppointmentStatus,
} from "@/app/redux/services/clientappointmentService";

interface ClientAppointment {
  id: number;
  name: string;
  email: string;
  contact_number: string;
  property_name: string;
  date: string;
  status: string;
  message: string;
  type:string;
}

export default function ClientAppointmentPage() {
  const dispatch = useDispatch<any>();
  const { clientAppointments, loading } = useSelector(
    (state: RootState) => state.clientappointmentData
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<ClientAppointment | null>(null);
  const [appointmentToUpdate, setAppointmentToUpdate] = useState<ClientAppointment | null>(null);


  useEffect(() => {
    dispatch(fetchClientAppointments());
  }, [dispatch]);


  const handleDeleteAppointment = async () => {
    if (appointmentToDelete) {
      try {
        await dispatch(deleteClientAppointment(appointmentToDelete.id)).unwrap();
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
      setDeleteModalOpen(false);
    }
  };

const handleUpdateStatus = async (newStatus: string) => {
  if (appointmentToUpdate) {
    try {
      await dispatch(updateClientAppointmentStatus({ id: appointmentToUpdate.id, status: newStatus })).unwrap();
      setStatusModalOpen(false);
      
      // 🔹 Refresh appointments after updating status
      dispatch(fetchClientAppointments());
      
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  }
};


  const columns = [
    { name: "Client Name", selector: (row: ClientAppointment) => row.name || "N/A", sortable: true },
    { name: "Email", selector: (row: ClientAppointment) => row.email || "N/A", sortable: true },
    { name: "Contact", selector: (row: ClientAppointment) => row.contact_number || "N/A", sortable: true },
    { name: "Property", selector: (row: ClientAppointment) => row.property_name || "N/A", sortable: true },
    { name: "Date & Time", selector: (row: ClientAppointment) => new Date(row.date).toLocaleString(), sortable: true },
 { name: "Type", selector: (row: ClientAppointment) => row.type || "N/A", sortable: true },
    // ✅ Status Column with Modal Popup
    {
      name: "Status",
      selector: (row: ClientAppointment) => row.status || "N/A",
      sortable: true,
      cell: (row: ClientAppointment) => (
        <button
          className={`px-2 py-1 rounded-md text-white ${row.status === "Pending" ? "bg-yellow-500" : row.status === "Accept" ? "bg-green-500" : "bg-red-500"}`}
          onClick={() => {
            if (row.status !== "Decline") {
              setAppointmentToUpdate(row);
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
      cell: (row: ClientAppointment) => (
        <div className="relative">
          <button
            onClick={() => {
              setAppointmentToDelete(row);
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
        <h1 className="text-2xl font-semibold">Client Appointments</h1>
      </div>

      <DataTable columns={columns} data={clientAppointments} pagination highlightOnHover striped  />

      {/* ✅ Status Change Modal */}
      {statusModalOpen && appointmentToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Update Status</h3>
            <p className="mb-4">
              Change status for <strong>{appointmentToUpdate.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              {appointmentToUpdate.status === "Pending" && (
                <>
                  <button onClick={() => handleUpdateStatus("Accept")} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Accept
                  </button>
                  <button onClick={() => handleUpdateStatus("Decline")} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    Decline
                  </button>
                </>
              )}
              {appointmentToUpdate.status === "Accept" && (
                <>
                  <button onClick={() => handleUpdateStatus("Pending")} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                    Pending
                  </button>
                  <button onClick={() => handleUpdateStatus("Decline")} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    Decline
                  </button>
                </>
              )}
              <button onClick={() => setStatusModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {deleteModalOpen && appointmentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the appointment for <strong>{appointmentToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={handleDeleteAppointment} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
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
