import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the interface for an event
interface EventData {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  type: "image" | "video";
}

// Initial state
const initialState: EventData[] = [
  {
    id: 1,
    title: "Celebrating 5 Years of Excellence – ABIC Realty’s 5th Anniversary!",
    description:
      "ABIC Realty marks five incredible years of helping dreams come true! From finding perfect homes to building lasting investments, we've been dedicated to trust, innovation, and excellence in real estate.",
    image: "/events/5 Years of Excellence.jpg",
    date: "2024-04-20",
    type: "image",
  },
  {
    id: 2,
    title: "ABIC Realty Halloween Party – A Spooktacular Celebration!",
    description:
      "Thank you to everyone who made the ABIC Realty Halloween Party a night to remember! 🎃👻 From the creative costumes to the thrilling games and spooky vibes, this Halloween was one for the books.",
    image: "/events/Abic Realty Halloween Party.jpg",
    date: "2024-11-22",
    type: "image",
  },
  {
    id: 3,
    title: "Alea Residences Booth",
    description:
      "ABIC Realty participated in a prominent real estate exhibition held in Las Piñas City on February 1, 2025. The event provided a platform for showcasing properties and networking with industry professionals.",
    image: "/events/Alea Residences Booth.mp4",
    date: "2025-02-01",
    type: "video",
  },
  {
    id: 4,
    title: "Alea Residences Booth",
    description:
      "On February 1, 2025, ABIC Realty & Consultancy Corporation hosted a booth on Alea Residences, a mid-rise condominium development by DMCI Homes located in Las Piñas.",
    image: "/events/Alea Residences Booth.jpg",
    date: "2025-02-01",
    type: "image",
  },
];

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<EventData>) => {
      state.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<number>) => {
      return state.filter((event) => event.id !== action.payload);
    },
    updateEvent: (state, action: PayloadAction<EventData>) => {
      const index = state.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addEvent, removeEvent, updateEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
