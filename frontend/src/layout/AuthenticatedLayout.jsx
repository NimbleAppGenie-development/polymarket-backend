import "../assets/css/admin/bootstrap.min.css";
import "../assets/css/admin/fonts.min.css";
import "../assets/css/admin/kaiadmin.min.css";
import "../assets/css/admin/plugins.min.css";
import "../assets/css/admin/media.css";
import "../../public/js/kaiadmin";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import useTitle from "../utils/title";
import "toastr/build/toastr.css";
import { Fragment, useContext, useEffect, useRef } from "react";
import AuthContext from "../utils/auth/AuthContext";
import { useNavigate } from "react-router";
import Footer from "../components/Footer";

export function AuthenticatedLayout({ title, loading, children }) {
    useTitle(title);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const shadowRef = useRef(null);

    useEffect(() => {
        import("../assets/css/admin/bootstrap.min.css").then((css) => {
            if (shadowRef.current) {
                shadowRef.current.adoptedStyleSheets = [css.default];
                console.log("css loaded");
            }
        });

        window.dispatchEvent(new Event("js-load-kro-jaldi"));
    }, []);

    const logoutUser = () => {
        const modalEl = document.getElementById("exampleModal");
        if (modalEl) {
            modalEl.classList.remove("show");
            modalEl.style.display = "none";
        }

        const backdrops = document.getElementsByClassName("modal-backdrop");
        while (backdrops.length) backdrops[0].parentNode.removeChild(backdrops[0]);

        logout();
        navigate("/auth/login", { replace: true });
    };


    return (
        <Fragment>
            {loading && <Loader />}
            <div className="wrapper">
                <Sidebar />

                <div className="main-panel">
                    <Header />
                    <div className="container">
                        <div className="page-inner">
                            <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                                <div>
                                    <h1 className="fw-bold mb-3">{title}</h1>
                                </div>
                            </div>

                            {children}
                        </div>
                    </div>
                    <Footer />
                </div>

                <Fragment>
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                                        Logout
                                    </h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <h3 className="text-center">Are you sure to logout?</h3>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                                        No
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={logoutUser}>
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            </div>
        </Fragment>
    );
}
