import React, { useState } from "react";
import { showToast } from "@/components/toast";

interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
  itemType: "seminar" | "meeting" | "event" | "closedDeal" | "realEstateNews" | "realEstateTips" | "ongoingInfrastructure" | "video";
}

const AddModal: React.FC<AddModalProps> = ({ modalOpen, closeModal, fetchData, itemType }) => {
  const [newItem, setNewItem] = useState<{
    title: string;
    date: string;
    description?: string;
    image?: File | null;
    location?: string;
    views?: string;
    url?: string;
    file?: File | null;
    thumbnail?: File | null;
      mediaType?: "image" | "video"; 
  }>({
    title: "",
    date: "",
    description: "",
    image: null,
    location: "",
    views: "0",
    url: "",
    file: null,
    thumbnail: null,
      mediaType: "image",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

 const handleAddItem = async () => {
  if (!newItem.title.trim() || !newItem.date.trim()) {
    showToast("Title and Date are required.", "error");
    return;
  }

  if (itemType === "video" && !newItem.url?.trim() && !newItem.file) {
    showToast("Please provide a YouTube URL or upload a video file.", "error");
    return;
  }
 if (itemType === "event" && !newItem.description?.trim()) {
    showToast("Description is required for events.", "error");
    return;
  }
  const formData = new FormData();
  formData.append("title", newItem.title);
  formData.append("date", newItem.date);

  if (itemType === "video") {
    formData.append("location", newItem.location || "");
    formData.append("views", String(parseInt(newItem.views || "0", 10))); // ✅ Convert to integer
    if (newItem.url) formData.append("url", newItem.url);
    if (newItem.file) formData.append("file", newItem.file);
    if (newItem.thumbnail) formData.append("thumbnail", newItem.thumbnail);
  }   else if (itemType === "event") {
  formData.append("description", newItem.description || "");
  formData.append("media_type", newItem.mediaType || ""); // Append media_type for events
  
  // Only append the image field if media_type is "image"
  if (newItem.mediaType === "image" && newItem.image) {
    formData.append("image", newItem.image); // For event, attach image only if media_type is image
  }else{
    if (newItem.file) formData.append("file", newItem.file);
  }
}

  // Fallback for other item types (e.g., generic or another type)
  else {
    formData.append("description", newItem.description || "");
    if (newItem.image) formData.append("image", newItem.image);
  }
  console.log("Sending FormData:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/${itemType}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (response.ok) {
      showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} added successfully`, "success");
      fetchData();
      closeModal();
    } else {
      showToast("Failed to add item.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Error adding item.", "error");
  }
};


  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</h2>

          <label className="block text-gray-700 font-medium mb-1">Date</label>
        <input
          type="date"
          value={newItem.date}
          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-gray-700 font-medium mb-1">Title</label>
        <input
          type="text"
          placeholder="Enter Title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />

     
{itemType === "event" && (
          <>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-gray-700 font-medium mb-1">Media Type</label>
            <select
              value={newItem.mediaType}
              onChange={(e) => setNewItem({ ...newItem, mediaType: e.target.value as "image" | "video" })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>

            {newItem.mediaType === "image" && (
              <>
                <label className="block text-gray-700 font-medium mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.files?.[0] || null })}
                  className="w-full mb-4"
                />
              </>
            )}

            {newItem.mediaType === "video" && (
              <>
              
                <label className="block text-gray-700 font-medium mb-1">Upload Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setNewItem({ ...newItem, file: e.target.files?.[0] || null })}
                  className="w-full mb-4"
                />

              </>
            )}
          </>
        )}
          
        {/* Non-video fields */}
        {itemType !== "video" && itemType !== "event" &&(
          <>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-gray-700 font-medium mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewItem({ ...newItem, image: e.target.files?.[0] || null })}
              className="w-full mb-4"
            />
          </>
        )}

        {/* Video-specific fields */}
        {itemType === "video" && (
          <>
            <label className="block text-gray-700 font-medium mb-1">Video Location (Optional)</label>
            <input
              type="text"
              placeholder="Enter Video Location"
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-gray-700 font-medium mb-1">Initial Views (Optional)</label>
            <input
              type="number"
              placeholder="Initial Views"
              value={newItem.views}
              onChange={(e) => setNewItem({ ...newItem, views: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-gray-700 font-medium mb-1">YouTube URL (Optional)</label>
            <input
              type="text"
              placeholder="Enter YouTube URL"
              value={newItem.url}
              onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-gray-700 font-medium mb-1">Upload Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setNewItem({ ...newItem, file: e.target.files?.[0] || null })}
              className="w-full mb-4"
            />

            <label className="block text-gray-700 font-medium mb-1">Upload Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewItem({ ...newItem, thumbnail: e.target.files?.[0] || null })}
              className="w-full mb-4"
            />
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={handleAddItem} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
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

export default AddModal;
