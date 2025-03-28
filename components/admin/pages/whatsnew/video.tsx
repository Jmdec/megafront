"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  fetchVideos,
  deleteVideo,
} from "@/app/redux/services/videoService";
import { FaEllipsisV } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";
 const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VideoManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { videos, loading, error } = useSelector(
    (state: RootState) => state.townshipVideo
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteVideo = async () => {
    if (videoToDelete) {
      await dispatch(deleteVideo(videoToDelete.id));
      showToast("Video deleted successfully", "success");
      setDeleteModalOpen(false);
    }
  };

  const columns = [
    { name: "Title", selector: (row: any) => row.title, sortable: true },
    { name: "Location", selector: (row: any) => row.location || "N/A", sortable: true },
    { name: "Date", selector: (row: any) => new Date(row.date).toISOString().split("T")[0], sortable: true },
    { name: "Views", selector: (row: any) => row.views, sortable: true },
   {
  name: "Thumbnail",
  cell: (row: any) => (
    <img
      src={row.thumbnail ? `${API_BASE_URL}${row.thumbnail}` : "/default-thumbnail.jpg"}
      alt={row.title}
      style={{ width: "50px", height: "50px", objectFit: "cover" }}
    />
  ),
  sortable: false,
},
{
  name: "Video",
  cell: (row: any) =>
    row.url ? (
      <iframe
        width="150"
        height="80"
        src={row.url.replace("watch?v=", "embed/")}
        title={row.title}
        allowFullScreen
      />
    ) : row.file_path ? (
      <video width="150" height="80" controls>
        <source src={`${API_BASE_URL}${row.file_path}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      "No video available"
    ),
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
            <div className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50">
              <button
                onClick={() => {
                  setEditingVideo(row);
                  setOpenMenu(null);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setVideoToDelete(row);
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
        <h1 className="text-2xl font-semibold">Video Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Video
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p>Loading videos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredVideos}
          pagination
          highlightOnHover
          striped
        />
      )}

      {/* Add Video Modal */}
      <AddModal
        modalOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        fetchData={() => dispatch(fetchVideos())}
        itemType="video"
      />

      {/* Edit Video Modal */}
      {editingVideo && (
        <EditModal
          modalOpen={true}
          closeModal={() => setEditingVideo(null)}
          item={editingVideo}
          fetchData={() => dispatch(fetchVideos())}
          itemType="video"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && videoToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the video "{videoToDelete.title}"?
            </p>
            <div className="flex justify-end gap-1">
              <button
                onClick={handleDeleteVideo}
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
