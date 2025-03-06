import { createSlice } from "@reduxjs/toolkit";
import { fetchSeminars, addSeminar, updateSeminar, deleteSeminar } from "../services/seminarService";

interface Seminar {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

interface SeminarState {
  seminars: Seminar[];
  loading: boolean;
  error: string | null;
}

const initialState: SeminarState = {
  seminars: [],
  loading: false,
  error: null,
};
const seminarSlice = createSlice({
  name: "seminarData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 🔹 Fetch Seminars
    builder.addCase(fetchSeminars.fulfilled, (state, action) => {
      state.loading = false;
      state.seminars = Array.isArray(action.payload) ? action.payload : []; // Ensure the payload is an array
    });
    builder.addCase(fetchSeminars.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch seminars";
    });

    // 🔹 Add Seminar
    builder.addCase(addSeminar.fulfilled, (state, action) => {
      state.seminars.push(action.payload); // Append the new seminar
    });

    // 🔹 Update Seminar
    builder.addCase(updateSeminar.fulfilled, (state, action) => {
      const index = state.seminars.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.seminars[index] = action.payload; // Replace the updated seminar
      }
    });

    // 🔹 Delete Seminar
    builder.addCase(deleteSeminar.fulfilled, (state, action) => {
      state.seminars = state.seminars.filter((s) => s.id !== action.payload);
    });
  },
});


export default seminarSlice.reducer;
