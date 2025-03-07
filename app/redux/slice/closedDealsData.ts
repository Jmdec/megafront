import { createSlice } from "@reduxjs/toolkit";
import { fetchClosedDeals, addClosedDeal, updateClosedDeal, deleteClosedDeal } from "../services/closedDealService";

// Define the ClosedDeal interface
interface ClosedDeal {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define the state interface
interface ClosedDealState {
  closedDeals: ClosedDeal[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ClosedDealState = {
  closedDeals: [],
  loading: false,
  error: null,
};

const closedDealSlice = createSlice({
  name: "closedDeals",
  initialState,
  reducers: {}, // No extra reducers needed for now
  extraReducers: (builder) => {
    // Fetch Closed Deals
    builder.addCase(fetchClosedDeals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClosedDeals.fulfilled, (state, action) => {
      state.loading = false;
      state.closedDeals = action.payload;
    });
    builder.addCase(fetchClosedDeals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch closed deals";
    });

    // Add Closed Deal
    builder.addCase(addClosedDeal.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addClosedDeal.fulfilled, (state, action) => {
      state.loading = false;
      state.closedDeals.push(action.payload); // Add new closed deal
    });
    builder.addCase(addClosedDeal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add closed deal";
    });

    // Update Closed Deal
    builder.addCase(updateClosedDeal.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateClosedDeal.fulfilled, (state, action) => {
      state.loading = false;
      state.closedDeals = state.closedDeals.map((deal) =>
        deal.id === action.payload.id ? action.payload : deal
      );
    });
    builder.addCase(updateClosedDeal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update closed deal";
    });

    // Delete Closed Deal
    builder.addCase(deleteClosedDeal.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteClosedDeal.fulfilled, (state, action) => {
      state.loading = false;
      state.closedDeals = state.closedDeals.filter((deal) => deal.id !== action.payload);
    });
    builder.addCase(deleteClosedDeal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete closed deal";
    });
  },
});

// Export reducer
export default closedDealSlice.reducer;
