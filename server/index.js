import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { setupSocket } from "./socketsetup.js"; // Uncomment if you have a socket setup
import { createServer } from "http";
import router from "./routes.js"; // Import your routes if you have any

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 8080;
const mongodburl = "mongodb+srv://saiprasannakvs21:s1095ka@cluster0.sziwn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", router);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// MongoDB + Server startup
mongoose
  .connect(mongodburl, { serverSelectionTimeoutMS: 5000, })
  .then(() => {
    console.log("✅ MongoDB Connected");

    setupSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
  });

