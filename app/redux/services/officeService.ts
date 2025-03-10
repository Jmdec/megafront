import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ✅ Function to get the auth token
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all offices (Public)
export const fetchOffices = createAsyncThunk("offices/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/office`);
    const data = await response.json();

    // Handle the amenities processing
    if (Array.isArray(data)) {
      const formattedData = data.map((office) => ({
        ...office,
        amenities: typeof office.amenities === "string" ? JSON.parse(office.amenities) : office.amenities || [],
      }));
      return formattedData;
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error: any) {
    showToast(error.message, "error"); // Show error toast
    return rejectWithValue(error.message);
  }
});

// 🔹 Add a new office (Protected)
export const addOffice = createAsyncThunk("offices/add", async (newOffice: FormData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/office`, {
      method: "POST",
      body: newOffice,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) throw new Error("Failed to add office");

    const result = await response.json();
    showToast("Office added successfully", "success"); // Show success toast
    return result;
  } catch (error: any) {
    showToast(error.message, "error"); // Show error toast
    return rejectWithValue(error.message);
  }
});

// 🔹 Fetch a single office by ID (Public)
export const fetchOfficeById = createAsyncThunk("offices/fetchById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/office/${id}`);

    if (!response.ok) throw new Error("Failed to fetch office");

    const data = await response.json();
    return data;
  } catch (error: any) {
    showToast(error.message, "error"); // Show error toast
    return rejectWithValue(error.message);
  }
});

// 🔹 Update an office (Protected)
export const updateOffice = createAsyncThunk(
  "offices/update",
  async ({ id, updatedOffice }: { id: number; updatedOffice: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/office/${id}`, {
        method: "POST",  // Keep POST as per your API requirement
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: updatedOffice,
      });

      if (!response.ok) throw new Error("Failed to update office");

      const updatedData = await response.json();
      showToast("Office updated successfully", "success");
      return updatedData;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);


// 🔹 Delete an office (Protected)
export const deleteOffice = createAsyncThunk("offices/delete", async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/office/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete office");

    showToast("Office deleted successfully", "success"); // Show success toast
    return id; // Return deleted office ID
  } catch (error: any) {
    showToast(error.message, "error"); // Show error toast
    return rejectWithValue(error.message);
  }
});
