import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the interface for an infrastructure project
interface Infrastructure {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define the initial state with some projects
const initialState: Infrastructure[] = [
  {
    id: 1,
    title: "PH showcases pro-business reforms to Dutch investors",
    description:
      "The Philippine government engaged Dutch investors in a high-level business dialogue in the Netherlands, highlighting the country’s strong economic growth and investment-friendly reforms. Organized by the Department of Finance (DOF) in partnership with the Department of Trade and Industry (DTI), the Philippine Trade and Investment Center (PTIC), and the Bangko Sentral ng Pilipinas (BSP), the event gathered over 30 Dutch business and financial leaders. It was hosted by ING Bank. Finance Undersecretaries Maria Luwalhati Dorotan-Tiuseco and Domini Velasquez led the Philippine delegation, alongside DTI Undersecretary Ceferino Rodolfo and BSP Monetary Board Member Rosalia de Leon.",
    image: "/news/PH showcases.jpg",
    date: "2025-01-30",
  },
  {
    id: 2,
    title: "Filinvest Land, FILRT eye property-for-share swap agreement",
    description:
      "Property developer Filinvest Land Inc. (FLI) and Filinvest REIT Corp. (FILRT) announced plans for a P6.26-billion property-for-share swap deal. In a statement to the Philippine Stock Exchange, FLI said it would sign a property-for-share swap where it will transfer its ownership over Festival Mall-Main Mall to FILRT, in exchange for 1,626,003,316 primary common shares of FILRT at an issue price of P3.85 apiece. Festival Mall-Main Mall, which has a gross leasable area of 121,862 square meters, is located in Filinvest City, Alabang, Muntinlupa City.",
    image: "/news/Filinvest Land.jpg",
    date: "2025-01-28",
  },
];

// Create the slice
const ongoingInfrastructureSlice = createSlice({
  name: "ongoingInfrastructure",
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Infrastructure>) => {
      state.push(action.payload);
    },
    removeProject: (state, action: PayloadAction<number>) => {
      return state.filter((project) => project.id !== action.payload);
    },
    updateProject: (state, action: PayloadAction<Infrastructure>) => {
      const index = state.findIndex((project) => project.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

// Export actions
export const { addProject, removeProject, updateProject } = ongoingInfrastructureSlice.actions;

// Export reducer
export default ongoingInfrastructureSlice.reducer;
