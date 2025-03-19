import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all ongoing infrastructure projects (No authentication required)
export const fetchOngoingInfrastructure = createAsyncThunk(
  "ongoingInfrastructure/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch ongoing infrastructure projects");

      const data = await response.json();

      return data || []; // Ensure fallback to an empty array
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Add a new infrastructure project (Requires authentication)
export const addOngoingInfrastructure = createAsyncThunk(
  "ongoingInfrastructure/add",
  async (newProject: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: newProject,
      });

      if (!response.ok) throw new Error("Failed to add infrastructure project");

      showToast("Infrastructure project added successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Fetch a single infrastructure project by ID (No authentication required)
export const fetchOngoingInfrastructureById = createAsyncThunk(
  "ongoingInfrastructure/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure/${id}`);

      if (!response.ok) throw new Error("Failed to fetch infrastructure project");

      const data = await response.json();
 
      return data;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update an infrastructure project (Requires authentication)
export const updateOngoingInfrastructure = createAsyncThunk(
  "ongoingInfrastructure/update",
  async ({ id, updatedProject }: { id: number; updatedProject: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure/${id}`, {
        method: "POST", // or "PUT" if backend requires
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: updatedProject,
      });

      if (!response.ok) throw new Error("Failed to update infrastructure project");

      showToast("Infrastructure project updated successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete an infrastructure project (Requires authentication)
export const deleteOngoingInfrastructure = createAsyncThunk(
  "ongoingInfrastructure/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ongoingInfrastructure/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (!response.ok) throw new Error("Failed to delete infrastructure project");

      showToast("Infrastructure project deleted successfully", "success");
      return id; // Return the deleted project ID
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);
