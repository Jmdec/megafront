import { createSlice } from "@reduxjs/toolkit";
import { fetchAgents, addAgent, fetchAgentById, updateAgent, deleteAgent } from "../services/agentService";

// Define Agent interface
interface Agent {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  description: string;
  image: string;
  contacts: {
    email?: string;
    phone?: string;
  };
  sociallinks: {
    facebook?: string;
    instagram?: string;
  };
  certificates: string[];
  gallery: string[];
}

// Define the state
interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AgentState = {
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Agents
    builder.addCase(fetchAgents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAgents.fulfilled, (state, action) => {
      state.loading = false;
      state.agents = action.payload;
    });
    builder.addCase(fetchAgents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch agents";
    });

    // Fetch Agent by ID
    builder.addCase(fetchAgentById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAgentById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedAgent = action.payload;
    });
    builder.addCase(fetchAgentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch agent";
    });

    // Add Agent
    builder.addCase(addAgent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addAgent.fulfilled, (state, action) => {
      state.loading = false;
      state.agents.push(action.payload);
    });
    builder.addCase(addAgent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add agent";
    });

    // Update Agent
    builder.addCase(updateAgent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAgent.fulfilled, (state, action) => {
      state.loading = false;
      state.agents = state.agents.map((agent) =>
        agent.id === action.payload.id ? action.payload : agent
      );
    });
    builder.addCase(updateAgent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update agent";
    });

    // Delete Agent
    builder.addCase(deleteAgent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAgent.fulfilled, (state, action) => {
      state.loading = false;
      state.agents = state.agents.filter((agent) => agent.id !== action.payload);
    });
    builder.addCase(deleteAgent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete agent";
    });
  },
});

// Export reducer
export default agentSlice.reducer;
