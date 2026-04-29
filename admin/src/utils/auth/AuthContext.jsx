import { createContext, useState, useEffect } from "react";
import toastr from "../toastr";
import Service from "../../services/Http";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state

    // Load user from local storage (or check session)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toastr.success("Admin logged in successfully");
    };

    const logout = async () => {
        try {
            const services = new Service();

            await services.post("/admin/logout", {}, true);

            localStorage.removeItem("user");
            setUser(null);

            toastr.success("Admin logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);

            toastr.error(
                error?.message ||
                error?.response?.data?.message ||
                "Logout failed"
            );
        }
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
