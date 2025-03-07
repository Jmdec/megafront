import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ✅ Fetch property statistics
export const fetchPropertyStatistics = createAsyncThunk(
  "dashboard/fetchPropertyStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/property`);
    if (!response.ok) throw new Error("Failed to fetch property statistics");
    return response.json();
  }
);

// ✅ Fetch office statistics
export const fetchOfficeStatistics = createAsyncThunk(
  "dashboard/fetchOfficeStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/office`);
    if (!response.ok) throw new Error("Failed to fetch office statistics");
    return response.json();
  }
);

// ✅ Fetch agent statistics
export const fetchAgentStatistics = createAsyncThunk(
  "dashboard/fetchAgentStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/agent`);
    if (!response.ok) throw new Error("Failed to fetch agent statistics");
    return response.json();
  }
);

// ✅ Fetch seminar statistics
export const fetchSeminarStatistics = createAsyncThunk(
  "dashboard/fetchSeminarStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/seminar`);
    if (!response.ok) throw new Error("Failed to fetch seminar statistics");
    return response.json();
  }
);

// ✅ Fetch meeting statistics
export const fetchMeetingStatistics = createAsyncThunk(
  "dashboard/fetchMeetingStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/meeting`);
    if (!response.ok) throw new Error("Failed to fetch meeting statistics");
    return response.json();
  }
);

// ✅ Fetch event statistics
export const fetchEventStatistics = createAsyncThunk(
  "dashboard/fetchEventStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/event`);
    if (!response.ok) throw new Error("Failed to fetch event statistics");
    return response.json();
  }
);

// ✅ Fetch closed deal statistics
export const fetchClosedDealStatistics = createAsyncThunk(
  "dashboard/fetchClosedDealStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/closedDeal`);
    if (!response.ok) throw new Error("Failed to fetch closed deal statistics");
    return response.json();
  }
);

// ✅ Fetch real estate news statistics
export const fetchRealEstateNewsStatistics = createAsyncThunk(
  "dashboard/fetchRealEstateNewsStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/realEstateNews`);
    if (!response.ok) throw new Error("Failed to fetch real estate news statistics");
    return response.json();
  }
);

// ✅ Fetch real estate tips statistics
export const fetchRealEstateTipsStatistics = createAsyncThunk(
  "dashboard/fetchRealEstateTipsStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/realEstateTips`);
    if (!response.ok) throw new Error("Failed to fetch real estate tips statistics");
    return response.json();
  }
);

// ✅ Fetch ongoing infrastructure statistics
export const fetchOngoingInfrastructureStatistics = createAsyncThunk(
  "dashboard/fetchOngoingInfrastructureStatistics",
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/count/ongoingInfrastructure`);
    if (!response.ok) throw new Error("Failed to fetch ongoing infrastructure statistics");
    return response.json();
  }
);
