import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; // Import Cookies to fetch token
import { showToast } from "@/components/toast"; // Import toast

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Function to get token from cookies
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all careers (Public)
export const fetchCareers = createAsyncThunk("careers/fetchAll", async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/career`);
    if (!response.ok) throw new Error("Failed to fetch careers");

    const data = await response.json();

    return data || [];
  } catch (error: any) {
    showToast(error.message, "error"); // ✅ Toast for error
    throw error;
  }
});

// 🔹 Add a new career (Protected)
export const addCareer = createAsyncThunk(
  "careers/add",
  async (newCareer: { roleName: string; quantity: number }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`, // ✅ Include token
        },
        body: JSON.stringify(newCareer),
      });

      if (!response.ok) throw new Error("Failed to add career");

      const result = await response.json();
      showToast("Career added successfully", "success"); // ✅ Toast for success
      return result;
    } catch (error: any) {
      showToast(error.message, "error"); // ✅ Toast for error
      throw error;
    }
  }
);

// 🔹 Fetch a single career by ID (Public)
export const fetchCareerById = createAsyncThunk("careers/fetchById", async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/career/${id}`);

    if (!response.ok) throw new Error("Failed to fetch career");

    const career = await response.json();
    showToast("Career details loaded", "success"); // ✅ Toast for success
    return career;
  } catch (error: any) {
    showToast(error.message, "error"); // ✅ Toast for error
    throw error;
  }
});

// 🔹 Update career (Protected)
export const updateCareer = createAsyncThunk(
  "careers/update",
  async ({ id, updatedCareer }: { id: number; updatedCareer: { roleName: string; quantity: number } }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/career/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`, // ✅ Include token
        },
        body: JSON.stringify(updatedCareer),
      });

      if (!response.ok) throw new Error("Failed to update career");

      const result = await response.json();
      showToast("Career updated successfully", "success"); // ✅ Toast for success
      return result;
    } catch (error: any) {
      showToast(error.message, "error"); // ✅ Toast for error
      throw error;
    }
  }
);

// 🔹 Delete career (Protected)
export const deleteCareer = createAsyncThunk("careers/delete", async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/career/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`, // ✅ Include token
      },
    });

    if (!response.ok) throw new Error("Failed to delete career");

    showToast("Career deleted successfully", "success"); // ✅ Toast for success
    return id;
  } catch (error: any) {
    showToast(error.message, "error"); // ✅ Toast for error
    throw error;
  }
});
