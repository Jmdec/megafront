import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/toast";
import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";
import { FaEllipsisV } from "react-icons/fa";

interface Agent {
  phone: string;
  email: string;
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  contacts: {
    email?: string;
    phone?: string;
  };
  sociallinks: {
    facebook?: string;
    instagram?: string;
  };
  certificates: string[];
  gallery: string[];
}

export default function AgentPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedData = data.map((agent) => ({
          ...agent,
          sociallinks: {
            facebook: agent.facebook || null,
            instagram: agent.instagram || null,
          },
          certificates: typeof agent.certificates === "string" ? JSON.parse(agent.certificates) : [],
          gallery: typeof agent.gallery === "string" ? JSON.parse(agent.gallery) : [],
        }));

        setAgents(formattedData);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };
  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDeleteAgent = async () => {
    if (agentToDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/agent/${agentToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchAgents();
          showToast("Agent deleted successfully", "success");
        }
      } catch (error) {
        console.error("Error deleting agent:", error);
      }
      setDeleteModalOpen(false);
    }
  };

  const columns = [
    { name: "Name", selector: (row: Agent) => row.name || "N/A", sortable: true },
    { name: "Role", selector: (row: Agent) => row.role || "N/A", sortable: true },
    {
      name: "Image",
      cell: (row: Agent) =>
        row.image ? <img src={`${API_BASE_URL}${row.image}`} alt={row.name} className="w-12 h-12 rounded-full" /> : "No Image",
      sortable: false,
    },
    { name: "Description", selector: (row: Agent) => row.description || "N/A", sortable: false },
 {
  name: "Contacts",
  cell: (row: Agent) => (
    <div>
      <p>Email: {row.email || "N/A"}</p>
      <p>Phone: {row.phone || "N/A"}</p>
    </div>
  ),
  sortable: false,
},

    {
      name: "Social Links",
      cell: (row: Agent) => (
        <div>
          {row.sociallinks?.facebook && (
            <a href={row.sociallinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Facebook
            </a>
          )}
          {row.sociallinks?.instagram && (
            <a href={row.sociallinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 underline ml-2">
              Instagram
            </a>
          )}
        </div>
      ),
      sortable: false,
    },
   {
  name: "Certificates",
  cell: (row: Agent) => {
    const certificates = typeof row.certificates === "string" ? JSON.parse(row.certificates) : [];
    return (
      <div className="flex gap-2">
        {certificates.length > 0 ? (
          certificates.map((cert: string, index: number) => (
            <img key={index} src={`${API_BASE_URL}${cert}`} alt={`Certificate ${index + 1}`} className="w-10 h-10 rounded-md" />
          ))
        ) : (
          <p>No Certificates</p>
        )}
      </div>
    );
  },
  sortable: false,
},
{
  name: "Gallery",
  cell: (row: Agent) => {
    const gallery = typeof row.gallery === "string" ? JSON.parse(row.gallery) : [];
    return (
      <div className="flex gap-2">
        {gallery.length > 0 ? (
          gallery.map((photo: string, index: number) => (
            <img key={index} src={`${API_BASE_URL}${photo}`} alt={`Gallery ${index + 1}`} className="w-10 h-10 rounded-md" />
          ))
        ) : (
          <p>No Images</p>
        )}
      </div>
    );
  },
  sortable: false,
},


   {
  name: "Actions",
  right: true,
  cell: (row: Agent) => (
    <div className="relative">
      <button
        onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <FaEllipsisV />
      </button>

      {openMenu === row.id && (
        <div
          className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50"
        >
          <button
            onClick={() => {
              setEditingAgent(row);
              setIsEditModalOpen(true);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setAgentToDelete(row);
              setDeleteModalOpen(true);
              setOpenMenu(null); // Close menu on delete click
            }}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  ),
}

  ];

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Agent Management</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add Agent
        </button>
      </div>

      <DataTable columns={columns} data={agents} pagination highlightOnHover striped />

      <AddModal modalOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} fetchData={fetchAgents} />
{editingAgent && (
  <EditModal 
    modalOpen={isEditModalOpen} 
    closeModal={() => setIsEditModalOpen(false)} 
    agent={editingAgent}  // 🔹 Ensure we pass 'agent' instead of 'item'
    fetchData={fetchAgents} 
  />
)}


      {deleteModalOpen && agentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete the agent "{agentToDelete.name}"?</p>
            <div className="flex justify-end gap-1">
              <button onClick={handleDeleteAgent} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Confirm
              </button>
              <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
