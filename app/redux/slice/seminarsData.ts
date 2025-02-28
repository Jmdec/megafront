import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the interface for a seminar
interface Seminar {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define the initial state with some seminars
const initialState: Seminar[] = [
  {
    id: 1,
    title: "Smart Investing",
    description:
      "Grow your wealth confidently with Smart Investing at Security Bank. Whether you're a beginner or a seasoned investor, our expert-managed portfolios, diverse investment options, and personalized financial guidance help you achieve your financial goals.",
    image: "/seminars/Smart Investing.jpg",
    date: "2024-12-05",
  },
  {
    id: 2,
    title: "Facebook Boosting Seminar",
    description:
      "Maximize your reach on Facebook! Learn expert strategies on ad targeting, budget optimization, and content creation. Perfect for business owners and marketers looking to turn clicks into customers.",
    image: "/seminars/Level Up Your Marketing.jpg",
    date: "2025-01-19",
  },
];

// Create the slice
const seminarsSlice = createSlice({
  name: "seminars",
  initialState,
  reducers: {
    addSeminar: (state, action: PayloadAction<Seminar>) => {
      state.push(action.payload);
    },
    removeSeminar: (state, action: PayloadAction<number>) => {
      return state.filter((seminar) => seminar.id !== action.payload);
    },
    updateSeminar: (state, action: PayloadAction<Seminar>) => {
      const index = state.findIndex((seminar) => seminar.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

// Export actions
export const { addSeminar, removeSeminar, updateSeminar } = seminarsSlice.actions;

// Export reducer
export default seminarsSlice.reducer;
