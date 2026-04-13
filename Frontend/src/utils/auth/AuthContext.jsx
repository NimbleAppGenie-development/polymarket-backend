import { createContext, useState, useEffect } from "react";
import { HttpClient } from "../request";
import toastr from "../toastr";


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
        console.log("-----------",userData)
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toastr.success("Admin logged in successfully");
    };

    const logout = async () => {

        let request = new HttpClient({
            url: "/user/user-logout",
            auth: true,
            data: {},
            
        });
        
        await request.post();

        localStorage.removeItem("user");
        setUser(null);
        toastr.success("User logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
