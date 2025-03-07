import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Fetch all properties
export const fetchProperties = createAsyncThunk("properties/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/property`);
  if (!response.ok) throw new Error("Failed to fetch properties");

  const data = await response.json();

  return data || [];
});

// 🔹 Add a new property
export const addProperty = createAsyncThunk("properties/add", async (newProperty: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/property`, {
    method: "POST",
    body: newProperty,
  });

  if (!response.ok) throw new Error("Failed to add property");

  return response.json();
});

// 🔹 Fetch a single property by ID
export const fetchPropertyById = createAsyncThunk("properties/fetchById", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/property/${id}`);

  if (!response.ok) throw new Error("Failed to fetch property");

  return response.json();
});

// 🔹 Update a property
export const updateProperty = createAsyncThunk(
  "properties/update",
  async ({ id, updatedProperty }: { id: number; updatedProperty: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/property/updateProperty/${id}`, {
      method: "POST",
      body: updatedProperty,
    });

    if (!response.ok) throw new Error("Failed to update property");

    return response.json();
  }
);

// 🔹 Update property features
export const updatePropertyFeatures = createAsyncThunk(
  "properties/updateFeatures",
  async ({ id, updatedFeatures }: { id: number; updatedFeatures: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/property/updateFeature/${id}`, {
      method: "POST",
      body: updatedFeatures,
    });

    if (!response.ok) throw new Error("Failed to update features");

    return response.json();
  }
);

// 🔹 Update property amenities
export const updatePropertyAmenities = createAsyncThunk(
  "properties/updateAmenities",
  async ({ id, updatedAmenities }: { id: number; updatedAmenities: FormData }) => {
    const response = await fetch(`${API_BASE_URL}/api/property/updateAmenities/${id}`, {
      method: "POST",
      body: updatedAmenities,
    });

    if (!response.ok) throw new Error("Failed to update amenities");

    return response.json();
  }
);

// 🔹 Delete a property
export const deleteProperty = createAsyncThunk("properties/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/property/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete property");

  return id;
});
