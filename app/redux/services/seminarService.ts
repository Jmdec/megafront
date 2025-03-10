import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch Seminars (No authentication required)
export const fetchSeminars = createAsyncThunk("seminars/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seminar`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch seminars");

    return response.json();
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});

// 🔹 Add Seminar (Requires authentication)
export const addSeminar = createAsyncThunk("seminars/add", async (seminarData: FormData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seminar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: seminarData,
    });

    if (!response.ok) throw new Error("Failed to add seminar");

    showToast("Seminar added successfully", "success");
    return response.json();
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});

// 🔹 Update Seminar (Requires authentication)
export const updateSeminar = createAsyncThunk(
  "seminars/update",
  async ({ id, updatedSeminar }: { id: number; updatedSeminar: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/seminar/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: updatedSeminar,
      });

      if (!response.ok) throw new Error("Failed to update seminar");

      showToast("Seminar updated successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete Seminar (Requires authentication)
export const deleteSeminar = createAsyncThunk("seminars/delete", async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seminar/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });

    if (!response.ok) throw new Error("Failed to delete seminar");

    showToast("Seminar deleted successfully", "success");
    return id; // Return deleted seminar ID
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});
