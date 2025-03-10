import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; // Import Cookies for token
import { showToast } from "@/components/toast"; // Import toast

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Function to get the auth token
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all agents
export const fetchAgents = createAsyncThunk("agents/fetchAll", async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agent`);
    if (!response.ok) throw new Error("Failed to fetch agents");

    const data = await response.json();
    return data.map((agent: any) => ({
      ...agent,
      sociallinks: {
        facebook: agent.facebook || null,
        instagram: agent.instagram || null,
      },
      certificates: typeof agent.certificates === "string" ? JSON.parse(agent.certificates) : [],
      gallery: typeof agent.gallery === "string" ? JSON.parse(agent.gallery) : [],
    }));
  } catch (error: any) {
    showToast(error.message, "error"); // ✅ Toast for error
    throw error;
  }
});

// 🔹 Add a new agent (Protected)
export const addAgent = createAsyncThunk("agents/add", async (newAgent: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agent`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`, // ✅ Include token
      },
      body: newAgent,
    });

    if (!response.ok) throw new Error("Failed to add agent");

    const result = await response.json();
    showToast("Agent added successfully", "success"); // ✅ Toast for success
    return result;
  } catch (error: any) {
    showToast(error.message, "error"); // ✅ Toast for error
    throw error;
  }
});

// 🔹 Fetch a single agent by ID
export const fetchAgentById = createAsyncThunk("agents/fetchById", async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agent/${id}`);
    if (!response.ok) throw new Error("Failed to fetch agent");

    const agent = await response.json();
    showToast("Agent details loaded", "success"); // ✅ Toast for success
    return agent;
  } catch (error: any) {
    showToast(error.message, "error"); // ✅ Toast for error
    throw error;
  }
});

// 🔹 Update an agent (Protected)
export const updateAgent = createAsyncThunk(
  "agents/update",
  async ({ id, updatedAgent }: { id: number; updatedAgent: FormData }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/${id}`, {
        method: "POST", // Or "PUT" if backend requires
        headers: {
          Authorization: `Bearer ${getAuthToken()}`, // ✅ Include token
        },
        body: updatedAgent,
      });

      if (!response.ok) throw new Error("Failed to update agent");

      const result = await response.json();
      showToast("Agent updated successfully", "success"); // ✅ Toast for success
      return result;
    } catch (error: any) {
      showToast(error.message, "error"); // ✅ Toast for error
      throw error;
    }
  }
);

// 🔹 Delete an agent (Protected)
export const deleteAgent = createAsyncThunk("agents/delete", async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agent/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`, // ✅ Include token
      },
    });

    if (!response.ok) throw new Error("Failed to delete agent");

    showToast("Agent deleted successfully", "success"); // ✅ Toast for success
    return id;
  } catch (error: any) {
    showToast(error.message, "error"); // ✅ Toast for error
    throw error;
  }
});
