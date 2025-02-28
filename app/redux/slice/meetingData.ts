import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the interface for a meeting
interface Meeting {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define the initial state with some meetings
const initialState: Meeting[] = [
  {
    id: 1,
    title: "Sales Strat Planning",
    description:
      "ABIC Realty & Consultancy Corporation conducted a dynamic and insightful sales meeting focused on enhancing strategies, performance, and market engagement. The meeting served as a platform for the sales team to discuss updates on current property listings, review sales performance, and align goals for the upcoming period.",
    image: "/meetings/Sales Strat Planning.jpg",
    date: "2024-12-02",
  },
];

// Create the slice
const meetingSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.push(action.payload);
    },
    removeMeeting: (state, action: PayloadAction<number>) => {
      return state.filter((meeting) => meeting.id !== action.payload);
    },
    updateMeeting: (state, action: PayloadAction<Meeting>) => {
      const index = state.findIndex((meeting) => meeting.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

// Export actions
export const { addMeeting, removeMeeting, updateMeeting } = meetingSlice.actions;

// Export reducer
export default meetingSlice.reducer;
