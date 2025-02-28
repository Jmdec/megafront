import React, { useState, useEffect } from "react";
import { showToast } from "@/components/toast";

interface EditItemModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  item: any | null; // The item to edit (can be seminar or meeting)
  fetchData: () => void; // Function to fetch updated data
  itemType: string; // "seminar" or "meeting"
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  modalOpen,
  closeModal,
  item,
  fetchData,
  itemType,
}) => {
  const [editedItem, setEditedItem] = useState<any | null>(item);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleSave = async () => {
    if (!editedItem?.title.trim() || !editedItem?.description.trim() || !editedItem?.date.trim())
      return;

    const formData = new FormData();
    formData.append("title", editedItem.title);
    formData.append("description", editedItem.description);
    formData.append("date", editedItem.date);

    if (editedItem.image) formData.append("image", editedItem.image);

    try {
      const response = await fetch(`${API_BASE_URL}/api/${itemType}/${editedItem.id}`, {
        method: "POST", // POST for updating
        body: formData,
      });

      if (response.ok) {
        showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} updated successfully`, "success");
        fetchData(); // Fetch updated data
        closeModal();
      }
    } catch (error) {
      console.error(`Error updating ${itemType}:`, error);
    }
  };

  return modalOpen && editedItem ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">{`Edit ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}</h2>
        
        <input
          type="text"
          placeholder={`Enter ${itemType} title`}
          value={editedItem.title}
          onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        
        <textarea
          placeholder={`Enter ${itemType} description`}
          value={editedItem.description}
          onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="date"
          value={editedItem.date}
          onChange={(e) => setEditedItem({ ...editedItem, date: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="file"
          onChange={(e) => setEditedItem({ ...editedItem, image: e.target.files?.[0] || null })}
          className="w-full mb-4"
        />
        
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSave}
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

export default EditItemModal;
