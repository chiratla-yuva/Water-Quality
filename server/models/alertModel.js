import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    alert_type: {
        type: String,
        enum: ["pH", "temperature"],
        required: true
    },
    timepstamp: {
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ["Unresolved", "Resolved"],
        default: "Unresolved",
        required: true
    },
    device_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "device",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    resolved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false
    }
}, { timestamps: true});

const alertModel = mongoose.models.alert || mongoose.model('alert', alertSchema);

export default alertModel;