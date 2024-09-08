import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Import routes
import auth from './routes/auth.js';
import invoice from './routes/invoice.js';

// Initialize the app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', auth);
app.use('/api', invoice);

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/invoices';
connectDB(mongoURI);
    
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});