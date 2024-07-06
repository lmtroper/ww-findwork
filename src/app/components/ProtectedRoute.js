// components/ProtectedRoute.js
import { useRouter } from 'next/navigation'; // Import from 'next/navigation'
import useAuth from '../hooks/useAuth'; // Adjust the path as necessary
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/'); // Redirect to home or login page if not authenticated
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a loader component
    }

    if (!user) {
        return null; // Show nothing or a loader while redirecting
    }

    return children;
};

export default ProtectedRoute;
