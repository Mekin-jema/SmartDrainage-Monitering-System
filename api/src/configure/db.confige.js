import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true,
};

let isConnected = false;
let retryAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5000;
let reconnecting = false; // <-- Prevent multiple retry loops

const connectWithRetry = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    reconnecting = false;
    await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    handleConnectionSuccess();
  } catch (error) {
    handleConnectionError(error);
  }
};

const handleConnectionSuccess = () => {
  isConnected = true;
  retryAttempts = 0;
  reconnecting = false;
  console.log('MongoDB connected successfully');
};

const handleConnectionError = (error) => {
  console.error('MongoDB connection error:', error.message);
  isConnected = false;

  if (retryAttempts < MAX_RETRY_ATTEMPTS) {
    retryAttempts++;
    reconnecting = true;
    console.log(`Retrying connection (attempt ${retryAttempts}/${MAX_RETRY_ATTEMPTS})...`);
    setTimeout(connectWithRetry, RETRY_DELAY_MS);
  } else {
    console.error('Max retry attempts reached. Please check your MongoDB configuration.');
    process.exit(1);
  }
};

const setupEventListeners = () => {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
    isConnected = true;
    reconnecting = false;
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err.message);
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
    isConnected = false;

    // Only reconnect if not already reconnecting
    if (!reconnecting) {
      reconnecting = true;
      retryAttempts = 0;
      connectWithRetry();
    }
  });

  mongoose.connection.on('reconnected', () => {
    console.log('Mongoose reconnected to DB');
    isConnected = true;
    reconnecting = false;
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
  });
};

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

export const checkDBConnection = () => {
  return isConnected;
};

export default db;
