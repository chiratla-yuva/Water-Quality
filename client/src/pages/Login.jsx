import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await axios.post(
                'https://water-quality-backend-v5h7.onrender.com/api/auth/login', 
                { email, password }, 
                { withCredentials: true }
            );
    
            console.log("Response Data:", response.data); // Debugging
    
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                
                // Ensure user exists before accessing properties
                const user = response.data.user;
                if (!user) {
                    throw new Error("User data is missing from the response");
                }
                localStorage.setItem('userId', user._id);
                localStorage.setItem('role',user.role);
                localStorage.setItem('loggedin', JSON.stringify(true));
                if (user.isVerified) {
                    if(user.role === 'Admin'){
                        navigate('/admin/profile');
                    } else{
                        navigate('/operator/realtime');
                    }
                } else {
                    try {
                        const token = localStorage.getItem('token'); // Retrieve token
                        await axios.post(
                            'https://water-quality-backend-v5h7.onrender.com/api/auth/send-verify-otp', 
                            { userId: user._id }, 
                            { headers: { Authorization: `Bearer ${token}` } } // Send token in headers
                        );
                        navigate('/verify');
                    } catch (otpError) {
                        console.error("OTP Sending Error:", otpError.response?.data || otpError.message);
                        setError("Failed to send OTP. Please try again.");
                    }
                }                
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message); // Debugging
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-1">
                            Password
                        </label>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 top-10 text-gray-500 hover:text-gray-700"
                        >
                            {passwordVisible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                        </button>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <button
                            type="button"
                            className="text-blue-500 text-sm hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
