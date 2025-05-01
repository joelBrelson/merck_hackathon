// db.js
import mongoose from 'mongoose';

const DB_URI = 'mongodb+srv://vedantgs:test123@cluster0.kazhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Replace <username>, <password>, and <cluster-endpoint> with actual values

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // sslValidate: false, // Optional: Disable certificate validation (for local dev)
    });
    console.log('Connected to DocumentDB successfully');
  } catch (error) {
    console.error('Failed to connect to DocumentDB:', error);
  }
};
