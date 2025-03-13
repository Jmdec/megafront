import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ✅ Function to get the auth token
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all testimonials (Public)
export const fetchTestimonials = createAsyncThunk("testimonials/fetchAll", async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/testimonial`);
    if (!response.ok) throw new Error("Failed to fetch testimonials");

    const data = await response.json();
    showToast("Testimonials loaded successfully!", "success");
    console.log("✅ Fetched Testimonials:", data);
    return data || [];
  } catch (error: any) {
    showToast(error.message || "Error fetching testimonials", "error");
    throw error;
  }
});

// 🔹 Add a new testimonial (Protected)
export const addTestimonial = createAsyncThunk(
  "testimonials/add",
  async (newTestimonial: { name: string; message: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(newTestimonial),
      });

      if (!response.ok) throw new Error("Failed to add testimonial");
      const data = await response.json();

      showToast("Testimonial added successfully!", "success");
      return data;
    } catch (error: any) {
      showToast(error.message || "Error adding testimonial", "error");
      throw error;
    }
  }
);

// 🔹 Fetch a single testimonial by ID (Public)
export const fetchTestimonialById = createAsyncThunk("testimonials/fetchById", async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/testimonial/${id}`);

    if (!response.ok) throw new Error("Failed to fetch testimonial");
    const data = await response.json();

    showToast("Testimonial details loaded!", "success");
    return data;
  } catch (error: any) {
    showToast(error.message || "Error fetching testimonial", "error");
    throw error;
  }
});

// 🔹 Update testimonial (Protected)
export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async ({ id, updatedTestimonial }: { id: number; updatedTestimonial: { name: string; message: string } }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonial/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(updatedTestimonial),
      });

      if (!response.ok) throw new Error("Failed to update testimonial");
      const data = await response.json();

      showToast("Testimonial updated successfully!", "success");
      return data;
    } catch (error: any) {
      showToast(error.message || "Error updating testimonial", "error");
      throw error;
    }
  }
);

// 🔹 Delete testimonial (Protected)
export const deleteTestimonial = createAsyncThunk("testimonials/delete", async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/testimonial/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete testimonial");

    showToast("Testimonial deleted successfully!", "success");
    return id;
  } catch (error: any) {
    showToast(error.message || "Error deleting testimonial", "error");
    throw error;
  }
});
