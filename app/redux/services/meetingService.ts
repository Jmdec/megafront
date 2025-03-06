import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all meetings
export const fetchMeetings = createAsyncThunk("meetings/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/meeting`);
  const data = await response.json();
  return data || []; // Make sure it's always an array (fallback to empty array)
});

// 🔹 Add a new meeting
export const addMeeting = createAsyncThunk("meetings/add", async (newMeeting: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/meeting`, {
    method: "POST",
    body: newMeeting,
  });

  if (!response.ok) throw new Error("Failed to add meeting");
  return response.json(); // Returns the newly added meeting
});

// 🔹 Update meeting
export const updateMeeting = createAsyncThunk(
  "meetings/update",
  async ({ id, updatedMeeting }: { id: number; updatedMeeting: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/meeting/${id}`, {
      method: "POST",
      body: updatedMeeting,
    });

    if (!response.ok) throw new Error("Failed to update meeting");
    return response.json(); // Returns updated meeting data
  }
);

// 🔹 Delete meeting
export const deleteMeeting = createAsyncThunk("meetings/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/meeting/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete meeting");
  return id; // Return deleted meeting ID
});
