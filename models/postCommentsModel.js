import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
    commentContent: { type: String, required: true },
    postId: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    commentedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    subComments: [{
        content: { type: String, required: true },
        commentedBy: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }]
})

const postComments = mongoose.model('postComments', commentSchema);
export default postComments;