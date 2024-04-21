import express from 'express';
import userRoutes from "./userRoutes.js";
import profileRoutes from "./userProfileRoutes.js";
import postRoutes from "./postRoutes.js";
import notificationRoutes from "./userNotification.js";
import chatRoutes from "./chatMessageRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/profile", profileRoutes);
router.use("/post", postRoutes);
router.use("/notification", notificationRoutes);
router.use("/chat", chatRoutes);
export default router;