import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTestimonials,
  addTestimonial,
  fetchTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "../services/testimonialService";

// Define Testimonial interface
interface Testimonial {
  id: number;
  name: string;
  message: string;
}

// Define the state
interface TestimonialState {
  testimonials: Testimonial[];
  selectedTestimonial: Testimonial | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TestimonialState = {
  testimonials: [],
  selectedTestimonial: null,
  loading: false,
  error: null,
};

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Testimonials
    builder.addCase(fetchTestimonials.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTestimonials.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonials = action.payload;
    });
    builder.addCase(fetchTestimonials.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch testimonials";
    });

    // Fetch Testimonial by ID
    builder.addCase(fetchTestimonialById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTestimonialById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedTestimonial = action.payload;
    });
    builder.addCase(fetchTestimonialById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch testimonial";
    });

    // Add Testimonial
    builder.addCase(addTestimonial.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonials.push(action.payload);
    });
    builder.addCase(addTestimonial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add testimonial";
    });

    // Update Testimonial
    builder.addCase(updateTestimonial.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonials = state.testimonials.map((testimonial) =>
        testimonial.id === action.payload.id ? action.payload : testimonial
      );
    });
    builder.addCase(updateTestimonial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update testimonial";
    });

    // Delete Testimonial
    builder.addCase(deleteTestimonial.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonials = state.testimonials.filter((testimonial) => testimonial.id !== action.payload);
    });
    builder.addCase(deleteTestimonial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete testimonial";
    });
  },
});

// Export reducer
export default testimonialSlice.reducer;
