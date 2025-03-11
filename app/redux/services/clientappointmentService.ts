import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all client appointments (REQUIRES AUTH TOKEN)
export const fetchClientAppointments = createAsyncThunk(
  "clientAppointments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientappointments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch client appointments");

      return await response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Add a new client appointment (NO AUTH REQUIRED)
export const addClientAppointment = createAsyncThunk(
  "clientAppointments/add",
  async (
    newAppointment: {
      property_id: number;
      property_name: string;
      name: string;
      email: string;
      date: string;
      message: string;
      contact_number: string;
      status: string;
      type: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientappointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) throw new Error("Failed to add client appointment");

      showToast("Client appointment added successfully!", "success");
      return await response.json();
    } catch (error: any) {
      showToast(error.message || "Unknown error", "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Fetch a single client appointment by ID (REQUIRES AUTH TOKEN)
export const fetchClientAppointmentById = createAsyncThunk(
  "clientAppointments/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientappointments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch client appointment");

      return await response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Update client appointment status (REQUIRES AUTH TOKEN)
export const updateClientAppointmentStatus = createAsyncThunk(
  "clientAppointments/updateStatus",
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientappointments/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) throw new Error("Failed to update client appointment status");

      showToast("Client appointment status updated successfully", "success");
      return await response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Delete a client appointment (REQUIRES AUTH TOKEN)
export const deleteClientAppointment = createAsyncThunk(
  "clientAppointments/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientappointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (!response.ok) throw new Error("Failed to delete client appointment");

      showToast("Client appointment deleted successfully", "success");
      return id;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);
