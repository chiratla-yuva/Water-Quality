// Import required packages
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
// Import and connect to MongoDB
import connectDB from "./config/mongodb.js";
import sensorRouter from "./routes/sensorRoutes.js";
import thresholdRouter from "./routes/thresholdRoutes.js";
connectDB();

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

// Root route for API status check
app.get('/', (req, res) => res.send("API Works"));
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/sensors', sensorRouter);
app.use('/api/thresholds', thresholdRouter);

// Start the server
app.listen(port, ()=> console.log(`Server started on Port ${port}`));