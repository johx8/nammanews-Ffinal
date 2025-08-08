import React from 'react';
import { Navigate } from 'react-router-dom';

const UserRoutes = ({children}) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');


    if (!token || role!== 'user') {
        // console.log("User not authenticated or not a user role");
        return <Navigate to="/login" replace />;
    }
    // console.log("User authenticated, rendering children");
    return children;
};

export default UserRoutes;
