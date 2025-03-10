import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ✅ Function to get the auth token
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Fetch all testimonials (Public)
export const fetchTestimonials = createAsyncThunk("testimonials/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/api/testimonial`);
  if (!response.ok) throw new Error("Failed to fetch testimonials");

  const data = await response.json();
  console.log("✅ Fetched Testimonials:", data);
  return data || [];
});

// 🔹 Add a new testimonial (Protected)
export const addTestimonial = createAsyncThunk(
  "testimonials/add",
  async (newTestimonial: { name: string; message: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/testimonial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(newTestimonial),
    });

    if (!response.ok) throw new Error("Failed to add testimonial");
    return response.json();
  }
);

// 🔹 Fetch a single testimonial by ID (Public)
export const fetchTestimonialById = createAsyncThunk("testimonials/fetchById", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/testimonial/${id}`);

  if (!response.ok) throw new Error("Failed to fetch testimonial");
  return response.json();
});

// 🔹 Update testimonial (Protected)
export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async ({ id, updatedTestimonial }: { id: number; updatedTestimonial: { name: string; message: string } }) => {
    const response = await fetch(`${API_BASE_URL}/api/testimonial/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(updatedTestimonial),
    });

    if (!response.ok) throw new Error("Failed to update testimonial");
    return response.json();
  }
);

// 🔹 Delete testimonial (Protected)
export const deleteTestimonial = createAsyncThunk("testimonials/delete", async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/testimonial/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete testimonial");
  return id;
});
