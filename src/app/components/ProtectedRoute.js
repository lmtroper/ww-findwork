// components/ProtectedRoute.js
import React from 'react';
import useAuth from '../hooks/useAuth'; // Adjust the path as necessary

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a loader component
    }

    if (!user) {
        return null; // You can replace this with a redirect or a message
    }

    return children;
};

export default ProtectedRoute;
