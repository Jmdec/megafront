import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// ✅ Create ClientProperty (NO token required)
export const addClientProperty = createAsyncThunk(
  "clientProperty/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientproperty`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast("Failed to add client property", "error");
        return rejectWithValue(errorData);
      }

      showToast("Client property added successfully", "success");
      return await response.json();
    } catch (error) {
      showToast("An error occurred while adding client property", "error");
      return rejectWithValue(error);
    }
  }
);

// ✅ Get All ClientProperties (Token required)
export const fetchClientProperties = createAsyncThunk(
  "clientProperty/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientproperty`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      return await response.json();
    } catch (error) {
      showToast("Failed to fetch client properties", "error");
      return rejectWithValue(error);
    }
  }
);

// ✅ Get Single ClientProperty (Token required)
export const fetchClientPropertyById = createAsyncThunk(
  "clientProperty/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientproperty/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Property not found");
      }

      return await response.json();
    } catch (error) {
      showToast("Failed to fetch property details", "error");
      return rejectWithValue(error);
    }
  }
);

// ✅ Update ClientProperty (Token required)
export const updateClientProperty = createAsyncThunk(
  "clientProperty/update",
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientproperty/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast("Failed to update client property", "error");
        return rejectWithValue(errorData);
      }

      showToast("Client property updated successfully", "success");
      return await response.json();
    } catch (error) {
      showToast("An error occurred while updating property", "error");
      return rejectWithValue(error);
    }
  }
);

// ✅ Update ClientProperty Status (Token required)
export const updateClientPropertyStatus = createAsyncThunk(
  "clientProperty/updateStatus",
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientproperty/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast("Failed to update status", "error");
        return rejectWithValue(errorData);
      }

      showToast("Client property status updated successfully", "success");
      return await response.json();
    } catch (error) {
      showToast("An error occurred while updating status", "error");
      return rejectWithValue(error);
    }
  }
);

// ✅ Delete ClientProperty (Token required)
export const deleteClientProperty = createAsyncThunk(
  "clientProperty/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientproperty/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      showToast("Client property deleted successfully", "success");
      return id;
    } catch (error) {
      showToast("Failed to delete client property", "error");
      return rejectWithValue(error);
    }
  }
);
