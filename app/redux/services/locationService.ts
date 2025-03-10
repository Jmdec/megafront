// src/redux/services/locationService.ts
import Cookies from "js-cookie";
import { showToast } from "@/components/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// ✅ Fetch locations (No token required)
export const fetchLocations = createAsyncThunk(
  "locations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch locations");

      const data = await response.json();
      return data;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Add location (Requires token)
export const addLocation = createAsyncThunk(
  "locations/add",
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to add location");

      const result = await response.json();
      showToast("Location added successfully", "success");
      return result;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Update location (Requires token)
export const updateLocation = createAsyncThunk(
  "locations/update",
  async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to update location");

      const result = await response.json();
      showToast("Location updated successfully", "success");
      return result;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete location (Requires token)
export const deleteLocation = createAsyncThunk(
  "locations/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete location");

      showToast("Location deleted successfully", "success");
      return id;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);
