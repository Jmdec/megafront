import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all scheduled visits (with token)
export const fetchScheduledVisits = createAsyncThunk(
  "scheduledVisits/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedulevisit`, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${getAuthToken()}`, // Add token here
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch scheduled visits");
      }

      const data = await response.json();
      return data || []; // Ensure fallback to an empty array
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Add a new scheduled visit (No need for token)
export const addScheduledVisit = createAsyncThunk(
  "scheduledVisits/add",
  async (newVisit: {
    propertyId: string;
    property: string;
    name: string;
    email: string;
    date: string;
    message: string;
    contactNumber: string;
    status: string; // Added status field
  }, { rejectWithValue }) => {
    try {

      const response = await fetch(`${API_BASE_URL}/api/schedulevisit`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", // Sending JSON
        },
        body: JSON.stringify(newVisit), // Send as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to add scheduled visit");
      }

      const data = await response.json();

      // Success Toast
      showToast("Scheduled visit added successfully!", "success");

      return data; // Return the response data
    } catch (error: any) {
      // Error Toast
      console.error("❌ Error while adding scheduled visit:", error.message);
      showToast(error.message || "Unknown error", "error");

      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Fetch a single scheduled visit by ID (with token)
export const fetchScheduledVisitById = createAsyncThunk(
  "scheduledVisits/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedulevisit/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`, // Apply token here
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch scheduled visit");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Update scheduled visit status (with token)
export const updateScheduledVisitStatus = createAsyncThunk(
  "scheduledVisits/updateStatus",
  async ({ id, status }: { id: number, status: string }, { rejectWithValue }) => {
    try {

      const response = await fetch(`${API_BASE_URL}/api/schedulevisit/status`, {
        method: "PUT", // Use PUT to update status
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`, // Apply token here
        },
        body: JSON.stringify({ id, status }), // Send id and status as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to update scheduled visit status");
      }

      const data = await response.json();
      showToast("Scheduled visit status updated successfully", "success");
      return data; // Return the response data
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Delete a scheduled visit (Requires authentication with token)
export const deleteScheduledVisit = createAsyncThunk(
  "scheduledVisits/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedulevisit/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${getAuthToken()}`, // Apply token here
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete scheduled visit");
      }

      showToast("Scheduled visit deleted successfully", "success");
      return id; // Return deleted visit ID
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);
