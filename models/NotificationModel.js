import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    message: { type: String, required: true },
    link: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, default:''},
    createdAt: { type: Date, default: Date.now },
});

const Notifications = mongoose.model('Notifications', notificationSchema);

export default Notifications;