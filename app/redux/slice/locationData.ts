// src/redux/slice/locationData.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchLocations, addLocation, updateLocation, deleteLocation } from "../services/locationService";

// Define Location type
interface Location {
  id: number;
  name: string;
}

// Define State
interface LocationState {
  locations: Location[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: LocationState = {
  locations: [],
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch locations
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch locations";
      })
      // Add, Update, and Delete locations
      .addCase(addLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload);
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        const index = state.locations.findIndex((loc) => loc.id === action.payload.id);
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter((loc) => loc.id !== action.payload);
      });
  },
});

export default locationSlice.reducer;
