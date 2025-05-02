import { Server } from 'socket.io';
import { createServer } from 'http';
import AgentChats from './models/Agentchats.js';
import AgentConversationLogs from './models/AgentConversationLogs.js';

export const setupSocket = (httpServer) => {
    const io = new Server(httpServer, {
      path: "/socket.io",
      cors: {
        origin: "*", // Allow any origin
        methods: ["GET", "POST"], // Specify allowed methods if needed
      }
    });
  
    io.on("connection", (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);
  
      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });
    const watchCollections = [
    { model: AgentChats, event: "AgenchatsChanged" },
    { model: AgentConversationLogs, event: "AgentConversationLogsChanged" }]

    
    watchCollections.forEach(({ model, event }) => {
        console.log(`👀 Watching collection: ${event}`);
    
        const startWatching = () => {
          const changeStream = model.watch([
            { $project: { 'fullDocument._id': 1, 'fullDocument.uid': 1, operationType: 1 } },
          ], { fullDocument: 'updateLookup' });
    
    
    
          changeStream.on("change", (change) => {
            console.log(`📢 Change detected in ${event}:`, JSON.stringify(change, null, 2));
            io.emit(event, {
              data: change,
              uid: change?.fullDocument?.uid || "unknown",
              docid: change?.fullDocument?._id || "unknown",
              operationType: change.operationType,
              document: change.fullDocument,
            });
          });
    
          changeStream.on("error", (err) => {
            console.error(`❌ Error in Change Stream (${event}):`, err);
            changeStream?.close()?.catch(() => { });
    
            // Retry after a delay
            setTimeout(() => {
              console.log(`🔄 Reconnecting Change Stream for ${event}...`);
              startWatching(); // Retry
            }, 5000); // Retry after 5 seconds
          });
    
          // Optional: listen for stream close
          changeStream.on("close", () => {
            console.warn(`⚠️ Change Stream closed for ${event}. Retrying...`);
            setTimeout(startWatching, 5000);
          });
        };
    
        startWatching();
      });
    
    };