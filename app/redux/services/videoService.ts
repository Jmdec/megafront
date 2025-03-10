import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get the auth token from cookies
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all videos (No authentication required)
export const fetchVideos = createAsyncThunk("video/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/video`);
  const data = await response.json();

  console.log("🔹 Fetched Videos:", data); // ✅ Debugging

  return data || []; // Ensure fallback to an empty array
});

// 🔹 Add a new video (Requires authentication)
export const addVideo = createAsyncThunk("video/add", async (newVideo: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/video`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getAuthToken()}`, // Apply token in the header
    },
    body: newVideo,
  });

  if (!response.ok) throw new Error("Failed to add video");

  const result = await response.json();
  console.log("✅ Added Video:", result);
  return result;
});

// 🔹 Fetch a single video by ID (No authentication required)
export const fetchVideoById = createAsyncThunk("video/fetchById", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/video/${id}`);

  if (!response.ok) throw new Error("Failed to fetch video");

  const data = await response.json();
  console.log(`📌 Fetched Video with ID ${id}:`, data);
  return data;
});

// 🔹 Update a video (Requires authentication)
export const updateVideo = createAsyncThunk(
  "video/update",
  async ({ id, updatedVideo }: { id: number; updatedVideo: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/video/${id}`, {
      method: "POST", // or "PUT" if backend requires
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`, // Apply token in the header
      },
      body: updatedVideo,
    });

    if (!response.ok) throw new Error("Failed to update video");

    const updatedData = await response.json();
    console.log(`🔄 Updated Video ID ${id}:`, updatedData);
    return updatedData;
  }
);

// 🔹 Delete a video (Requires authentication)
export const deleteVideo = createAsyncThunk("video/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/video/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${getAuthToken()}`, // Apply token in the header
    },
  });

  if (!response.ok) throw new Error("Failed to delete video");

  console.log(`❌ Deleted Video ID ${id}`);
  return id; // Return deleted video ID
});
