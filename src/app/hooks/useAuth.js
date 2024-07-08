// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase'; // Adjust the path as necessary

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Only run this effect on the client side
        if (typeof window !== 'undefined') {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user);
                } else {
                    setUser(null);
                    router.push('/'); // Redirect to home or login page if not authenticated
                }
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [router]);

    return { user, loading };
};

export default useAuth;
