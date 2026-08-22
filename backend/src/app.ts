import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import searchRoutes from "./routes/search.routes";
import { errorHandler } from "./middleware/error.middleware";
import likeRoutes from "./routes/like.routes";
import commentRoutes from "./routes/comment.routes";
const app = express();
import followRoutes from "./routes/follow.routes";
import userRoutes from "./routes/user.routes";
import notificationRoutes from "./routes/notification.routes";
import mediaRoutes from "./routes/media.routes";

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", searchRoutes);
app.use("/api/likes", likeRoutes);  
app.use("/api", commentRoutes);
app.use("/api", followRoutes);
app.use("/api/users", userRoutes);
app.use("/api", notificationRoutes);
app.use("/api/media", mediaRoutes);
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
app.use(errorHandler);
export default app;