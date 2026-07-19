import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Compress responses
app.use(compression());

// HTTP request logger
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the TrendAfrica API 🚀"
  });
});

export default app;