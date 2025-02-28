import React, { useState } from "react";
import { showToast } from "@/components/toast";

interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void; // Fetch data after the item is added
  itemType: "seminar" | "meeting"| "event"; // To distinguish between seminars and meetings
}

const AddModal: React.FC<AddModalProps> = ({ modalOpen, closeModal, fetchData, itemType }) => {
  const [newItem, setNewItem] = useState<{
    title: string;
    description: string;
    date: string;
    image: File | null;
  }>({ title: "", description: "", date: "", image: null });

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !newItem.description.trim() || !newItem.date.trim()) return;

    const formData = new FormData();
    formData.append("title", newItem.title);
    formData.append("description", newItem.description);
    formData.append("date", newItem.date);

    if (newItem.image) formData.append("image", newItem.image);

    try {
      const method = "POST";
      const url = `${API_BASE_URL}/api/${itemType}`; // API route changes based on itemType (seminar or meeting)

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} added successfully`, "success");
        fetchData(); // Fetch updated data after adding the item
        closeModal();
      }
    } catch (error) {
      console.error(`Error adding ${itemType}:`, error);
    }
  };

  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Add {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</h2>
        <input
          type="text"
          placeholder={`Enter ${itemType} title`}
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder={`Enter ${itemType} description`}
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={newItem.date}
          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={(e) => setNewItem({ ...newItem, image: e.target.files?.[0] || null })}
          className="w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddModal;
