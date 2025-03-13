import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { fetchAgents, deleteAgent } from "@/app/redux/services/agentService";
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
  const dispatch = useDispatch<any>();
  const { agents, loading } = useSelector(
    (state: RootState) => state.agentData
  );
  const [search, setSearch] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  const handleDeleteAgent = async () => {
    if (agentToDelete) {
      try {
        await dispatch(deleteAgent(agentToDelete.id)).unwrap();
      } catch (error) {
        console.error("Error deleting agent:", error);
      }
      setDeleteModalOpen(false);
    }
  };
  const filteredAgents = agents.filter((agent: Agent) =>
    [agent.name].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    {
      name: "Name",
      selector: (row: Agent) => row.name || "N/A",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row: Agent) => row.role || "N/A",
      sortable: true,
    },
    {
      name: "Image",
      cell: (row: Agent) =>
        row.image ? (
          <img
            src={`${API_BASE_URL}${row.image}`}
            alt={row.name}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          "No Image"
        ),
      sortable: false,
    },
    {
      name: "Description",
      selector: (row: Agent) => row.description || "N/A",
      sortable: false,
    },
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
            <a
              href={row.sociallinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Facebook
            </a>
          )}
          {row.sociallinks?.instagram && (
            <a
              href={row.sociallinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 underline ml-2"
            >
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
        const certificates = Array.isArray(row.certificates)
          ? row.certificates
          : typeof row.certificates === "string"
          ? JSON.parse(row.certificates)
          : [];

        return (
          <div className="flex gap-2">
            {certificates.length > 0 ? (
              certificates.map((cert: string, index: number) => (
                <img
                  key={index}
                  src={`${API_BASE_URL}${cert}`}
                  alt={`Certificate ${index + 1}`}
                  className="w-10 h-10 rounded-md"
                />
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
        const gallery = Array.isArray(row.gallery)
          ? row.gallery
          : typeof row.gallery === "string"
          ? JSON.parse(row.gallery)
          : [];

        return (
          <div className="flex gap-2">
            {gallery.length > 0 ? (
              gallery.map((photo: string, index: number) => (
                <img
                  key={index}
                  src={`${API_BASE_URL}${photo}`}
                  alt={`Gallery ${index + 1}`}
                  className="w-10 h-10 rounded-md"
                />
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
            <div className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50">
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
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Agent Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Agent
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by agent name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/4 px-4 py-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredAgents}
          pagination
          highlightOnHover
          striped
        />
      )}

      <AddModal
        modalOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        fetchData={() => dispatch(fetchAgents())}
      />
      {editingAgent && (
        <EditModal
          modalOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          agent={editingAgent}
          fetchData={() => dispatch(fetchAgents())}
        />
      )}

      {deleteModalOpen && agentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the agent "{agentToDelete.name}"?
            </p>
            <div className="flex justify-end gap-1">
              <button
                onClick={handleDeleteAgent}
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
