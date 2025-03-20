import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
// 
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// 
export const createUser = async (req, res) => {
    const { name, email, role } = req.body;
    if(!email || !email || !role){
        return res.status(400).json({ success: false, message: "All fields are required"});
    }
    try {
        // Check if the email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        // Generate random password
        const randomPassword = Math.random().toString(36).slice(-8);
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        // Save user to the database
        await newUser.save();
        // Email content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: newUser.email,
            subject: "Your Account Credentials",
            text: `Your account has been created successfully. Your temporary password is: ${randomPassword}. Please change it after logging in.`
        };
        // send email
        await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, message: "User created successfully. Check email for password." });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

export const getUser = async (req, res) => {
    try {
        const users = await userModel.find().select('-password -verifyOtp -verifyOtpExpires -resetOtp -resetOtpExpires -lastLogin -createdAt -updatedAt -__v');
        if (!users) {
            return res.status(404).json({ success: false, message: "Users not found" });
        }
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
