"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  fetchRealEstateNews,
  deleteRealEstateNews,
} from "@/app/redux/services/realestateNewsService";
import { FaEllipsisV } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";

export default function RealEstateNewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { news, loading, error } = useSelector(
    (state: RootState) => state.realEstateNewsData
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    dispatch(fetchRealEstateNews());
  }, [dispatch]);

  const filteredNews = news.filter((newsItem) =>
    newsItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNews = async () => {
    if (newsToDelete) {
      await dispatch(deleteRealEstateNews(newsToDelete.id));
      showToast("News deleted successfully", "success");
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
      name: "Image",
      cell: (row: any) => (
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
                  setEditingNews(row);
                  setOpenMenu(null);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setNewsToDelete(row);
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
        <h1 className="text-2xl font-semibold">Real Estate News Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add News
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p>Loading news...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredNews}
          pagination
          highlightOnHover
          striped
        />
      )}

      {/* Add News Modal */}
      <AddModal
        modalOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        fetchData={() => dispatch(fetchRealEstateNews())}
        itemType="realEstateNews"
      />

      {/* Edit News Modal */}
      {editingNews && (
        <EditModal
          modalOpen={true}
          closeModal={() => setEditingNews(null)}
          item={editingNews}
          fetchData={() => dispatch(fetchRealEstateNews())}
          itemType="realEstateNews"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && newsToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the news "{newsToDelete.title}"?
            </p>
            <div className="flex justify-end gap-1">
              <button
                onClick={handleDeleteNews}
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
