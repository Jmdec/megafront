import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRealEstateTips,
  addRealEstateTip,
  fetchRealEstateTipById,
  updateRealEstateTip,
  deleteRealEstateTip,
} from "../services/realestateTipsService";

// Define the Tip interface
interface Tip {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define the state interface
interface RealEstateTipsState {
  tips: Tip[];
  selectedTip: Tip | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RealEstateTipsState = {
  tips: [],
  selectedTip: null,
  loading: false,
  error: null,
};

const realEstateTipsSlice = createSlice({
  name: "realEstateTips",
  initialState,
  reducers: {}, // No extra reducers needed for now
  extraReducers: (builder) => {
    // Fetch All Tips
    builder.addCase(fetchRealEstateTips.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRealEstateTips.fulfilled, (state, action) => {
      state.loading = false;
      state.tips = action.payload;
    });
    builder.addCase(fetchRealEstateTips.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch real estate tips";
    });

    // Fetch Single Tip by ID
    builder.addCase(fetchRealEstateTipById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRealEstateTipById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedTip = action.payload;
    });
    builder.addCase(fetchRealEstateTipById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch tip";
    });

    // Add Tip
    builder.addCase(addRealEstateTip.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addRealEstateTip.fulfilled, (state, action) => {
      state.loading = false;
      state.tips.push(action.payload); // Add new tip
    });
    builder.addCase(addRealEstateTip.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add real estate tip";
    });

    // Update Tip
    builder.addCase(updateRealEstateTip.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateRealEstateTip.fulfilled, (state, action) => {
      state.loading = false;
      state.tips = state.tips.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    });
    builder.addCase(updateRealEstateTip.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update real estate tip";
    });

    // Delete Tip
    builder.addCase(deleteRealEstateTip.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteRealEstateTip.fulfilled, (state, action) => {
      state.loading = false;
      state.tips = state.tips.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteRealEstateTip.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete real estate tip";
    });
  },
});

// Export reducer
export default realEstateTipsSlice.reducer;
