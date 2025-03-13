import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast"; // ✅ Import showToast

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all videos (No authentication required)
export const fetchVideos = createAsyncThunk(
  "video/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/video`);
      if (!response.ok) throw new Error("Failed to fetch videos");

      const data = await response.json();
      console.log("🔹 Fetched Videos:", data);
      return data || [];
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Add a new video (Requires authentication)
export const addVideo = createAsyncThunk(
  "video/add",
  async (newVideo: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/video`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${getAuthToken()}` },
        body: newVideo,
      });

      if (!response.ok) throw new Error("Failed to add video");

      const result = await response.json();
      showToast("Video added successfully!", "success");
      return result;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Fetch a single video by ID (No authentication required)
export const fetchVideoById = createAsyncThunk(
  "video/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/video/${id}`);
      if (!response.ok) throw new Error("Failed to fetch video");

      const data = await response.json();
      console.log(`📌 Fetched Video with ID ${id}:`, data);
      return data;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update a video (Requires authentication)
export const updateVideo = createAsyncThunk(
  "video/update",
  async ({ id, updatedVideo }: { id: number; updatedVideo: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/video/${id}`, {
        method: "POST", // or "PUT" if backend requires
        headers: { "Authorization": `Bearer ${getAuthToken()}` },
        body: updatedVideo,
      });

      if (!response.ok) throw new Error("Failed to update video");

      const updatedData = await response.json();
      showToast(`🔄 Video ID ${id} updated successfully!`, "success");
      return updatedData;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete a video (Requires authentication)
export const deleteVideo = createAsyncThunk(
  "video/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/video/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getAuthToken()}` },
      });

      if (!response.ok) throw new Error("Failed to delete video");

      showToast(` Video ID ${id} deleted successfully!`, "success");
      return id;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);
