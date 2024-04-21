import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, default: '' },
    about: { type: String, default: '' },
    profilePicture: { type: String, default: 'http://wiki.snoutslouts.org/images/8/89/Sample_profile_pic.jpg' },
    lastSeen: { type: Date, default: Date.now },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    notifications: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Notifications' }],
    createdAt: { type: Date, default: Date.now },
})


const Users = mongoose.model('Users', userSchema);

export default Users;