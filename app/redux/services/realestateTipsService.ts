import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all real estate tips (No authentication required)
export const fetchRealEstateTips = createAsyncThunk(
  "realEstateTips/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateTips`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch real estate tips");

      const data = await response.json();
      console.log("📌 Fetched Real Estate Tips:", data);
      return data || []; // Ensure fallback to an empty array
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Add a new real estate tip (Requires authentication)
export const addRealEstateTip = createAsyncThunk(
  "realEstateTips/add",
  async (newTip: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateTips`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: newTip,
      });

      if (!response.ok) throw new Error("Failed to add real estate tip");

      showToast("Real estate tip added successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Fetch a single real estate tip by ID (No authentication required)
export const fetchRealEstateTipById = createAsyncThunk(
  "realEstateTips/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateTips/${id}`);

      if (!response.ok) throw new Error("Failed to fetch real estate tip");

      const data = await response.json();
      console.log(`📌 Fetched Real Estate Tip with ID ${id}:`, data);
      return data;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update a real estate tip (Requires authentication)
export const updateRealEstateTip = createAsyncThunk(
  "realEstateTips/update",
  async ({ id, updatedTip }: { id: number; updatedTip: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateTips/${id}`, {
        method: "POST", // or "PUT" if backend requires
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: updatedTip,
      });

      if (!response.ok) throw new Error("Failed to update real estate tip");

      showToast("Real estate tip updated successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete a real estate tip (Requires authentication)
export const deleteRealEstateTip = createAsyncThunk(
  "realEstateTips/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateTips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (!response.ok) throw new Error("Failed to delete real estate tip");

      showToast("Real estate tip deleted successfully", "success");
      return id; // Return deleted tip ID
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);
