import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all real estate news
export const fetchRealEstateNews = createAsyncThunk("realEstateNews/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/realEstateNews`);
  const data = await response.json();
  return data || []; // Ensure fallback to an empty array
});

// 🔹 Add a new real estate news item
export const addRealEstateNews = createAsyncThunk(
  "realEstateNews/add",
  async (newNews: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/realEstateNews`, {
      method: "POST",
      body: newNews,
    });

    if (!response.ok) throw new Error("Failed to add real estate news");
    return response.json(); // Returns the newly added news item
  }
);

// 🔹 Fetch a single real estate news item
export const fetchRealEstateNewsById = createAsyncThunk("realEstateNews/fetchById", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/realEstateNews/${id}`);

  if (!response.ok) throw new Error("Failed to fetch real estate news item");
  return response.json();
});

// 🔹 Update real estate news
export const updateRealEstateNews = createAsyncThunk(
  "realEstateNews/update",
  async ({ id, updatedNews }: { id: number; updatedNews: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/realEstateNews/${id}`, {
      method: "POST", // or "PUT" if backend requires
      body: updatedNews,
    });

    if (!response.ok) throw new Error("Failed to update real estate news");
    return response.json(); // Returns updated news data
  }
);

// 🔹 Delete real estate news
export const deleteRealEstateNews = createAsyncThunk("realEstateNews/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/realEstateNews/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete real estate news");
  return id; // Return deleted news ID
});
