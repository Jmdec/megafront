import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const getAuthToken = () => Cookies.get("auth_token");

// 🔹 Update property inquiry status (with token)
export const updatePropertyInquiryStatus = createAsyncThunk(
  "propertyInquiries/updateStatus",
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      console.log("📡 Data being sent to API:", { id, status });

      const response = await fetch(`${API_BASE_URL}/api/propertyinquiry/status`, {
        method: "PUT", // Use PUT to update status
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`, // Apply token here
        },
        body: JSON.stringify({ id, status }), // Send id and status as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to update property inquiry status");
      }

      const data = await response.json();
      console.log("✅ Response Data from API:", data);

      showToast("Property inquiry status updated successfully", "success");

      return data; // Return the updated data
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Fetch all property inquiries (with token)
export const fetchPropertyInquiries = createAsyncThunk(
  "propertyInquiries/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propertyinquiry`, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${getAuthToken()}`, // Apply token here
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property inquiries");
      }

      const data = await response.json();
      return data || []; // Ensure fallback to an empty array
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Add property inquiry (no token needed)
export const addPropertyInquiry = createAsyncThunk(
  "propertyInquiries/add",
  async (
    newInquiry: {
      propertyId: number;  // Send as camelCase
      property: string;
      name: string;
      email: string;
      message: string;
      contactNumber: string; // Send as camelCase
      status: string; // Include the status in the newInquiry
    },
    { rejectWithValue }
  ) => {
    try {
      // Prepare the inquiryData to send
      const inquiryData = {
        propertyId: newInquiry.propertyId,  // Send as camelCase from frontend
        property: newInquiry.property,
        name: newInquiry.name,
        email: newInquiry.email,
        message: newInquiry.message,
        contactNumber: newInquiry.contactNumber, // Send as camelCase from frontend
        status: newInquiry.status,  // Include status in the inquiry data
      };

      console.log("🔹 Sending request to add property inquiry:", inquiryData);

      const response = await fetch(`${API_BASE_URL}/api/propertyinquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData), // Send the data as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to add property inquiry");
      }

      const data = await response.json();
      showToast("Property inquiry added successfully!", "success");

      return data; // Return the response data
    } catch (error: any) {
      console.error("❌ Error while adding property inquiry:", error.message);
      showToast(error.message || "Unknown error", "error");

      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Fetch a single property inquiry by ID (with token)
export const fetchPropertyInquiryById = createAsyncThunk(
  "propertyInquiries/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propertyinquiry/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`, // Apply token here
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property inquiry");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Update a property inquiry (Requires authentication with token)
export const updatePropertyInquiry = createAsyncThunk(
  "propertyInquiries/update",
  async ({ id, updatedInquiry }: { id: number; updatedInquiry: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propertyinquiry/${id}`, {
        method: "PUT", // or "POST" depending on your backend's needs
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: updatedInquiry,
      });

      if (!response.ok) {
        throw new Error("Failed to update property inquiry");
      }

      showToast("Property inquiry updated successfully", "success");
      return response.json();
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 🔹 Delete a property inquiry (Requires authentication with token)
export const deletePropertyInquiry = createAsyncThunk(
  "propertyInquiries/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propertyinquiry/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete property inquiry");
      }

      showToast("Property inquiry deleted successfully", "success");
      return id; // Return deleted inquiry ID
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);
