import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Operator"],
        default: "Operator"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyOtp: {
        type: String,
        default: ''
    },
    verifyOtpExpires: {
        type: Number,
        default: 0
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpires: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
},{ timestamps: true});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;