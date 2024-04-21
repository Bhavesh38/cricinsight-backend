import mongoose from "mongoose";
const { Schema } = mongoose;

const postReportSchema = new Schema({
    reportContent: { type: String, required: true },
    reportedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const postReports = mongoose.model('postReports', postReportSchema);
export default postReports;