import { createSlice } from "@reduxjs/toolkit";
import { fetchMeetings, addMeeting, updateMeeting, deleteMeeting } from "../services/meetingService";

interface Meeting {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

interface MeetingState {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
}

const initialState: MeetingState = {
  meetings: [],
  loading: false,
  error: null,
};

const meetingSlice = createSlice({
  name: "meetingData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 🔹 Fetch Meetings
    builder.addCase(fetchMeetings.fulfilled, (state, action) => {
      state.loading = false;
      state.meetings = Array.isArray(action.payload) ? action.payload : []; // Ensure the payload is an array
    });
    builder.addCase(fetchMeetings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch meetings";
    });

    // 🔹 Add Meeting
    builder.addCase(addMeeting.fulfilled, (state, action) => {
      state.meetings.push(action.payload); // Append the new meeting
    });

    // 🔹 Update Meeting
    builder.addCase(updateMeeting.fulfilled, (state, action) => {
      const index = state.meetings.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.meetings[index] = action.payload; // Replace the updated meeting
      }
    });

    // 🔹 Delete Meeting
    builder.addCase(deleteMeeting.fulfilled, (state, action) => {
      state.meetings = state.meetings.filter((m) => m.id !== action.payload);
    });
  },
});

export default meetingSlice.reducer;
