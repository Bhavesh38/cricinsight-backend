import express from "express";
import authenticate from "../middleware/auth.js";
import Notifications from "../models/NotificationModel.js";

const router = express.Router();

// get all notification for current user recents notifications first
router.get("/getallnotifications", authenticate, async (req, res) => {
    try {
        const notifications = await Notifications.find({
            receiver: req.user._id,
        }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// mark the notification as read
router.get("/markasread/:id", authenticate, async (req, res) => {
    const notificationId = req.params.id;
    try {
        const notification = await Notifications.findOne({
            _id: notificationId,
        });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.read = true;
        await notification.save();
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// delete the notification
router.delete("/deletenotification/:id", authenticate, async (req, res) => {
    const notificationId = req.params.id;
    try {
        const notification = await Notifications.findOne({
            _id: notificationId,
        });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        await Notifications.deleteOne({ _id: notificationId });
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;