import { createSlice } from "@reduxjs/toolkit";
import {
  fetchVideos,
  addVideo,
  fetchVideoById,
  updateVideo,
  deleteVideo,
} from "../services/videoService";

// Define the Video interface
interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  location: string;
  date: string;
  views: string;
}

// Define the state interface
interface VideoState {
  videos: Video[];
  selectedVideo: Video | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: VideoState = {
  videos: [],
  selectedVideo: null,
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All Videos
    builder.addCase(fetchVideos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVideos.fulfilled, (state, action) => {
   
      state.loading = false;
      state.videos = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchVideos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch videos";
    });

    // Fetch Single Video by ID
    builder.addCase(fetchVideoById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchVideoById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedVideo = action.payload;
    });
    builder.addCase(fetchVideoById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch video";
    });

    // Add Video
    builder.addCase(addVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.videos.push(action.payload); // Add new video
    });
    builder.addCase(addVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add video";
    });

    // Update Video
    builder.addCase(updateVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.videos = state.videos.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    });
    builder.addCase(updateVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update video";
    });

    // Delete Video
    builder.addCase(deleteVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.videos = state.videos.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete video";
    });
  },
});

// Export reducer
export default videoSlice.reducer;
