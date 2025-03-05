import React, { useState, useEffect } from "react";
import { showToast } from "@/components/toast";

interface EditModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
  item: { id: number; roleName?: string; quantity?: number; name?: string; message?: string };
  itemType: string;
}

const EditModal: React.FC<EditModalProps> = ({ modalOpen, closeModal, fetchData, item, itemType }) => {
  const [updatedItem, setUpdatedItem] = useState<{ roleName?: string; quantity?: number; name?: string; message?: string }>(
    {
      roleName: "",
      quantity: 1,
      name: "",
      message: "",
    }
  );

  useEffect(() => {
    if (item) {
      setUpdatedItem({
        roleName: item.roleName || "",
        quantity: item.quantity || 1,
        name: item.name || "",
        message: item.message || "",
      });
    }
  }, [item]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const handleUpdateItem = async () => {
    if (itemType === "career" && !updatedItem.roleName?.trim()) {
      showToast("Role Name is required.", "error");
      return;
    }
    if (itemType === "testimonial" && !updatedItem.name?.trim()) {
      showToast("Name is required.", "error");
      return;
    }

    const updatedData = itemType === "career"
      ? { roleName: updatedItem.roleName, quantity: updatedItem.quantity }
      : { name: updatedItem.name, message: updatedItem.message };

    try {
      const response = await fetch(`${API_BASE_URL}/api/${itemType}/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} updated successfully`, "success");
        fetchData();
        closeModal();
      } else {
        showToast(`Failed to update ${itemType}.`, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(`Error updating ${itemType}.`, "error");
    }
  };

  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Edit {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</h2>

        {itemType === "career" ? (
          <>
            <label className="block text-gray-700 font-medium mb-1">Role Name</label>
            <input
              type="text"
              placeholder="Enter Role Name"
              value={updatedItem.roleName}
              onChange={(e) => setUpdatedItem({ ...updatedItem, roleName: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-gray-700 font-medium mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={updatedItem.quantity}
              onChange={(e) => setUpdatedItem({ ...updatedItem, quantity: parseInt(e.target.value, 10) || 1 })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
          </>
        ) : (
          <>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={updatedItem.name}
              onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              placeholder="Enter Message"
              value={updatedItem.message}
              onChange={(e) => setUpdatedItem({ ...updatedItem, message: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={handleUpdateItem} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Save
          </button>
          <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditModal;
