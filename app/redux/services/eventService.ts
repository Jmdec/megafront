import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Function to get the auth token from cookies
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all events (No authentication required)
export const fetchEvents = createAsyncThunk("events/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/event`, {
      headers: { "Content-Type": "application/json" }, // No token required for this API
    });

    if (!response.ok) throw new Error("Failed to fetch events");

    const data = await response.json();
    console.log("📌 Events Fetched:", data);
    return data || []; // Ensure fallback to an empty array
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});

// 🔹 Add a new event (Requires authentication)
export const addEvent = createAsyncThunk("events/add", async (newEvent: FormData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/event`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`, // Add the auth token in the header
      },
      body: newEvent,
    });

    if (!response.ok) throw new Error("Failed to add event");

    showToast("Event added successfully", "success");
    return response.json(); // Return the response data (the new event)
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});

// 🔹 Update an event (Requires authentication)
export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ id, updatedEvent }: { id: number; updatedEvent: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/event/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`, // Add the auth token in the header
        },
        body: updatedEvent, // Send the updated event data (FormData)
      });

      if (!response.ok) throw new Error("Failed to update event");

      showToast("Event updated successfully", "success");
      return response.json(); // Return the response data (updated event)
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete an event (Requires authentication)
export const deleteEvent = createAsyncThunk("events/delete", async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/event/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`, // Add the auth token in the header
      },
    });

    if (!response.ok) throw new Error("Failed to delete event");

    showToast("Event deleted successfully", "success");
    return id; // Return the deleted event ID for updating the state
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});
