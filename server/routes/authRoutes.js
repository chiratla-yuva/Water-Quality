import express from 'express';
import { register, login, logout, sendVerifyOtp, verifyOtp, sendResetOtp, verifyResetOtp, changePassword, getUserDetails, updateProfile, resendVerifyOtp } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();
// Authentication Routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
// Forgot Password
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/verify-reset-otp',verifyResetOtp);
// Email Verification Routes
authRouter.post('/send-verify-otp', authMiddleware, sendVerifyOtp);
authRouter.post('/resend-verify-otp', authMiddleware, resendVerifyOtp);
authRouter.post('/verify-otp', authMiddleware, verifyOtp);
// Profile
authRouter.post('/change-password', authMiddleware, changePassword);
authRouter.put('/update-profile', authMiddleware, updateProfile);
authRouter.get('/profile', authMiddleware, getUserDetails);

export default authRouter;