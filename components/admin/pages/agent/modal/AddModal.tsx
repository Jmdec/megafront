import React, { useState } from "react";
import { showToast } from "@/components/toast";

interface AddModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  fetchData: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ modalOpen, closeModal, fetchData }) => {
  const [newAgent, setNewAgent] = useState<{
    name: string;
    role: string;
    image: File | null;
    description: string;
    email: string;
    phone: string;
    facebook: string;
    instagram: string;
    certificates: FileList | null;
    gallery: FileList | null;
  }>({
    name: "",
    role: "",
    image: null,
    description: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    certificates: null,
    gallery: null,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleAddAgent = async () => {
    if (!newAgent.name.trim() || !newAgent.role.trim() || !newAgent.description.trim()) {
      showToast("Agent Name, Role, and Description are required.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", newAgent.name);
    formData.append("role", newAgent.role);
    formData.append("description", newAgent.description);
    formData.append("email", newAgent.email);
    formData.append("phone", newAgent.phone);
    formData.append("facebook", newAgent.facebook);
    formData.append("instagram", newAgent.instagram);

    if (newAgent.image) {
      formData.append("image", newAgent.image);
    }
    if (newAgent.certificates) {
      Array.from(newAgent.certificates).forEach((file) => {
        formData.append("certificates[]", file);
      });
    }
    if (newAgent.gallery) {
      Array.from(newAgent.gallery).forEach((file) => {
        formData.append("gallery[]", file);
      });
    }

    // ✅ Debugging: Log FormData before sending
    console.log("FormData being sent:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/agent`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        showToast("Agent added successfully", "success");
        fetchData();
        closeModal();
      } else {
        showToast("Failed to add agent.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error adding agent.", "error");
    }
  };

  return modalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Add Agent</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

    <label className="block text-gray-700 font-medium mb-1">Role</label>
<select
  value={newAgent.role}
  onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
  className="w-full border rounded-md px-3 py-2 mb-4 bg-white focus:ring-2 focus:ring-[#B8986E]"
>
  <option value="">Select Role</option>
  <option value="Real Estate Agent">Real Estate Agent</option>
  <option value="Marketing Specialist">Marketing Specialist</option>
  <option value="Property Manager">Property Manager</option>
</select>


            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter Description"
              value={newAgent.description}
              onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
          </div>

          {/* Right Column */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={newAgent.email}
              onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={newAgent.phone}
              onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block text-gray-700 font-medium mb-1">Facebook</label>
            <input
              type="text"
              placeholder="Enter Facebook URL"
              value={newAgent.facebook}
              onChange={(e) => setNewAgent({ ...newAgent, facebook: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block text-gray-700 font-medium mb-1">Instagram</label>
            <input
              type="text"
              placeholder="Enter Instagram URL"
              value={newAgent.instagram}
              onChange={(e) => setNewAgent({ ...newAgent, instagram: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Image</label>
            <input
              type="file"
              onChange={(e) => setNewAgent({ ...newAgent, image: e.target.files?.[0] || null })}
              className="w-full mb-4"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Certificates</label>
            <input
              type="file"
              multiple
              onChange={(e) => setNewAgent({ ...newAgent, certificates: e.target.files })}
              className="w-full mb-4"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Gallery</label>
            <input
              type="file"
              multiple
              onChange={(e) => setNewAgent({ ...newAgent, gallery: e.target.files })}
              className="w-full mb-4"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={handleAddAgent} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
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
