import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOffices,
  addOffice,
  fetchOfficeById,
  updateOffice,
  deleteOffice,
} from "../services/officeService";

interface Office {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  status: string;
  price: string;
  lotArea: string;
  amenities: string[];
}

interface OfficeState {
  offices: Office[];
  selectedOffice: Office | null;
  loading: boolean;
  error: string | null;
}

const initialState: OfficeState = {
  offices: [],
  selectedOffice: null,
  loading: false,
  error: null,
};

const officeSlice = createSlice({
  name: "offices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOffices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOffices.fulfilled, (state, action) => {
      state.loading = false;
      state.offices = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchOffices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch offices";
    });

    builder.addCase(fetchOfficeById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOfficeById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOffice = action.payload;
    });
    builder.addCase(fetchOfficeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch office";
    });

    builder.addCase(addOffice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addOffice.fulfilled, (state, action) => {
      state.loading = false;
      state.offices.push(action.payload);
    });
    builder.addCase(addOffice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add office";
    });

    builder.addCase(updateOffice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOffice.fulfilled, (state, action) => {
      state.loading = false;
      // Update the office in the list by matching the id
      state.offices = state.offices.map((office) =>
        office.id === action.payload.id ? action.payload : office
      );
      // Optionally, if you want to update selectedOffice:
      if (state.selectedOffice?.id === action.payload.id) {
        state.selectedOffice = action.payload;
      }
    });
    builder.addCase(updateOffice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update office";
    });

    builder.addCase(deleteOffice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOffice.fulfilled, (state, action) => {
      state.loading = false;
      state.offices = state.offices.filter((item) => item.id !== action.payload); // ✅ Use item.id
    });
    builder.addCase(deleteOffice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete office";
    });
  },
});

export default officeSlice.reducer;
