// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  timestamp: { type: Date, default: Date.now },
  socketId: { type: String }, // optionally track conversation per socket
});

export default mongoose.model('Message', messageSchema);
