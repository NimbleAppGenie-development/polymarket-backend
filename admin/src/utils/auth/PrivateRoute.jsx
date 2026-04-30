/* import { Navigate } from "react-router";
import AuthContext from "./AuthContext";
import { useContext } from "react";
import Loader from "../../components/Loader";

export const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    // console.log("Auth====================",user);

    return user ? children : <Navigate to="/auth/login" />;
};
 */

import { Navigate, useNavigate } from "react-router";
import AuthContext from "./AuthContext";
import { useContext, useEffect, useRef } from "react";
import Loader from "../../components/Loader";

const TIMEOUT = 30 * 60 * 1000; // 30 minutes
const LAST_ACTIVITY_KEY_ADMIN = "admin_lastActivity";

export const PrivateRoute = ({ children }) => {
    const { user, loading, logout } = useContext(AuthContext);
    const timerRef = useRef(null);
    const navigate = useNavigate();
    const logoutRef = useRef(logout);

    useEffect(() => {
        logoutRef.current = logout;
    }, [logout]);

    const doLogout = async () => {
        localStorage.removeItem(LAST_ACTIVITY_KEY_ADMIN);
        try {
            await logoutRef.current();
        } catch {
            localStorage.removeItem("user");
        } finally {
            navigate("/auth/login");
        }
    };

    useEffect(() => {
        if (!user) return;

        const admin_lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY_ADMIN);
        if (admin_lastActivity) {
            const elapsed = Date.now() - parseInt(admin_lastActivity);
            if (elapsed > TIMEOUT) {
                doLogout();
                return;
            }
        }

        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);

            localStorage.setItem(LAST_ACTIVITY_KEY_ADMIN, Date.now().toString());

            timerRef.current = setTimeout(async () => {
                doLogout();
            }, TIMEOUT);
        };

        const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

        resetTimer();

        events.forEach((e) => window.addEventListener(e, resetTimer));

        return () => {
            clearTimeout(timerRef.current);
            events.forEach((e) => window.removeEventListener(e, resetTimer));
        };
    }, [user]);

    if (loading) {
        return <Loader />;
    }

    return user ? children : <Navigate to="/auth/login" />;
};

