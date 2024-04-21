import express from "express";
import authenticate from "../middleware/auth.js";
import Users from "../models/userModel.js";
import Notifications from "../models/NotificationModel.js";

const router = express.Router();

// get userdetails like its all friends,post and other details where userid is given
router.get("/userdetails/:id", authenticate, async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await Users.findOne({
            _id: userId,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const responseData = {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profilePicture: user.profilePicture,
            friends: user.friends,
            about: user.about
        }
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
router.get("/userdetails", authenticate, async (req, res) => {
    try {
        const user = await Users.findOne({
            _id: req.user._id,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const responseData = {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profilePicture: user.profilePicture,
            friends: user.friends,
            about: user.about
        }
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
router.post("/updateuserdetails", authenticate, async (req, res) => {
    const { imgUrl, userName, about } = req.body;
    try {
        const user = await Users.findOne({
            _id: req.user._id,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //push the latest 
        user.userName = userName;
        user.about = about;
        user.profilePicture = imgUrl;
        await user.save();
        res.status(200).json({ message: "Profile picture updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// edit frined list of two user add if not in both friends list or remove if it is already there when both users userid is given
router.post("/editfriends", authenticate, async (req, res) => {
    const { user1, user2 } = req.body;
    try {
        const user1Data = await Users.findOne({
            _id: user1,
        });
        const user2Data = await Users.findOne({
            _id: user2,
        });
        if (!user1Data || !user2Data) {
            return res.status(404).json({ message: "User not found" });
        }
        //push the latest
        if (user1Data.friends.includes(user2)) {
            user1Data.friends = user1Data.friends.filter(id => id.toString() !== user2.toString());
            user2Data.friends = user2Data.friends.filter(id => id.toString() !== user1.toString());

        } else {
            user1Data.friends.push(user2);
            user2Data.friends.push(user1);
            const newNotification = new Notifications({
                sender: user2,
                receiver: user1,
                message: "has sent you a friend request",
                link: `/profile/${user2}`,
                type: "friendRequest",
            });
            await newNotification.save();
        }
        await user1Data.save();
        await user2Data.save();
        res.status(200).json({ message: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;