"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  fetchEvents,
  deleteEvent,
} from "@/app/redux/services/eventService"; // Import event actions
import { FaEllipsisV } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";

export default function EventPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading } = useSelector((state: RootState) => state.eventsData);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      await dispatch(deleteEvent(eventToDelete.id));
      showToast("Event deleted successfully", "success");
      setDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      name: "Title",
      selector: (row: any) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: any) => new Date(row.date).toISOString().split("T")[0],
      sortable: true,
    },
    {
      name: "Media",
      cell: (row: any) =>
        row.media_type === "video" ? (
          <video width="50" height="50" controls>
            <source src={`${API_BASE_URL}${row.file}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={`${API_BASE_URL}${row.image}`}
            alt={row.title}
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ),
      sortable: false,
    },
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
            <div
              ref={menuRef}
            className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50"
            >
              <button
                onClick={() => {
                  setEditingEvent(row);
                  setOpenMenu(null);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setEventToDelete(row);
                  setDeleteModalOpen(true);
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Event Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Event
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredEvents}
          pagination
          highlightOnHover
          striped
        />
      )}

      {/* Add Event Modal */}
      <AddModal
        modalOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        fetchData={() => dispatch(fetchEvents())}
        itemType="event"
      />

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditModal
          modalOpen={true}
          closeModal={() => setEditingEvent(null)}
          item={editingEvent}
          fetchData={() => dispatch(fetchEvents())}
          itemType="event"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && eventToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the event "{eventToDelete.title}"?
            </p>
            <div className="flex justify-end gap-1">
              <button
                onClick={handleDeleteEvent}
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
