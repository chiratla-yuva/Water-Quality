import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Forgot = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        setError("");
        setMessage("");
        try {
            const response = await axios.post("http://localhost:4000/api/auth/send-reset-otp", { email });
            if (response.data.success) {
                setMessage(response.data.message);
                setStep(2);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong!");
        }
    };

    const handleResendOtp = async () => {
        setError("");
        setMessage("");
        try {
            const response = await axios.post("http://localhost:4000/api/auth/verify-reset-otp", { email });
            if (response.data.success) {
                setMessage("OTP has been resent!");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to resend OTP.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/api/auth/verify-reset-otp", { email, resetOtp: otp, newPassword: password });
            if (response.data.success) {
                setMessage("Password has been reset successfully! Please login with your new password.");
                setStep(1);
                setEmail("");
                setOtp("");
                setPassword("");
                setConfirmPassword("");
                navigate('/');
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
                
                {error && <p className="text-red-500 text-center">{error}</p>}
                {message && <p className="text-green-500 text-center">{message}</p>}
                
                <form onSubmit={handleSubmit}>
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            >
                                Send OTP
                            </button>
                        </div>
                    )}

                    {/* Step 2: OTP, Password, and Confirm Password */}
                    {step === 2 && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="otp" className="block text-gray-700 font-bold mb-2">OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter OTP"
                                    maxLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="mt-2 text-blue-500 hover:underline text-sm"
                                >
                                    Resend OTP
                                </button>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">New Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Forgot;
