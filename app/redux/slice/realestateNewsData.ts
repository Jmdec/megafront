import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRealEstateNews,
  addRealEstateNews,
  fetchRealEstateNewsById,
  updateRealEstateNews,
  deleteRealEstateNews,
} from "../services/realestateNewsService";

// Define the News interface
interface News {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define the state interface
interface RealEstateNewsState {
  news: News[];
  selectedNews: News | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RealEstateNewsState = {
  news: [],
  selectedNews: null,
  loading: false,
  error: null,
};

const realEstateNewsSlice = createSlice({
  name: "realEstateNews",
  initialState,
  reducers: {}, // No extra reducers needed for now
  extraReducers: (builder) => {
    // Fetch All News
    builder.addCase(fetchRealEstateNews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRealEstateNews.fulfilled, (state, action) => {
      state.loading = false;
      state.news = action.payload;
    });
    builder.addCase(fetchRealEstateNews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch real estate news";
    });

    // Fetch Single News by ID
    builder.addCase(fetchRealEstateNewsById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRealEstateNewsById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedNews = action.payload;
    });
    builder.addCase(fetchRealEstateNewsById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch news item";
    });

    // Add News
    builder.addCase(addRealEstateNews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addRealEstateNews.fulfilled, (state, action) => {
      state.loading = false;
      state.news.push(action.payload); // Add new news item
    });
    builder.addCase(addRealEstateNews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add real estate news";
    });

    // Update News
    builder.addCase(updateRealEstateNews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateRealEstateNews.fulfilled, (state, action) => {
      state.loading = false;
      state.news = state.news.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    });
    builder.addCase(updateRealEstateNews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update real estate news";
    });

    // Delete News
    builder.addCase(deleteRealEstateNews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteRealEstateNews.fulfilled, (state, action) => {
      state.loading = false;
      state.news = state.news.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteRealEstateNews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete real estate news";
    });
  },
});

// Export reducer
export default realEstateNewsSlice.reducer;
