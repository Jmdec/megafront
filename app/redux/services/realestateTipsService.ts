import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all real estate tips
export const fetchRealEstateTips = createAsyncThunk("realEstateTips/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/realEstateTips`);
  const data = await response.json();
  
  console.log("🔹 Fetched Real Estate Tips:", data); // ✅ Logs response data

  return data || []; // Ensure fallback to an empty array
});

// 🔹 Add a new real estate tip
export const addRealEstateTip = createAsyncThunk(
  "realEstateTips/add",
  async (newTip: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/realEstateTips`, {
      method: "POST",
      body: newTip,
    });

    if (!response.ok) throw new Error("Failed to add real estate tip");

    const result = await response.json();
    console.log("✅ Added Real Estate Tip:", result); // ✅ Logs added tip
    return result;
  }
);

// 🔹 Fetch a single real estate tip by ID
export const fetchRealEstateTipById = createAsyncThunk("realEstateTips/fetchById", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/realEstateTips/${id}`);

  if (!response.ok) throw new Error("Failed to fetch real estate tip");

  const data = await response.json();
  console.log(`📌 Fetched Tip with ID ${id}:`, data); // ✅ Logs fetched tip
  return data;
});

// 🔹 Update real estate tip
export const updateRealEstateTip = createAsyncThunk(
  "realEstateTips/update",
  async ({ id, updatedTip }: { id: number; updatedTip: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/realEstateTips/${id}`, {
      method: "POST", // or "PUT" if backend requires
      body: updatedTip,
    });

    if (!response.ok) throw new Error("Failed to update real estate tip");

    const updatedData = await response.json();
    console.log(`🔄 Updated Tip ID ${id}:`, updatedData); // ✅ Logs updated tip
    return updatedData;
  }
);

// 🔹 Delete real estate tip
export const deleteRealEstateTip = createAsyncThunk("realEstateTips/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/realEstateTips/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete real estate tip");

  console.log(`❌ Deleted Tip ID ${id}`); // ✅ Logs deleted tip ID
  return id; // Return deleted tip ID
});
