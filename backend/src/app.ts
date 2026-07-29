import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";

const app = express();

// Security middleware
app.use(helmet());

// Use authentication routes
app.use("/auth", authRoutes);

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());
app.use("/api/auth", authRoutes);
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