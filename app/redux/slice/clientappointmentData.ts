import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchClientAppointments, 
  addClientAppointment, 
  fetchClientAppointmentById, 
  updateClientAppointmentStatus, 
  deleteClientAppointment 
} from "../services/clientappointmentService"; // Corrected import names

interface ClientAppointment {
  id: number;
  property_id: string;
  property_name: string;
  name: string;
  email: string;
  contact_number: string;
  date: string;
  message: string;
  status: string;
  type: string; // 'Request Viewing' or 'Inquiry'
}

// Define the state
interface ClientAppointmentState {
  clientAppointments: ClientAppointment[];
  selectedClientAppointment: ClientAppointment | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ClientAppointmentState = {
  clientAppointments: [],
  selectedClientAppointment: null,
  loading: false,
  error: null,
};

const clientAppointmentSlice = createSlice({
  name: "clientAppointments",
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.clientAppointments = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all client appointments
    builder.addCase(fetchClientAppointments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClientAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.clientAppointments = action.payload;
    });
    builder.addCase(fetchClientAppointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch client appointments";
    });

    // Fetch a single client appointment by ID
    builder.addCase(fetchClientAppointmentById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClientAppointmentById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedClientAppointment = action.payload;
    });
    builder.addCase(fetchClientAppointmentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch client appointment";
    });

    // Add a new client appointment
    builder.addCase(addClientAppointment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addClientAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.clientAppointments.push(action.payload); // Action.payload will contain status and other fields
    });
    builder.addCase(addClientAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add client appointment";
    });

    // Update the status of a client appointment
    builder.addCase(updateClientAppointmentStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateClientAppointmentStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.clientAppointments = state.clientAppointments.map((appointment) =>
        appointment.id === action.payload.id ? action.payload : appointment // Update the status of the specific appointment
      );
    });
    builder.addCase(updateClientAppointmentStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update client appointment status";
    });

    // Delete a client appointment
    builder.addCase(deleteClientAppointment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteClientAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.clientAppointments = state.clientAppointments.filter((appointment) => appointment.id !== action.payload);
    });
    builder.addCase(deleteClientAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete client appointment";
    });
  },
});

// Export the reducer
export const { setAppointments } = clientAppointmentSlice.actions;
export default clientAppointmentSlice.reducer;
