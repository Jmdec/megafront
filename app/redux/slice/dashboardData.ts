import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPropertyStatistics,
  fetchOfficeStatistics,
  fetchAgentStatistics,
  fetchSeminarStatistics,
  fetchMeetingStatistics,
  fetchEventStatistics,
  fetchClosedDealStatistics,
  fetchRealEstateNewsStatistics,
  fetchRealEstateTipsStatistics,
  fetchOngoingInfrastructureStatistics,
} from "../services/dashboardService";

interface DashboardState {
  totalProperties: number;
  propertyStatusCounts: Record<string, number>;
  totalOffices: number;
  officeStatusCounts: Record<string, number>;
  totalAgents: number;
  agentRoleCounts: Record<string, number>;
  totalSeminars: number;
  totalMeetings: number;
  totalEvents: number;
  totalClosedDeals: number;
  totalRealEstateNews: number;
  totalRealEstateTips: number;
  totalOngoingInfrastructures: number;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  totalProperties: 0,
  propertyStatusCounts: {},
  totalOffices: 0,
  officeStatusCounts: {},
  totalAgents: 0,
  agentRoleCounts: {},
  totalSeminars: 0,
  totalMeetings: 0,
  totalEvents: 0,
  totalClosedDeals: 0,
  totalRealEstateNews: 0,
  totalRealEstateTips: 0,
  totalOngoingInfrastructures: 0,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Property Statistics
    builder.addCase(fetchPropertyStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPropertyStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalProperties = action.payload.totalProperties || 0;
      state.propertyStatusCounts = action.payload.statusCounts || {};
    });
    builder.addCase(fetchPropertyStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch property statistics";
    });

    // ✅ Office Statistics
    builder.addCase(fetchOfficeStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOfficeStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalOffices = action.payload.totalOffices || 0;
      state.officeStatusCounts = action.payload.statusCounts || {};
    });
    builder.addCase(fetchOfficeStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch office statistics";
    });

    // ✅ Agent Statistics
    builder.addCase(fetchAgentStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAgentStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalAgents = action.payload.totalAgents || 0;
      state.agentRoleCounts = action.payload.agentRoleCounts || {};
    });
    builder.addCase(fetchAgentStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch agent statistics";
    });

    // ✅ Seminar Statistics
    builder.addCase(fetchSeminarStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSeminarStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalSeminars = action.payload.totalSeminars || 0;
    });
    builder.addCase(fetchSeminarStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch seminar statistics";
    });

    // ✅ Meeting Statistics
    builder.addCase(fetchMeetingStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMeetingStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalMeetings = action.payload.totalMeetings || 0;
    });
    builder.addCase(fetchMeetingStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch meeting statistics";
    });

    // ✅ Event Statistics
    builder.addCase(fetchEventStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEventStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalEvents = action.payload.totalEvents || 0;
    });
    builder.addCase(fetchEventStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch event statistics";
    });

    // ✅ Closed Deal Statistics
    builder.addCase(fetchClosedDealStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClosedDealStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalClosedDeals = action.payload.totalcloseddeal || 0; // ✅ FIXED KEY
    });
    builder.addCase(fetchClosedDealStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch closed deal statistics";
    });

    // ✅ Real Estate News Statistics
    builder.addCase(fetchRealEstateNewsStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRealEstateNewsStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalRealEstateNews = action.payload.totalNews || 0; // ✅ FIXED KEY
    });
    builder.addCase(fetchRealEstateNewsStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch real estate news statistics";
    });

    // ✅ Real Estate Tips Statistics
    builder.addCase(fetchRealEstateTipsStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRealEstateTipsStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalRealEstateTips = action.payload.totalTips || 0; // ✅ FIXED KEY
    });
    builder.addCase(fetchRealEstateTipsStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch real estate tips statistics";
    });

    // ✅ Ongoing Infrastructure Statistics
    builder.addCase(fetchOngoingInfrastructureStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOngoingInfrastructureStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.totalOngoingInfrastructures = action.payload.totalOngoing || 0; // ✅ FIXED KEY
    });
    builder.addCase(fetchOngoingInfrastructureStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch ongoing infrastructure statistics";
    });
  },
});

export default dashboardSlice.reducer;
