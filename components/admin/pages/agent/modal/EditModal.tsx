import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/components/toast";
import { updateAgent } from "@/app/redux/services/agentService";

interface EditModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  agent: Agent;
  fetchData: () => void;
}

interface Agent {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  email: string;
  phone: string;
  sociallinks: {
    facebook?: string;
    instagram?: string;
  };
  certificates: string[];
  gallery: string[];
}

export default function EditModal({ modalOpen, closeModal, agent, fetchData }: EditModalProps) {
   const dispatch = useDispatch<any>();
  const [formData, setFormData] = useState<Agent>({
    id: agent.id,
    name: agent.name || "",
    role: agent.role || "",
    image: agent.image || "",
    description: agent.description || "",
    email: agent.email || "",
    phone: agent.phone || "",
    sociallinks: {
      facebook: agent.sociallinks?.facebook || "",
      instagram: agent.sociallinks?.instagram || "",
    },
    certificates: Array.isArray(agent.certificates) ? agent.certificates : [],
    gallery: Array.isArray(agent.gallery) ? agent.gallery : [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [certFiles, setCertFiles] = useState<FileList | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (agent) {
      setFormData({
        id: agent.id,
        name: agent.name || "",
        role: agent.role || "",
        image: agent.image || "",
        description: agent.description || "",
        email: agent.email || "",
        phone: agent.phone || "",
        sociallinks: {
          facebook: agent.sociallinks?.facebook || "",
          instagram: agent.sociallinks?.instagram || "",
        },
        certificates: Array.isArray(agent.certificates) ? agent.certificates : [],
        gallery: Array.isArray(agent.gallery) ? agent.gallery : [],
      });
    }
  }, [agent]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "certificates" | "gallery") => {
  const files = e.target.files;
  if (!files || files.length === 0) return; // ✅ Ensure files exist before processing

  if (field === "image") {
    setImageFile(files[0]);
    setFormData((prev) => ({ ...prev, image: URL.createObjectURL(files[0]) }));
  } else if (field === "certificates") {
    setCertFiles(files);
  } else if (field === "gallery") {
    setGalleryFiles(files);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    updatedFormData.append("name", formData.name);
    updatedFormData.append("role", formData.role);
    updatedFormData.append("description", formData.description);
    updatedFormData.append("email", formData.email);
    updatedFormData.append("phone", formData.phone);
    updatedFormData.append("facebook", formData.sociallinks.facebook || "");
    updatedFormData.append("instagram", formData.sociallinks.instagram || "");

    if (imageFile) {
      updatedFormData.append("image", imageFile);
    }
    if (certFiles) {
      Array.from(certFiles).forEach((file, index) => {
        updatedFormData.append(`certificates[${index}]`, file);
      });
    }
    if (galleryFiles) {
      Array.from(galleryFiles).forEach((file, index) => {
        updatedFormData.append(`gallery[${index}]`, file);
      });
    }

    try {
      await dispatch(updateAgent({ id: agent.id, updatedAgent: updatedFormData })).unwrap();

      fetchData();
      closeModal();
    } catch (error: any) {
      showToast(error.message || "Failed to update agent", "error");
    }
  };
  if (!modalOpen) return null;

return (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">Edit Agent</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <label className="block font-medium">Name:</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded" placeholder="Enter Name" />

          <label className="block font-medium">Role:</label>
          <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full border p-2 rounded" placeholder="Enter Role" />

          <label className="block font-medium">Description:</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" placeholder="Enter Description" />

          <label className="block font-medium">Email:</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border p-2 rounded" placeholder="Enter Email" />

          <label className="block font-medium">Phone:</label>
          <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border p-2 rounded" placeholder="Enter Phone Number" />

          {/* Social Links */}
          <label className="block font-medium">Facebook URL:</label>
          <input type="text" value={formData.sociallinks.facebook} onChange={(e) => setFormData({ ...formData, sociallinks: { ...formData.sociallinks, facebook: e.target.value } })} className="w-full border p-2 rounded" placeholder="Enter Facebook URL" />

          <label className="block font-medium">Instagram URL:</label>
          <input type="text" value={formData.sociallinks.instagram} onChange={(e) => setFormData({ ...formData, sociallinks: { ...formData.sociallinks, instagram: e.target.value } })} className="w-full border p-2 rounded" placeholder="Enter Instagram URL" />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Image Upload */}
          <label className="block font-medium">Profile Image:</label>
          {formData.image && <img src={`${API_BASE_URL}${formData.image}`} alt="Agent" className="w-full h-24 object-cover rounded-md mb-2" />}
          <input type="file" onChange={(e) => handleFileChange(e, "image")} className="w-full border p-2 rounded" />

          {/* Certificates */}
          <label className="block font-medium">Certificates:</label>
          <div className="grid grid-cols-2 gap-2">
            {formData.certificates.map((cert, index) => (
              <img key={index} src={`${API_BASE_URL}${cert}`} alt="Certificate" className="w-full h-20 object-cover rounded-md" />
            ))}
          </div>
          <input type="file" multiple onChange={(e) => handleFileChange(e, "certificates")} className="w-full border p-2 rounded" />

          {/* Gallery */}
          <label className="block font-medium">Gallery:</label>
          <div className="grid grid-cols-2 gap-2">
            {formData.gallery.map((photo, index) => (
              <img key={index} src={`${API_BASE_URL}${photo}`} alt="Gallery" className="w-full h-20 object-cover rounded-md" />
            ))}
          </div>
          <input type="file" multiple onChange={(e) => handleFileChange(e, "gallery")} className="w-full border p-2 rounded" />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-2 mt-4">
          <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
);

}
