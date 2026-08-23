import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import searchRoutes from "./routes/search.routes";
import likeRoutes from "./routes/like.routes";
import commentRoutes from "./routes/comment.routes";
import followRoutes from "./routes/follow.routes";
import userRoutes from "./routes/user.routes";
import notificationRoutes from "./routes/notification.routes";
import mediaRoutes from "./routes/media.routes";
import repostRoutes from "./routes/repost.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Authentication
app.use("/api/auth", authRoutes);

// Posts
app.use("/api/posts", postRoutes);

// Search
app.use("/api", searchRoutes);

// Likes
app.use("/api/likes", likeRoutes);

// Comments
app.use("/api", commentRoutes);

// Follows
app.use("/api", followRoutes);

// Users
app.use("/api/users", userRoutes);

// Notifications
app.use("/api", notificationRoutes);

// Media
app.use("/api/media", mediaRoutes);

// Reposts
app.use("/api", repostRoutes);

// Parse URL-encoded requests
app.use(
  express.urlencoded({
    extended: true,
  })
);

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
    message:
      "Welcome to the TrendAfrica API 🚀",
  });
});

// Global error handler
app.use(errorHandler);

export default app;