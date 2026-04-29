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

import { Navigate } from "react-router";
import AuthContext from "./AuthContext";
import { useContext, useEffect, useRef } from "react";
import Loader from "../../components/Loader";

const TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const PrivateRoute = ({ children }) => {
    const { user, loading, logout } = useContext(AuthContext);
    const timerRef = useRef(null);

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            logout();
        }, TIMEOUT);
    };

    useEffect(() => {
        if (!user) return; 

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
