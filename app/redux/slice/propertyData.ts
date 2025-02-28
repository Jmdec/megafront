import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define Unified Data Type for All Properties
interface RealEstateProperty {
  name: string;
  location: string;
  description: string;
  image: string;
  division: string;
  buttonText: string;
  price: string;
  details: string;
  featured: string;
}

// ✅ Define State Structure
interface RealEstateState {
  properties: RealEstateProperty[];
}

// ✅ Initial State: Merged Data from All Sources
const initialState: RealEstateState = {
  properties: [
   
    {
      name: "Uptown Arts Residence",
      location: "Makati City",
      description: "Location is everything for Uptown Arts Residence, offering premium lifestyle and modern conveniences.",
      buttonText: "Discover Uptown",
      image: "/featuredbuilding/UptownArtsResidence.webp",
      division: "New",
      price: "12500000 - 14500000",
      details: "Fully furnished units available with flexible payment terms.",
      featured: "home",
    },
    {
      name: "Skyline Premier Suites",
      location: "Batangas City",
      description: "Experience luxury living with breathtaking city views and world-class amenities.",
      buttonText: "Explore More",
      image: "/featuredbuilding/SkylinePremierSuites.webp",
      division: "Under Construction",
      price: "9800000 - 11500000",
      details: "Exclusive penthouse units now available.",
      featured: "home",
    },
    
    {
      name: "9 Central Park",
      location: "Marilao, Bulacan",
      description: "No Downpayment, 0% Interest, 38 months to pay",
      buttonText: "View Details",
      image: "/featuredbuilding/CentralPark.webp",
      division: "Pre-Selling",
      price: "8000000 - 12000000",
      details: "Prime location near shopping centers and transportation hubs.",
      featured: "home",
    },
    {
      name: "Uptown Modern",
      location: "Uptown Bonifacio, Taguig City",
      description: "No Downpayment, 0% Interest, 72 months to pay",
      buttonText: "Learn More",
      image: "/featuredbuilding/UptownModern.webp",
      division: "Pre-Selling",
      price: "11000000 - 12000000",
      details: "Smart home features and eco-friendly design.",
      featured: "home",
    },
    
    // 🔹 Residential & Commercial Properties
    {
      name: "Greenfield District",
      location: "Mandaluyong City, Metro Manila",
      description: "An eco-friendly community with smart technology and pedestrian-friendly spaces.",
      buttonText: "Schedule a Visit",
      image: "/residence/GreenfieldDistrict.jpg",
      division: "Ready for Occupancy",
      price: "7500000 - 9000000",
      details: "Walking distance to business districts and malls.",
      featured: "home",
    },
    {
      name: "Arden",
      location: "Cavite",
      description: "A vibrant community with modern amenities, green spaces, and well-designed homes.",
      buttonText: "Reserve Now",
      image: "/residence/Arden.jpg",
      division: "Pre-Selling",
      price: "3900000 - 5000000",
      details: "Various lot sizes available.",
      featured: "home",
    },
    {
      name: "Capital Town",
      location: "Pampanga",
      description: "A mixed-use development featuring commercial hubs, landscaped streets, and world-class amenities.",
      buttonText: "Invest Today",
      image: "/residence/CapitalTown.jpg",
      division: "Ready for Occupancy",
      price: "8200000 - 10000000",
      details: "Business-friendly area with great investment potential.",
      featured: "home",
    },
    {
      name: "The Rise Makati",
      location: "Makati City, Metro Manila",
      description: "A cutting-edge residential tower for urban professionals near Makati’s CBD.",
      buttonText: "Get More Info",
      image: "/residence/TheRiseMakati.jpg",
      division: "New",
      price: "11500000 - 13500000",
      details: "Exclusive launch discounts available.",
      featured: "home",
    },
    {
      name: "Westside",
      location: "Entertainment City",
      description: "A world-class waterfront development featuring casinos, shopping malls, and entertainment centers.",
      buttonText: "Luxury Awaits",
      image: "/residence/Westside.jpg",
      division: "Under Construction",
      price: "14000000 - 16000000",
      details: "Resort-style living with ocean views.",
      featured: "home",
    },
  ],
};

// ✅ Create Redux Slice
const propetyDataSlice = createSlice({
  name: "propertyData",
  initialState,
  reducers: {
    addProperty: (state, action: PayloadAction<RealEstateProperty>) => {
      state.properties.push(action.payload);
    },
    removeProperty: (state, action: PayloadAction<string>) => {
      state.properties = state.properties.filter((prop) => prop.name !== action.payload);
    },
    updateProperty: (state, action: PayloadAction<RealEstateProperty>) => {
      const index = state.properties.findIndex((p) => p.name === action.payload.name);
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
    },
  },
});

// ✅ Export Actions
export const { addProperty, removeProperty, updateProperty } = propetyDataSlice.actions;

// ✅ Export Reducer
export default propetyDataSlice.reducer;
