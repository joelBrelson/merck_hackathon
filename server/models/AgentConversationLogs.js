
import mongoose, { Schema, Document } from "mongoose";


const datasetSchema = new mongoose.Schema({
  chatname: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
  active_request: { type: Boolean, default: false },
  email: { type: String, required: true },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  conversation: { type: Array, default: [] },
});

const AgentConversationLogs = mongoose.model("AgentConversationLogs", datasetSchema, "AgentConversationLogs");
export default AgentConversationLogs;
