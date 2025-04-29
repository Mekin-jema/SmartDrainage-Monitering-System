import express from 'express';
import dotenv from 'dotenv';
import db from './configure/db.confige.js';
import router from './routes/index.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', router);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString() 
  });
});

// Database Connection
const startServer = async () => {
  try {
    await db();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});