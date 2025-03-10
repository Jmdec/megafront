import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; // Import js-cookie

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAuthToken = () => Cookies.get("auth_token");

const fetchWithAuth = async (url: string, retries = 3) => {
  const token = getAuthToken();

  const fetchData = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Attach token if available
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
    return response.json();
  };

  try {
    return await fetchData();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying ${url}, attempts remaining: ${retries}`);
      return fetchWithAuth(url, retries - 1); // Retry with reduced attempts
    } else {
      throw error; // No more retries left, throw the error
    }
  }
};

// ✅ Fetch property statistics
export const fetchPropertyStatistics = createAsyncThunk(
  "dashboard/fetchPropertyStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/property`)
);

// ✅ Fetch office statistics
export const fetchOfficeStatistics = createAsyncThunk(
  "dashboard/fetchOfficeStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/office`)
);

// ✅ Fetch agent statistics
export const fetchAgentStatistics = createAsyncThunk(
  "dashboard/fetchAgentStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/agent`)
);

// ✅ Fetch seminar statistics
export const fetchSeminarStatistics = createAsyncThunk(
  "dashboard/fetchSeminarStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/seminar`)
);

// ✅ Fetch meeting statistics
export const fetchMeetingStatistics = createAsyncThunk(
  "dashboard/fetchMeetingStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/meeting`)
);

// ✅ Fetch event statistics
export const fetchEventStatistics = createAsyncThunk(
  "dashboard/fetchEventStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/event`)
);

// ✅ Fetch closed deal statistics
export const fetchClosedDealStatistics = createAsyncThunk(
  "dashboard/fetchClosedDealStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/closedDeal`)
);

// ✅ Fetch real estate news statistics
export const fetchRealEstateNewsStatistics = createAsyncThunk(
  "dashboard/fetchRealEstateNewsStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/realEstateNews`)
);

// ✅ Fetch real estate tips statistics
export const fetchRealEstateTipsStatistics = createAsyncThunk(
  "dashboard/fetchRealEstateTipsStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/realEstateTips`)
);

// ✅ Fetch ongoing infrastructure statistics
export const fetchOngoingInfrastructureStatistics = createAsyncThunk(
  "dashboard/fetchOngoingInfrastructureStatistics",
  async () => fetchWithAuth(`${API_BASE_URL}/api/count/ongoingInfrastructure`)
);
