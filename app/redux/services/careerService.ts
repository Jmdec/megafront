import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fetch all careers
export const fetchCareers = createAsyncThunk("careers/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/career`);
  if (!response.ok) throw new Error("Failed to fetch careers");

  const data = await response.json();
  console.log("✅ Fetched Careers:", data);
  return data || [];
});

// Add a new career
export const addCareer = createAsyncThunk(
  "careers/add",
  async (newCareer: { roleName: string; quantity: number }) => {
    const response = await fetch(`${API_BASE_URL}/api/career`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCareer),
    });

    if (!response.ok) throw new Error("Failed to add career");
    return response.json();
  }
);

// Fetch a single career by ID
export const fetchCareerById = createAsyncThunk("careers/fetchById", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/career/${id}`);

  if (!response.ok) throw new Error("Failed to fetch career");
  return response.json();
});

// Update career
export const updateCareer = createAsyncThunk(
  "careers/update",
  async ({ id, updatedCareer }: { id: number; updatedCareer: { roleName: string; quantity: number } }) => {
    const response = await fetch(`${API_BASE_URL}/api/career/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCareer),
    });

    if (!response.ok) throw new Error("Failed to update career");
    return response.json();
  }
);

// Delete career
export const deleteCareer = createAsyncThunk("careers/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/career/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete career");
  return id;
});
