import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-lg font-semibold">Access Denied</p>
                    <p className="text-gray-500 mt-2">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default RoleBasedRoute;
