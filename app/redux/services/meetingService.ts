import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all meetings (No authentication required)
export const fetchMeetings = createAsyncThunk("meetings/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/meeting`);
    if (!response.ok) throw new Error("Failed to fetch meetings");

    return response.json();
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});

// 🔹 Add a new meeting (Requires authentication)
export const addMeeting = createAsyncThunk("meetings/add", async (newMeeting: FormData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/meeting`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: newMeeting,
    });

    if (!response.ok) throw new Error("Failed to add meeting");

    showToast("Meeting added successfully", "success");
    return response.json();
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});

// 🔹 Update meeting (Requires authentication)
export const updateMeeting = createAsyncThunk(
  "meetings/update",
  async ({ id, updatedMeeting }: { id: number; updatedMeeting: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/meeting/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: updatedMeeting,
      });

      if (!response.ok) throw new Error("Failed to update meeting");

      showToast("Meeting updated successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete meeting (Requires authentication)
export const deleteMeeting = createAsyncThunk("meetings/delete", async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/meeting/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });

    if (!response.ok) throw new Error("Failed to delete meeting");

    showToast("Meeting deleted successfully", "success");
    return id; // Return deleted meeting ID
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});
