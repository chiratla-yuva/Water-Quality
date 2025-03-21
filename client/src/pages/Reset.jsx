import React, { useState } from "react";
import axios from "axios";

const Reset = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "https://water-quality-backend-v5h7.onrender.com/api/auth/change-password",
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage(res.data.message);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to change password. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>
                {message && <p className="text-center text-red-500">{message}</p>}

                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Current Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reset;
