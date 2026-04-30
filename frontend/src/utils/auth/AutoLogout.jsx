import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const TIMEOUT = 30 * 60 * 1000; // 30 minutes
const LAST_ACTIVITY_KEY = "user_lastActivity";

export default function AutoLogout() {
    const { user, logout } = useContext(AuthContext);
    const timerRef = useRef(null);
    const navigate = useNavigate();
    const logoutRef = useRef(logout);

    useEffect(() => {
        logoutRef.current = logout;
    }, [logout]);

    const doLogout = async () => {
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        try {
            await logoutRef.current();
        } catch {
            localStorage.removeItem("user");
        } finally {
            navigate("/");
        }
    };

    useEffect(() => {
        if (!user) return;

        const user_lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (user_lastActivity) {
            const elapsed = Date.now() - parseInt(user_lastActivity);
            if (elapsed > TIMEOUT) {
                doLogout(); // system shutdown/browser close wala case
                return;
            }
        }

        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);

            localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

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

    return null;
}
