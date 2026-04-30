import { useContext, useEffect, useState } from "react";
import AuthContext from "../utils/auth/AuthContext";
import { fetchURLfromBackend } from "../utils/helper";
import { Link } from "react-router";
import Service from "../services/Http";
import { errorToastr, successToastr } from "../utils/toastr";

export default function Header() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({});

    const fetchProfile = async () => {
        try {
            const services = new Service();

            const response = await services.get("/admin/profile", {}, true);

            if (response.status && response.data) {
                setProfile(response.data);
            } else {
                errorToastr(response?.message || response?.data?.message || "Failed to fetch profile");
            }
        } catch (error) {
            console.error("Fetch profile error:", error);

            errorToastr(error?.message || error?.data?.message || "Error fetching profile");
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    return (
        <div className="main-header">
            <div className="main-header-logo">
                <div className="logo-header" data-background-color="dark">
                    <Link to="/dashboard" className="logo">
                        <img src="/img/logo.svg" alt="navbar brand" className="navbar-brand w-75" height="20" />
                    </Link>
                    <div className="nav-toggle">
                        <button className="btn btn-toggle toggle-sidebar">
                            <i className="gg-menu-right"></i>
                        </button>
                        <button className="btn btn-toggle sidenav-toggler">
                            <i className="gg-menu-left"></i>
                        </button>
                    </div>
                    <button className="topbar-toggler more">
                        <i className="gg-more-vertical-alt"></i>
                    </button>
                </div>
            </div>
            <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom" data-background-color="dark">
                <div className="container-fluid">
                    <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex"></nav>

                    <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
                        <li className="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
                            <a
                                className="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                                href="#"
                                role="button"
                                aria-expanded="false"
                                aria-haspopup="true"
                            >
                                <i className="fa fa-search"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-search animated fadeIn">
                                <form className="navbar-left navbar-form nav-search">
                                    <div className="input-group">
                                        <input type="text" placeholder="Search ..." className="form-control" />
                                    </div>
                                </form>
                            </ul>
                        </li>
                        <li className="nav-item topbar-icon dropdown hidden-caret">
                            <button
                                className="nav-link"
                                type="button"
                                id="messageDropdown"
                                role="button"
                                title="Logout!!"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                <i className="fa fa-power-off"></i>
                            </button>
                        </li>
                        <li className="nav-item topbar-user dropdown hidden-caret">
                            {/* <a className="dropdown-toggle profile-pic" data-bs-toggle="dropdown-1" href="#" aria-expanded="false">
                                <div className="avatar-sm">
                                    <img src={profile?.profileImage && fetchURLfromBackend(profile?.profileImage)} alt="..." className="avatar-img rounded-circle" />
                                </div>
                                <span className="profile-username">
                                    <span className="op-7">Hi, </span>
                                    <span className="fw-bold">{profile ? profile.name : "..."}</span>
                                </span>
                            </a> */}
                            <ul className="dropdown-menu dropdown-user animated fadeIn">
                                <div className="dropdown-user-scroll scrollbar-outer">
                                    <li>
                                        <div className="user-box">
                                            <div className="avatar-lg">
                                                <img
                                                    src={profile?.profileImage && fetchURLfromBackend(profile?.profileImage)}
                                                    alt="image profile"
                                                    className="avatar-img rounded"
                                                />
                                            </div>
                                            <div className="u-text">
                                                <h4 className="text-secondary"> {profile ? profile.name : "..."}</h4>
                                                <p className="text-secondary">{profile ? profile.email : "..."}</p>
                                                <a href="/settings" className="btn btn-xs btn-secondary btn-sm">
                                                    View Profile
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="/settings">
                                            My Profile
                                        </a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="/settings">
                                            Account Setting
                                        </a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            Logout
                                        </a>
                                    </li>
                                </div>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
