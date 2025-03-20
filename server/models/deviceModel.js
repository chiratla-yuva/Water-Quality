import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    device_name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Error", "Maintenance"],
        default: "Active",
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    location: {
        type: String,
        default: ""
    }
}, { timestamps: true});

const deviceModel = mongoose.models.device || mongoose.model('device', deviceSchema);

export default deviceModel;