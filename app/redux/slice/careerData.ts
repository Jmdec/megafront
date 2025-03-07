import { createSlice } from "@reduxjs/toolkit";
import { fetchCareers, addCareer, fetchCareerById, updateCareer, deleteCareer } from "../services/careerService";

// Define Career interface
interface Career {
  id: number;
  roleName: string;
  quantity: number;
}

// Define the state
interface CareerState {
  careers: Career[];
  selectedCareer: Career | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CareerState = {
  careers: [],
  selectedCareer: null,
  loading: false,
  error: null,
};

const careerSlice = createSlice({
  name: "careers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Careers
    builder.addCase(fetchCareers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCareers.fulfilled, (state, action) => {
      state.loading = false;
      state.careers = action.payload;
    });
    builder.addCase(fetchCareers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch careers";
    });

    // Fetch Career by ID
    builder.addCase(fetchCareerById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCareerById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedCareer = action.payload;
    });
    builder.addCase(fetchCareerById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch career";
    });

    // Add Career
    builder.addCase(addCareer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addCareer.fulfilled, (state, action) => {
      state.loading = false;
      state.careers.push(action.payload);
    });
    builder.addCase(addCareer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add career";
    });

    // Update Career
    builder.addCase(updateCareer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCareer.fulfilled, (state, action) => {
      state.loading = false;
      state.careers = state.careers.map((career) =>
        career.id === action.payload.id ? action.payload : career
      );
    });
    builder.addCase(updateCareer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update career";
    });

    // Delete Career
    builder.addCase(deleteCareer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCareer.fulfilled, (state, action) => {
      state.loading = false;
      state.careers = state.careers.filter((career) => career.id !== action.payload);
    });
    builder.addCase(deleteCareer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete career";
    });
  },
});

// Export reducer
export default careerSlice.reducer;
