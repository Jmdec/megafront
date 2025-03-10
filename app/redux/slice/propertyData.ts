import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProperties,
  addProperty,
  fetchPropertyById,
  updateProperty,
  updatePropertyFeatures,
  updatePropertyAmenities,
  deleteProperty,
} from "../services/propertyService";

interface Property {
  features: string;
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  status: string;
  priceRange: string;
  lotArea: string;
  masterPlan: string;
  floors: number;
  parkingLots: number;
  amenities: string; // JSON string
  units: string; // JSON string
  developmentType: string;
  specificLocation: string | null;
}

interface PropertyState {
  properties: Property[]; // All properties
  searchResults: Property[]; // Search-specific results
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  searchResults: [], // Initialize an empty array for search results
  selectedProperty: null,
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload; // Store filtered properties in searchResults
    },
  },
  extraReducers: (builder) => {
    // ✅ Fetch All Properties
    builder.addCase(fetchProperties.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.loading = false;
      state.properties = action.payload;
    });
    builder.addCase(fetchProperties.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch properties";
    });

    // ✅ Fetch Property by ID
    builder.addCase(fetchPropertyById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPropertyById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProperty = action.payload;
    });
    builder.addCase(fetchPropertyById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch property";
    });

    // ✅ Add Property
    builder.addCase(addProperty.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addProperty.fulfilled, (state, action) => {
      state.loading = false;
      state.properties.push(action.payload);
    });
    builder.addCase(addProperty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add property";
    });

    // ✅ Update Property
    builder.addCase(updateProperty.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProperty.fulfilled, (state, action) => {
      state.loading = false;
      state.properties = state.properties.map((property) =>
        property.id === action.payload.id ? action.payload : property
      );
    });
    builder.addCase(updateProperty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update property";
    });

    // ✅ Update Property Features
    builder.addCase(updatePropertyFeatures.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePropertyFeatures.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProperty = action.payload;
    });
    builder.addCase(updatePropertyFeatures.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update features";
    });

    // ✅ Update Property Amenities
    builder.addCase(updatePropertyAmenities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePropertyAmenities.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProperty = action.payload;
    });
    builder.addCase(updatePropertyAmenities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update amenities";
    });

    // ✅ Delete Property
    builder.addCase(deleteProperty.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteProperty.fulfilled, (state, action) => {
      state.loading = false;
      state.properties = state.properties.filter((property) => property.id !== action.payload);
    });
    builder.addCase(deleteProperty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete property";
    });
  },
});

export const { setSearchResults } = propertySlice.actions; // Export the action to set search results
export default propertySlice.reducer;
