import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { setupSocket } from "./socketsetup.js"; // Uncomment if needed
import { createServer } from "http";
import router from "./routes.js"; // Your existing routes

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 8080;
const mongodburl = "mongodb+srv://saiprasannakvs21:s1095ka@cluster0.sziwn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Update this to a valid connection string

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", router);

// ✅ Add root route to prevent ALB 503 / browser error
app.get("/", (req, res) => {
  res.send("✅ Node.js App is running and reachable!");
});

// ✅ Add health check endpoint (use this in ALB Target Group Health Check path)
app.get("/health", (req, res) => {
  res.sendStatus(200);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// MongoDB + Server startup
mongoose
  .connect(mongodburl, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("✅ MongoDB Connected");

    setupSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    
    // Still start the server without DB if needed
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running WITHOUT DB on port ${PORT}`);
    });
  });