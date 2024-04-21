import mongoose from "mongoose";
const { Schema } = mongoose;

const chatMessageSchema = new Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likedBy: [{ type: mongoose.Types.ObjectId, ref: 'Users' }],
    isEditted: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
});

const ChatMessages = mongoose.model('ChatMessages', chatMessageSchema);
export default ChatMessages;