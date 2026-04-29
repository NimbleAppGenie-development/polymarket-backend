import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const TIMEOUT = 30 * 60 * 1000; // 30 minute 

export default function AutoLogout() {
    const { user, logout } = useContext(AuthContext);
    const timerRef = useRef(null);
    const navigate = useNavigate();
    const logoutRef = useRef(logout);

    useEffect(() => {
        logoutRef.current = logout;
    }, [logout]);

    useEffect(() => {
        if (!user) return; 

        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(async () => {
                try {
                    await logoutRef.current();
                } catch {
                    localStorage.removeItem("user");
                } finally {
                    navigate("/");
                }
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

    return null; 
}