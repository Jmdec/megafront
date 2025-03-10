import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all real estate news (No authentication required)
export const fetchRealEstateNews = createAsyncThunk(
  "realEstateNews/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateNews`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch real estate news");

      const data = await response.json();
      console.log("📌 Fetched Real Estate News:", data);
      return data || []; // Ensure fallback to an empty array
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Add a new real estate news item (Requires authentication)
export const addRealEstateNews = createAsyncThunk(
  "realEstateNews/add",
  async (newNews: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateNews`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: newNews,
      });

      if (!response.ok) throw new Error("Failed to add real estate news");

      showToast("Real estate news added successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Fetch a single real estate news item by ID (No authentication required)
export const fetchRealEstateNewsById = createAsyncThunk(
  "realEstateNews/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateNews/${id}`);

      if (!response.ok) throw new Error("Failed to fetch real estate news item");

      const data = await response.json();
      console.log(`📌 Fetched Real Estate News Item with ID ${id}:`, data);
      return data;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update a real estate news item (Requires authentication)
export const updateRealEstateNews = createAsyncThunk(
  "realEstateNews/update",
  async ({ id, updatedNews }: { id: number; updatedNews: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateNews/${id}`, {
        method: "POST", // or "PUT" if backend requires
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: updatedNews,
      });

      if (!response.ok) throw new Error("Failed to update real estate news");

      showToast("Real estate news updated successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete a real estate news item (Requires authentication)
export const deleteRealEstateNews = createAsyncThunk(
  "realEstateNews/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/realEstateNews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (!response.ok) throw new Error("Failed to delete real estate news");

      showToast("Real estate news deleted successfully", "success");
      return id; // Return the deleted news ID
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);
