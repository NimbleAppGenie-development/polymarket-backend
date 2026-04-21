import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import HomeDetail from "./pages/HomeDetail";
import Account from "./pages/Account";
import HowItWorks from "./pages/HowItWorks";
import Live from "./pages/Live";
import { PrivateRoute } from "./utils/auth/PrivateRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home key={Date.now()} />} />
                <Route path="/home-detail/:detailId" element={<HomeDetail />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/live" element={<Live />} />
                <Route path="/account" element={ <PrivateRoute> <Account /> </PrivateRoute> } />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
