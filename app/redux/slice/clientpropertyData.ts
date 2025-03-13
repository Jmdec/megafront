import { createSlice } from "@reduxjs/toolkit";
import {
  addClientProperty,
  fetchClientProperties,
  fetchClientPropertyById,
  updateClientProperty,
  deleteClientProperty,
} from "../services/clientpropertyService";

interface ClientPropertyState {
  properties: any[]; // ✅ This is the correct property name
  selectedProperty: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientPropertyState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
};

const clientPropertySlice = createSlice({
  name: "clientProperty",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Handle Fetch All
      .addCase(fetchClientProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.client_properties;
      })
      .addCase(fetchClientProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch properties";
      })

      // ✅ Handle Fetch by ID
      .addCase(fetchClientPropertyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload.client_property;
      })
      .addCase(fetchClientPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Property not found";
      })

      // ✅ Handle Create
      .addCase(addClientProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(addClientProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties.push(action.payload.client_property);
      })
      .addCase(addClientProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add property";
      })

      // ✅ Handle Update
      .addCase(updateClientProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClientProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex(
          (prop) => prop.id === action.payload.client_property.id
        );
        if (index !== -1) {
          state.properties[index] = action.payload.client_property;
        }
      })
      .addCase(updateClientProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update property";
      })

      // ✅ Handle Delete
      .addCase(deleteClientProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClientProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.filter((prop) => prop.id !== action.payload);
      })
      .addCase(deleteClientProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete property";
      });
  },
});

export default clientPropertySlice.reducer;
