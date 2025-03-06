import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";

interface EventData {
  id: number;
  title: string;
  description: string;
  image: string;
  file:string;
  date: string;
  media_type: "image" | "video";
}

export default function EventPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Defining the ref for the menu
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/event`);
      const data = await response.json();
      console.log(data)
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Close menu when clicking outside
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

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/event/${eventToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchEvents();
          showToast("Event deleted successfully", "success");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
      setDeleteModalOpen(false); // Close the confirmation modal
    }
  };
const columns = [
  {
    name: "Title",
    selector: (row: EventData) => row.title,
    sortable: true,
  },
  {
    name: "Description",
    selector: (row: EventData) => row.description,
    sortable: true,
  },
  {
    name: "Date",
    selector: (row: EventData) => {
      const date = new Date(row.date);
      return date.toISOString().split("T")[0];
    },
    sortable: true,
  },
  {
    name: "Media",
    cell: (row: EventData) => (
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
      )
    ),
    sortable: false,
  },
  {
    name: "Actions",
    right: true,
    cell: (row: EventData) => (
      <div className="relative">
        <button
          onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)} // Toggle menu visibility
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FaEllipsisV />
        </button>

        {openMenu === row.id && (
          <div
            ref={menuRef} // Using the menuRef here
            className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50"
          >
            <button
              onClick={() => {
                setEditingEvent(row); // Set event for editing
                setIsEditModalOpen(true); // Open the Edit Event modal
                setOpenMenu(null); // Close the menu after action
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setEventToDelete(row); // Set event for deletion
                setDeleteModalOpen(true); // Open the confirmation modal
                setOpenMenu(null); // Close the menu after action
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
          onClick={() => setIsAddModalOpen(true)} // Open modal for adding event
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

      <DataTable
        columns={columns}
        data={filteredEvents}
        pagination
        highlightOnHover
        striped
      />

      {/* Add Event Modal */}
      <AddModal
        modalOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        fetchData={fetchEvents}
        itemType="event" // Set itemType to "event"
      />

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditModal
          modalOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          item={editingEvent}
          fetchData={fetchEvents}
          itemType="event" // Set itemType to "event"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && eventToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete the event "{eventToDelete.title}"?</p>
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
