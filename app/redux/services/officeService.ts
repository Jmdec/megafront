import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all offices
export const fetchOffices = createAsyncThunk("offices/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/office`);
  const data = await response.json();


  return data || []; // Ensure fallback to an empty array
});

// 🔹 Add a new office
export const addOffice = createAsyncThunk("offices/add", async (newOffice: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/office`, {
    method: "POST",
    body: newOffice,
  });

  if (!response.ok) throw new Error("Failed to add office");

  const result = await response.json();

  return result;
});

// 🔹 Fetch a single office by ID
export const fetchOfficeById = createAsyncThunk("offices/fetchById", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/office/${id}`);

  if (!response.ok) throw new Error("Failed to fetch office");

  const data = await response.json();
 
  return data;
});

// 🔹 Update an office
export const updateOffice = createAsyncThunk(
  "offices/update",
  async ({ id, updatedOffice }: { id: number; updatedOffice: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/office/${id}`, {
      method: "POST", // or "PUT" if backend requires
      body: updatedOffice,
    });

    if (!response.ok) throw new Error("Failed to update office");

    const updatedData = await response.json();

    return updatedData;
  }
);

// 🔹 Delete an office
export const deleteOffice = createAsyncThunk("offices/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/office/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete office");

  
  return id; // Return deleted office ID
});
