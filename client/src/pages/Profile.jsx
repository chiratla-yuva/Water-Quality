import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null); // Initially null to indicate loading state
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("token"); 
                if (!token) {
                    setMessage("Authentication token missing. Please log in again.");
                    return;
                }
        
                const res = await axios.get("https://water-quality-backend-v5h7.onrender.com/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
        
                console.log("API Response:", res.data); // Debugging line
        
                if (res.data.success) {
                    setUser(res.data.user);
                } else {
                    setMessage(res.data.message);
                }
            } catch (error) {
                console.error("Error fetching profile:", error.response?.data || error.message);
                setMessage("Failed to fetch profile details. Please log in again.");
            }
        };
        fetchUserDetails();
    }, []);

    const handleEdit = () => setIsEditing(true);

    const handleUpdate = async () => {
        if (!user?.name || !user?.email) {
            setMessage("Name and Email are required.");
            return;
        }
    
        setLoading(true);
        setMessage("");
    
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put( // Use PUT instead of POST
                "https://water-quality-backend-v5h7.onrender.com/api/auth/update-profile",
                { name: user.name, email: user.email }, // Send updated user data
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("Update Response:", res.data); // Debugging
    
            if (res.data.success) {
                setMessage("Profile updated successfully!");
                setIsEditing(false);
            } else {
                setMessage(res.data.message);
            }
        } catch (error) {
            console.error("Update error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Failed to update profile. Try again.");
        }
    
        setLoading(false);
    };

    const handleResetPassword = () => {
        if (user?.role === "Admin") {
            navigate("/admin/reset");
        } else {
            navigate("/operator/reset");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">Profile</h2>
                {message && <p className="text-center text-red-500">{message}</p>}

                {user ? (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-200"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-200"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="flex justify-between mt-4">
                            {isEditing ? (
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update"}
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                                onClick={handleResetPassword}
                            >
                                Reset Password
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-600">Loading profile...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
