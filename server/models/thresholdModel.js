import mongoose from "mongoose";

const thresholdSchema = new mongoose.Schema({
    pH_min: {
        type: Number,
        required: true,
        min: 0,
        max: 14
    },
    pH_max: {
        type: Number,
        required: true,
        min: 0,
        max: 14
    },
    temp_min: {
        type: Number,
        required: true
    },
    temp_max: {
        type: Number,
        required: true
    }
},{timestamps: true});

const thresholdModel = mongoose.models.threshold || mongoose.model('threshold', thresholdSchema);

export default thresholdModel;