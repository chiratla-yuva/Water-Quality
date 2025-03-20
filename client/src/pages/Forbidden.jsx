import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-red-600">403 Forbidden</h1>
            <p className="text-gray-700 mt-2">You are not authorized to view this page.</p>
            <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Go to Login
            </Link>
        </div>
    );
};

export default Forbidden;
