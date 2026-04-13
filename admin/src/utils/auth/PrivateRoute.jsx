import { Navigate } from "react-router";
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
