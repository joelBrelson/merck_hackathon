
import mongoose, { Schema, Document } from "mongoose";


const datasetSchema = new mongoose.Schema({
  chatname: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Chatfiles: { type: Array, default: [] },
});


const AgentChats = mongoose.model("Agentchats", datasetSchema, "Agentchats");
export default AgentChats;