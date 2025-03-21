import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setMessage("User ID is missing. Please log in again.");
            setTimeout(() => navigate("/"), 3000); // Redirect to login after 3 seconds
        }
    }, [navigate]);

    const handleResendOtp = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setMessage("User ID is missing. Please log in again.");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                "https://water-quality-backend-v5h7.onrender.com/api/auth/resend-verify-otp",
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.success ? "OTP resent successfully." : res.data.message);
        } catch (error) {
            setMessage("Failed to resend OTP. Try again.");
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");

        if (!otp) {
            setMessage("Please enter the OTP.");
            return;
        }
        if (!userId) {
            setMessage("User ID is missing. Please log in again.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                "https://water-quality-backend-v5h7.onrender.com/api/auth/verify-otp",
                { userId, verifyOtp: otp },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage("Email verified successfully!");
                localStorage.removeItem("userId"); // Remove userId after verification
                navigate('/');
            } else {
                setMessage(res.data.message);
            }
        } catch (error) {
            setMessage("Error verifying OTP. Try again.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Verify Email</h2>
                {message && <p className="text-center text-red-500">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-gray-700 font-bold mb-2">
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter OTP"
                            maxLength={6}
                        />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            className="text-blue-500 text-sm hover:underline"
                            disabled={loading}
                        >
                            {loading ? "Resending..." : "Resend OTP"}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Verify;
