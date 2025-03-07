import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all closed deals
export const fetchClosedDeals = createAsyncThunk("closedDeals/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/closedDeal`);
  const data = await response.json();
  return data || []; // Ensure fallback to an empty array
});

// 🔹 Add a new closed deal
export const addClosedDeal = createAsyncThunk(
  "closedDeals/add",
  async (newClosedDeal: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/closedDeal`, {
      method: "POST",
      body: newClosedDeal,
    });

    if (!response.ok) throw new Error("Failed to add closed deal");
    return response.json(); // Returns the newly added closed deal
  }
);

// 🔹 Update closed deal
export const updateClosedDeal = createAsyncThunk(
  "closedDeals/update",
  async ({ id, updatedClosedDeal }: { id: number; updatedClosedDeal: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/closedDeal/${id}`, {
      method: "POST", // or "PUT" if backend requires
      body: updatedClosedDeal,
    });

    if (!response.ok) throw new Error("Failed to update closed deal");
    return response.json(); // Returns updated closed deal data
  }
);

// 🔹 Delete closed deal
export const deleteClosedDeal = createAsyncThunk("closedDeals/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/closedDeal/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete closed deal");
  return id; // Return deleted closed deal ID
});
