import React, { useState, useEffect } from "react";
import { showToast } from "@/components/toast";
import { useDispatch } from "react-redux";


import { updateSeminar } from "@/app/redux/services/seminarService";
import { updateMeeting } from "@/app/redux/services/meetingService";
import { updateEvent } from "@/app/redux/services/eventService";
import { updateClosedDeal } from "@/app/redux/services/closedDealService";
import { updateRealEstateNews } from "@/app/redux/services/realestateNewsService";
import { updateRealEstateTip } from "@/app/redux/services/realestateTipsService";
import { updateOngoingInfrastructure } from "@/app/redux/services/ongoingInfrastructure";
import { updateVideo } from "@/app/redux/services/videoService";
interface EditItemModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  item: any | null;
  fetchData: () => void;
  itemType: string;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  modalOpen,
  closeModal,
  item,
  fetchData,
  itemType,
}) => {
  const dispatch = useDispatch();
  const [editedItem, setEditedItem] = useState<any | null>(item);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleSave = async () => {
    if (!editedItem?.title.trim() || !editedItem?.date.trim()) {
      showToast("Title and Date are required.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", editedItem.title);
    formData.append("date", editedItem.date);

    if (itemType === "video") {
      formData.append("location", editedItem.location || "");
      formData.append("views", String(parseInt(editedItem.views || "0", 10)));
      if (editedItem.url) formData.append("url", editedItem.url);
      if (editedItem.file) formData.append("file", editedItem.file);
      if (editedItem.thumbnail) formData.append("thumbnail", editedItem.thumbnail);
    } else if (itemType === "event") {
      formData.append("description", editedItem.description || "");
      formData.append("media_type", editedItem.mediaType || "");
      if (editedItem.mediaType === "image" && editedItem.image) {
        formData.append("image", editedItem.image);
      } else if (editedItem.file) {
        formData.append("file", editedItem.file);
      }
    } else {
      formData.append("description", editedItem.description || "");
      if (editedItem.image) formData.append("image", editedItem.image);
    }

    console.log("Sending FormData:", Object.fromEntries(formData.entries()));

    try {
      let updateAction;
      switch (itemType) {
        case "seminar":
          updateAction = updateSeminar({ id: editedItem.id, updatedSeminar: formData });
          break;
        case "meeting":
          updateAction = updateMeeting({ id: editedItem.id, updatedMeeting: formData });
          break;
        case "event":
          updateAction = updateEvent({ id: editedItem.id, updatedEvent: formData });
          break;
        case "closedDeal":
          updateAction = updateClosedDeal({ id: editedItem.id, updatedClosedDeal: formData });
          break;
        case "realEstateNews":
          updateAction = updateRealEstateNews({ id: editedItem.id, updatedNews: formData });
          break;
        case "realEstateTips":
          updateAction = updateRealEstateTip({ id: editedItem.id, updatedTip: formData });
          break;
        case "ongoingInfrastructure":
          updateAction = updateOngoingInfrastructure({ id: editedItem.id, updatedProject: formData });
          break;
        case "video":
          updateAction = updateVideo({ id: editedItem.id, updatedVideo: formData });
          break;
        default:
          showToast("Invalid item type.", "error");
          return;
      }

      await dispatch(updateAction as any).unwrap();

      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error updating:", error);
 
    }
  };


  return modalOpen && editedItem ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Edit {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</h2>
        
        <input
          type="text"
          placeholder="Enter Title"
          value={editedItem.title}
          onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="date"
          value={editedItem.date}
          onChange={(e) => setEditedItem({ ...editedItem, date: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
              {itemType === "event" && (
          <>
            {/* Event-specific fields */}
            <textarea
              placeholder="Enter Description"
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Media Type Select */}
            <label className="block text-gray-700 font-medium mb-1">Media Type</label>
       <select
  value={editedItem.mediaType || ""}
  onChange={(e) => setEditedItem({ ...editedItem, mediaType: e.target.value as "image" | "video" })}
  className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
>
  <option value="" disabled>Select</option> {/* Disabled first option */}
  <option value="image">Image</option>
  <option value="video">Video</option>
</select>

            {/* Image upload if mediaType is "image" */}
            {editedItem.mediaType === "image" && (
              <>
                <label className="block text-gray-700 font-medium mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditedItem({ ...editedItem, image: e.target.files?.[0] || null })}
                  className="w-full mb-4"
                />
              </>
            )}

            {/* Video upload if mediaType is "video" */}
            {editedItem.mediaType === "video" && (
              <>
                <label className="block text-gray-700 font-medium mb-1">Upload Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setEditedItem({ ...editedItem, file: e.target.files?.[0] || null })}
                  className="w-full mb-4"
                />
              </>
            )}
          </>
        )}

        {itemType !== "video" && itemType !== "event" && (
          <>
            <textarea
              placeholder="Enter Description"
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditedItem({ ...editedItem, image: e.target.files?.[0] || null })}
              className="w-full mb-4"
            />
          </>
        )}

        {itemType === "video" && (
          <>
            <input
              type="text"
              placeholder="Enter Video Location"
              value={editedItem.location}
              onChange={(e) => setEditedItem({ ...editedItem, location: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Initial Views"
              value={editedItem.views}
              onChange={(e) => setEditedItem({ ...editedItem, views: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Enter YouTube URL"
              value={editedItem.url}
              onChange={(e) => setEditedItem({ ...editedItem, url: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setEditedItem({ ...editedItem, file: e.target.files?.[0] || null })}
              className="w-full mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditedItem({ ...editedItem, thumbnail: e.target.files?.[0] || null })}
              className="w-full mb-4"
            />
          </>
        )}
        
        <div className="flex justify-end gap-2">
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save</button>
          <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditItemModal;