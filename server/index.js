import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from './db.js';
import Message from './models/Message.js';
import { AgentConversationLog } from './models/AgentConversationLog.js';

const app = express();
const server = http.createServer(app);

// Configure CORS to allow connections from Vite's development server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
connectToDatabase();

// Simple endpoint to check if the server is running
app.get('/', (req, res) => {
  res.send('GlassChat API is running');
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send welcome message
  socket.emit('message', {
    id: uuidv4(),
    content: "Connection established! You're now chatting with GlassChat AI.",
    role: 'system',
    timestamp: new Date()
  });

  // Handle incoming messages
  socket.on('message', async (message, callback) => {
    console.log('Received message:', message);
  
    try {
      // 1. Create or find a conversation
      let log = await AgentConversationLog.findOne({ _id: message.conv_id });
      if (!log) {
        log = await AgentConversationLog.create({
          active_request: false,
          conversation: []
        });
      }
  
      // 2. Add user message to conversation
      log.conversation.push({
        sender: 'user',
        source_agent: 'user',
        message_type: 'generic',
        message_text: message.content,
        timestamp: new Date()
      });
      await log.save();
  
      // 3. Send to AWS API
      const awsApiResponse = await axios.post('https://8ehjwluxi4.execute-api.us-east-1.amazonaws.com/dev/uploadfunc', {
        user_input: {
          query: message.content,
          conv_id: log._id.toString()
        },
        task_name: 'synagents'
      });
  
      const responseContent = awsApiResponse.data?.response || 'No response from AWS API.';
  
      // 4. Add assistant response
      log.conversation.push({
        sender: 'agent',
        source_agent: 'synagents',
        message_type: 'generic',
        message_text: responseContent,
        timestamp: new Date()
      });
      await log.save();
  
      // 5. Emit to frontend
      socket.emit('message', {
        id: uuidv4(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date()
      });
  
      if (callback) callback();
    } catch (error) {
      console.error('Error handling message:', error);
      if (callback) callback('Error processing message');
    }
  });
  
  

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simple response generator
function generateResponse(message) {
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return "Hello! I'm GlassChat AI. How can I assist you today?";
  }
  
  if (message.toLowerCase().includes('help')) {
    return "I'd be happy to help! You can ask me questions, request information, or just chat. What would you like to know?";
  }
  
  if (message.toLowerCase().includes('feature') || message.toLowerCase().includes('do')) {
    return "I can have conversations, answer questions, provide information, and assist with various tasks. Currently, I'm a demo showing off the beautiful glassmorphism UI design.";
  }

  if (message.toLowerCase().includes('weather')) {
    return "I don't have real-time weather data in this demo, but in a full implementation, I could connect to a weather API to provide forecasts.";
  }

  return "That's an interesting message. In a complete implementation, I would connect to a more sophisticated backend to generate relevant responses. How else can I assist you with this demo?";
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});