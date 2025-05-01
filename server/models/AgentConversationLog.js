import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    sender: String,
    source_agent: String,
    message_type: String,
    message_text: String,
    timestamp: Date
});

const agentConversationLogSchema = new mongoose.Schema({
    active_request: Boolean,
    conversation: [conversationSchema]
}, { collection: 'AgentConversationLogs' });

export const AgentConversationLog = mongoose.model('AgentConversationLog', agentConversationLogSchema);
