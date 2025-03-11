import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get the auth token from cookies
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all properties (No authentication required)
export const fetchProperties = createAsyncThunk("properties/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/property`);
    if (!response.ok) throw new Error("Failed to fetch properties");

    const data = await response.json();
    return data || [];
  } catch (error: any) {
    showToast(error.message, "error"); // Show error toast
    return rejectWithValue(error.message);
  }
});

// 🔹 Add a new property (Requires authentication)
export const addProperty = createAsyncThunk("properties/add", async (newProperty: FormData, { rejectWithValue }) => {
  try {
    console.log("Sending FormData to server:", newProperty);

    const response = await fetch(`${API_BASE_URL}/api/property`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`, // Apply token in the header
      },
      body: newProperty,
    });

    if (!response.ok) throw new Error("Failed to add property");

    const result = await response.json();
    console.log("Property added successfully:", result);

    showToast("Property added successfully", "success");
    return result;
  } catch (error: any) {
    console.error("Error adding property:", error);
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});

// 🔹 Fetch a single property by ID (No authentication required)
export const fetchPropertyById = createAsyncThunk(
  "properties/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      console.log(`🔍 Fetching property with ID: ${id}`); // ✅ Log the ID being fetched

      const response = await fetch(`${API_BASE_URL}/api/property/${id}`);

      if (!response.ok) throw new Error("Failed to fetch property");

      const data = await response.json();
      console.log("✅ Fetched Property Data:", data); // ✅ Log the fetched data

      return data;
    } catch (error: any) {
      console.error("❌ Error fetching property:", error);
      showToast(error.message, "error"); // Show error toast
      return rejectWithValue(error.message);
    }
  }
);


// 🔹 Update a property (Requires authentication)
export const updateProperty = createAsyncThunk(
  "properties/update",
  async ({ id, updatedProperty }: { id: number; updatedProperty: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/property/updateProperty/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`, // Apply token in the header
        },
        body: updatedProperty,
      });

      if (!response.ok) throw new Error("Failed to update property");

      const updatedData = await response.json();
      showToast("Property updated successfully", "success");
      return updatedData;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update property features (Requires authentication)
export const updatePropertyFeatures = createAsyncThunk(
  "properties/updateFeatures",
  async ({ id, updatedFeatures }: { id: number; updatedFeatures: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/property/updateFeature/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`, // Apply token in the header
        },
        body: updatedFeatures,
      });

      if (!response.ok) throw new Error("Failed to update features");

      const updatedData = await response.json();
      showToast("Property features updated successfully", "success");
      return updatedData;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update property amenities (Requires authentication)
export const updatePropertyAmenities = createAsyncThunk(
  "properties/updateAmenities",
  async ({ id, updatedAmenities }: { id: number; updatedAmenities: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/property/updateAmenities/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`, // Apply token in the header
        },
        body: updatedAmenities,
      });

      if (!response.ok) throw new Error("Failed to update amenities");

      const updatedData = await response.json();
      showToast("Property amenities updated successfully", "success");
      return updatedData;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete a property (Requires authentication)
export const deleteProperty = createAsyncThunk("properties/delete", async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/property/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`, // Apply token in the header
      },
    });

    if (!response.ok) throw new Error("Failed to delete property");

    showToast("Property deleted successfully", "success");
    return id;
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message);
  }
});
