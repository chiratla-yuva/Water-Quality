import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
// 
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// Register
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    // Validate required fields
    if(!name || !email || !password){
        return res.status(400).json({ success: false, message: "All fields are required"});
    }
    try {
        // Check if the email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        // Save user to the database
        const savedUser = await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully"});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ success: false, message: "All fields are required"});
    }
    try {
        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            process.env.JWT_SECRET,          // Secret key
            { expiresIn: "30m" }              // Token expiration time
        );
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 30 * 60 * 1000
        });
        return res.status(200).json({ success: true , message: "Login Successful", token, 
            user: { 
                isVerified: user.isVerified, 
                role: user.role }});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}
// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV ==='production'? 'none':'strict',
        });
        return res.status(200).json({success: true, message: "Logged Out"});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}
// Send Verify Otp
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findOne({ _id: userId });
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if(user.isVerified){
            return res.status(400).json({ success: false, message: 'User already verified' });
        }
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const otpExpire = Date.now() + 10*60*1000;
        // Save Otp and expiry date
        user.verifyOtp = otp;
        user.verifyOtpExpires = otpExpire;
        await user.save();
        // Email content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`
        };
        // send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: `OTP sent successfully to the registered email ${user.email}.` });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};
// Verify Otp
export const verifyOtp = async (req, res) => {
    const userId = req.userId;
    const { verifyOtp } = req.body;
    if(!verifyOtp){
        return res.status(400).json({ success: false, message: "All fields are required"});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== verifyOtp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        if (user.verifyOtpExpires <= Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP expired. Request a new one' });
        }
        // Mark the account as verified
        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpires = 0;
        await user.save();
        return res.status(200).json({ success: true, message: 'Account Verified' });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}
// Forgot Password
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.status(400).json({ success: false, message: 'Email Required'});
    }
    try {
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(400).json({ success: false, message: 'user not found'});
        }
        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const otpExpire = Date.now() + 10*60*1000;
        user.resetOtp = otp;
        user.resetOtpExpires = otpExpire;
        await user.save();
        // Email Content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your password reset OTP is ${otp}. This OTP will expire in 10 minutes.`
        };
        // send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Reset OTP sent successfully to your email." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
//  Verify Reset OTP
export const verifyResetOtp = async (req, res) => {
    const { email, resetOtp, newPassword } = req.body;
    if (!email || !resetOtp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        if(user.resetOtp === '' || user.resetOtp != resetOtp){
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        if(user.resetOtpExpires < Date.now()){
            return res.status(400).json({ success: false, message: 'OTP has expired.' });
        }
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password and clear OTP-related fields
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpires = 0;
        await user.save();
        res.status(200).json({ success: true, message: "Password has been successfully reset" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
// Reset Password
export const changePassword = async (req, res) => {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    if(!userId || !currentPassword || !newPassword){
        return res.status(400).json({ success: false, message: 'All the fields are required' });
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        if(!(user.isVerified)){
            return res.status(400).json({ success: false, message: 'Please verify your email first' });
        }
        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
// Get User Details
export const getUserDetails = async (req, res) => {
    const userId = req.userId; // ✅ Correct way to get `userId`

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID missing" });
    }

    try {
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Update Profile
export const updateProfile = async (req, res) => {
    const userId = req.userId;
    const { name, email } = req.body;
    if (!userId || !name || !email) {
        return res.status(400).json({ success: false, message: 'All the fields are required' });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        user.name = name;
        user.email = email;
        user.isVerified = false;
        await user.save();
        return res.status(200).json({ success: true, message: 'Profile updated successfully'});
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
// Resend Verify OTP
export const resendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findOne({ _id: userId });
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if(user.isVerified){
            return res.status(400).json({ success: false, message: 'User already verified' });
        }
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const otpExpire = Date.now() + 10*60*1000;
        // Save Otp and expiry date
        user.verifyOtp = otp;
        user.verifyOtpExpires = otpExpire;
        await user.save();
        // Email content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`
        };
        // send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "OTP resend successfully." });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};
