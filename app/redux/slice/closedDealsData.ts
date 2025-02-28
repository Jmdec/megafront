import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the ClosedDeal type
interface ClosedDeal {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Initial State
const initialState: ClosedDeal[] = [
  {
    id: 1,
    title: "Closing a 1-Bedroom Unit at Avida Tower 2, 34th Floor",
    description:
      "Another successful deal closed! Congratulations to our client on securing a beautiful 1-bedroom unit at Avida Tower 2, 34th Street. At ABIC Realty, we make every transaction smooth, hassle-free, and rewarding. Looking to buy, sell, or invest? Let us help you close the best deals with confidence!",
    image: "/closedDeals/Avida Tower 2, 34th Floor.jpg",
    date: "2025-01-28",
  },
  {
    id: 2,
    title: "Closing a studio type at Elis Makati",
    description:
      "Congratulations to our client on successfully securing their new property! At ABIC Realty, we make every transaction smooth, hassle-free, and rewarding. Looking to buy, sell, or invest? Let us help you close the best deals with confidence. Your dream property is just a deal away!",
    image: "/closedDeals/Elis Makati.jpg",
    date: "2025-01-27",
  },
];

// Create Slice
const closedDealsSlice = createSlice({
  name: "closedDeals",
  initialState,
  reducers: {
    addClosedDeal: (state, action: PayloadAction<ClosedDeal>) => {
      state.push(action.payload);
    },
    removeClosedDeal: (state, action: PayloadAction<number>) => {
      return state.filter((deal) => deal.id !== action.payload);
    },
    updateClosedDeal: (state, action: PayloadAction<ClosedDeal>) => {
      const index = state.findIndex((deal) => deal.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

// Export actions and reducer
export const { addClosedDeal, removeClosedDeal, updateClosedDeal } = closedDealsSlice.actions;
export default closedDealsSlice.reducer;