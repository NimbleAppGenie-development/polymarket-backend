import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import HomeDetail from "./pages/HomeDetail";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home key={Date.now()} />} />
                <Route path="/home-detail/:detailId" element={<HomeDetail />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
