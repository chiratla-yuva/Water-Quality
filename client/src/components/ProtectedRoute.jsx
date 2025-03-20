import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedin'));

    return isLoggedIn ? children : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoute;
