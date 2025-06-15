import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connection configuration
const mongoOptions = {
  // useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  retryWrites: true,
  retryReads: true
};

// Track connection state
let isConnected = false;
let retryAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5000; // 5 seconds between retries

// Connection error handler
const handleConnectionError = (error) => {
  console.error('MongoDB connection error:', error.message);
  isConnected = false;
  
  if (retryAttempts < MAX_RETRY_ATTEMPTS) {
    retryAttempts++;
    console.log(`Retrying connection (attempt ${retryAttempts}/${MAX_RETRY_ATTEMPTS})...`);
    setTimeout(connectWithRetry, RETRY_DELAY_MS);
  } else {
    console.error('Max retry attempts reached. Please check your MongoDB configuration.');
    process.exit(1);
  }
};

// Successful connection handler
const handleConnectionSuccess = () => {
  isConnected = true;
  retryAttempts = 0;
  console.log('MongoDB connected successfully');
};

// Connection retry logic
const connectWithRetry = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    handleConnectionSuccess();
  } catch (error) {
    handleConnectionError(error);
  }
};

// Event listeners for connection monitoring
const setupEventListeners = () => {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
    isConnected = true;
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err.message);
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
    isConnected = false;
    // Attempt to reconnect
    if (!isConnected) {
      connectWithRetry();
    }
  });

  mongoose.connection.on('reconnected', () => {
    console.log('Mongoose reconnected to DB');
    isConnected = true;
  });

  // Close the Mongoose connection when the Node process ends
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
  });
};

// Main DB connection function
const db = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB connection URI not configured');
    }

    console.log('Initializing MongoDB connection...');
    setupEventListeners();
    await connectWithRetry();
    
    return mongoose.connection;
  } catch (error) {
    console.error('Initial MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Utility function to check connection status
export const checkDBConnection = () => {
  return isConnected;
};

export default db;