import { createSlice } from "@reduxjs/toolkit";
import { fetchEvents, addEvent, updateEvent, deleteEvent } from "../services/eventService"; // Adjust the path if necessary

interface EventData {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  media_type: "image" | "video";
}

interface EventState {
  events: EventData[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "eventData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 🔹 Fetch Events
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.events = action.payload; // Store fetched events
    });
    builder.addCase(fetchEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch events";
    });

    // 🔹 Add Event
    builder.addCase(addEvent.fulfilled, (state, action) => {
      state.events.push(action.payload); // Append the new event
    });

    // 🔹 Update Event
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      const index = state.events.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload; // Replace the updated event
      }
    });

    // 🔹 Delete Event
    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.events = state.events.filter((event) => event.id !== action.payload); // Remove the event
    });
  },
});

export default eventSlice.reducer;
