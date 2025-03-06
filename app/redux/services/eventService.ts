import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all events
export const fetchEvents = createAsyncThunk("events/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/event`);
  const data = await response.json();
  console.log(data)
  return data || []; // Fallback to an empty array if no events are returned
});

// 🔹 Add a new event
export const addEvent = createAsyncThunk("events/add", async (newEvent: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/event`, {
    method: "POST",
    body: newEvent,
  });

  if (!response.ok) throw new Error("Failed to add event");
  return response.json(); // Return the newly added event
});

// 🔹 Update an event
export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ id, updatedEvent }: { id: number; updatedEvent: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${id}`, {
      method: "POST",
      body: updatedEvent,
    });

    if (!response.ok) throw new Error("Failed to update event");
    return response.json(); // Return the updated event data
  }
);

// 🔹 Delete an event
export const deleteEvent = createAsyncThunk("events/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/event/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete event");
  return id; // Return the deleted event ID
});
