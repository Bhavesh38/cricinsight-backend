import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    images: [String],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'Users' }],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PostComments'
        }
    ],
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PostReports'
        }
    ],
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const Posts = mongoose.model('Posts', postSchema);
export default Posts;