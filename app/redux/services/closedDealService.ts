import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get the authentication token
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all closed deals (No authentication required)
export const fetchClosedDeals = createAsyncThunk("closedDeals/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/closedDeal`, {
      headers: { "Content-Type": "application/json" }, // No token needed for this
    });

    if (!response.ok) throw new Error("Failed to fetch closed deals");

    const data = await response.json();
    console.log("📌 Closed Deals Fetched:", data);
    return data || []; // Ensure fallback to an empty array
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});

// 🔹 Add a new closed deal (Requires authentication)
export const addClosedDeal = createAsyncThunk(
  "closedDeals/add",
  async (newClosedDeal: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/closedDeal`, {
        method: "POST",
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAuthToken()}` // Apply token in the header
        },
        body: newClosedDeal,
      });

      if (!response.ok) throw new Error("Failed to add closed deal");

      showToast("Closed deal added successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update closed deal (Requires authentication)
export const updateClosedDeal = createAsyncThunk(
  "closedDeals/update",
  async ({ id, updatedClosedDeal }: { id: number; updatedClosedDeal: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/closedDeal/${id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAuthToken()}` // Apply token in the header
        },
        body: updatedClosedDeal,
      });

      if (!response.ok) throw new Error("Failed to update closed deal");

      showToast("Closed deal updated successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete closed deal (Requires authentication)
export const deleteClosedDeal = createAsyncThunk("closedDeals/delete", async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/closedDeal/${id}`, {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${getAuthToken()}` // Apply token in the header
      },
    });

    if (!response.ok) throw new Error("Failed to delete closed deal");

    showToast("Closed deal deleted successfully", "success");
    return id; // Return the deleted closed deal ID
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});
