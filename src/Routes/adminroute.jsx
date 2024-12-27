import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const AdminRoute = ({ element: Component, ...rest }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/auth/checkAuth`,
                    { withCredentials: true } // Ensure cookies are sent
                );
                
                // Check if user role is 'admin'
                if (response.data.userType === 'admin') {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error('Authorization check failed:', error);
                setIsAuthorized(false);
            }
        };

        checkAuth(); // Call the checkAuth function inside useEffect
    }, []); // Empty dependency array to run this only once when component mounts

    if (isAuthorized === null) {
        return <div>Loading...</div>; // Show loading while checking auth
    }

    return isAuthorized ? <Component {...rest} /> : <Navigate to="/" />;
};

export default AdminRoute;