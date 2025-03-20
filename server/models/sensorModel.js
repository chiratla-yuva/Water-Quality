import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    pH: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const sensorModel = mongoose.models.sensor || mongoose.model('sensor', sensorSchema);

export default sensorModel;