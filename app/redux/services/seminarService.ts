import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all seminars
export const fetchSeminars = createAsyncThunk("seminars/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/seminar`);
  const data = await response.json();
  return data || []; // Make sure it's always an array (fallback to empty array)
});
;


// 🔹 Add a new seminar
export const addSeminar = createAsyncThunk("seminars/add", async (newSeminar: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/seminar`, {
    method: "POST",
    body: newSeminar,
  });

  if (!response.ok) throw new Error("Failed to add seminar");
  return response.json(); // Returns the newly added seminar
});

// 🔹 Update seminar
export const updateSeminar = createAsyncThunk(
  "seminars/update",
  async ({ id, updatedSeminar }: { id: number; updatedSeminar: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/seminar/${id}`, {
      method: "POST",
      body: updatedSeminar,
    });

    if (!response.ok) throw new Error("Failed to update seminar");
    return response.json(); // Returns updated seminar data
  }
);

// 🔹 Delete seminar
export const deleteSeminar = createAsyncThunk("seminars/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/seminar/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete seminar");
  return id; // Return deleted seminar ID
});
