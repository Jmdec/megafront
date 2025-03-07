import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all ongoing infrastructure projects
export const fetchOngoingInfrastructure = createAsyncThunk(
  "ongoingInfrastructure/fetchAll",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure`);
    const data = await response.json();

    console.log("🔹 Fetched Ongoing Infrastructure:", data); // ✅ Debugging

    return data || []; // Ensure fallback to an empty array
  }
);

// 🔹 Add a new infrastructure project
export const addOngoingInfrastructure = createAsyncThunk(
  "ongoingInfrastructure/add",
  async (newProject: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure`, {
      method: "POST",
      body: newProject,
    });

    if (!response.ok) throw new Error("Failed to add infrastructure project");

    const result = await response.json();
    console.log("✅ Added Infrastructure Project:", result);
    return result;
  }
);

// 🔹 Fetch a single infrastructure project by ID
export const fetchOngoingInfrastructureById = createAsyncThunk(
  "ongoingInfrastructure/fetchById",
  async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure/${id}`);

    if (!response.ok) throw new Error("Failed to fetch infrastructure project");

    const data = await response.json();
    console.log(`📌 Fetched Infrastructure Project with ID ${id}:`, data);
    return data;
  }
);

// 🔹 Update infrastructure project
export const updateOngoingInfrastructure = createAsyncThunk(
  "ongoingInfrastructure/update",
  async ({ id, updatedProject }: { id: number; updatedProject: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure/${id}`, {
      method: "POST", // or "PUT" if backend requires
      body: updatedProject,
    });

    if (!response.ok) throw new Error("Failed to update infrastructure project");

    const updatedData = await response.json();
    console.log(`🔄 Updated Infrastructure Project ID ${id}:`, updatedData);
    return updatedData;
  }
);

// 🔹 Delete infrastructure project
export const deleteOngoingInfrastructure = createAsyncThunk(
  "ongoingInfrastructure/delete",
  async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete infrastructure project");

    console.log(`❌ Deleted Infrastructure Project ID ${id}`);
    return id; // Return deleted project ID
  }
);
