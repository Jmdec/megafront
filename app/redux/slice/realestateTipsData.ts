import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the interface for a real estate tip
interface Tip {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define the initial state with some tips
const initialState: Tip[] = [
  {
    id: 1,
    title: "Find the best option to pay",
    description:
      "If you have the money, by all means, do pay it in full. You’re sure to save a lot of money, which can be used to decorate your condo unit or in other important items. You also have the option to use a Pag-IBIG housing loan, but you must be a contributing member for at least 24 months straight by the time you apply. If you’re borrowing from the bank, on the other hand, do ask how flexible the payment scheme is. Some banks offer rewards for those who pay in advance or never miss a deadline. DMCI Homes also has its own in-house financing option.",
    image: "/tips/Best Option.jpg",
    date: "2025-01-31",
  },
  {
    id: 2,
    title: "Talk to a trusted real estate agent",
    description:
      "Before you do any transaction with a real estate agent, you might want to check if he/she is a licensed broker. One way you can ensure that the person you are dealing with is “legit” is to check if their name is listed on the Professional Regulation Commission (PRC) website. Also, make sure that they explain the contract well, including the fine print, payment schemes, and interest rates.",
    image: "/tips/Trusted Agent.jpg",
    date: "2025-01-31",
  },
];

// Create the slice
const realEstateTipsSlice = createSlice({
  name: "realEstateTips",
  initialState,
  reducers: {
    addTip: (state, action: PayloadAction<Tip>) => {
      state.push(action.payload);
    },
    removeTip: (state, action: PayloadAction<number>) => {
      return state.filter((tip) => tip.id !== action.payload);
    },
    updateTip: (state, action: PayloadAction<Tip>) => {
      const index = state.findIndex((tip) => tip.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

// Export actions
export const { addTip, removeTip, updateTip } = realEstateTipsSlice.actions;

// Export reducer
export default realEstateTipsSlice.reducer;
