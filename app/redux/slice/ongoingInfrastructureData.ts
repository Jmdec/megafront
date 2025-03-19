import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOngoingInfrastructure,
  addOngoingInfrastructure,
  fetchOngoingInfrastructureById,
  updateOngoingInfrastructure,
  deleteOngoingInfrastructure,
} from "../services/ongoingInfrastructure";

// Define the Infrastructure interface
interface Infrastructure {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define the state interface
interface OngoingInfrastructureState {
  projects: Infrastructure[];
  selectedProject: Infrastructure | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: OngoingInfrastructureState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
};

const ongoingInfrastructureSlice = createSlice({
  name: "ongoingInfrastructure",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All Infrastructure Projects
    builder.addCase(fetchOngoingInfrastructure.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOngoingInfrastructure.fulfilled, (state, action) => {
  
      state.loading = false;
      state.projects = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchOngoingInfrastructure.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch infrastructure projects";
    });

    // Fetch Single Project by ID
    builder.addCase(fetchOngoingInfrastructureById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOngoingInfrastructureById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProject = action.payload;
    });
    builder.addCase(fetchOngoingInfrastructureById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch infrastructure project";
    });

    // Add Project
    builder.addCase(addOngoingInfrastructure.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addOngoingInfrastructure.fulfilled, (state, action) => {
      state.loading = false;
      state.projects.push(action.payload); // Add new project
    });
    builder.addCase(addOngoingInfrastructure.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add infrastructure project";
    });

    // Update Project
    builder.addCase(updateOngoingInfrastructure.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOngoingInfrastructure.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = state.projects.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    });
    builder.addCase(updateOngoingInfrastructure.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update infrastructure project";
    });

    // Delete Project
    builder.addCase(deleteOngoingInfrastructure.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOngoingInfrastructure.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = state.projects.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteOngoingInfrastructure.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete infrastructure project";
    });
  },
});

// Export reducer
export default ongoingInfrastructureSlice.reducer;
