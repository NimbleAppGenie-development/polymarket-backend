import { Link } from "react-router";
import logo from "../img/logo.png"

function isAllowedRoute(levelUrls, route) {
    return levelUrls.some((pattern) => {
        if (pattern.endsWith("/*")) {
            return route.startsWith(pattern.slice(0, -2));
        }

        return route === pattern;
    });
}

export default function Sidebar() {
    let currentRoute = window.location.pathname;

    let routes = [
        {
            url: "/dashboard",
            active: "",
            name: "Dashboard",
            icon: <i className="fas fa-home" />,
            levels: [],
            urls: [],
        },
        {
            url: "/user",
            active: "",
            name: "User Management",
            icon: <i className="fas fa fa-list-alt" />,
            levels: [],
            urls: [],
        },
        {
            url: "/category",
            active: "",
            name: "Category Management",
            icon: <i className="fas fa fa-list-alt" />,
            levels: [],
            urls: [],
        },
        {
            url: "/questions",
            active: "",
            name: "Question Management",
            icon: <i className="fas fa-question" />,
            levels: [],
            urls: [],
        },
        {
            url: "/pages",
            active: "",
            name: "Pages",
            icon: <i className="fas fa-book" />,
            levels: [],
            urls: [],
        },
    ].map((item) => {
        let levelUrls = item.levels.map((level) => level.url);
        item.active = currentRoute === item.url || isAllowedRoute(levelUrls, currentRoute) ? "active" : "";

        item.urls = item.levels.map((level) => level.url);
        item.levels = item.levels.map((lev) => ({ ...lev, active: currentRoute === lev.url ? "active" : "" }));

        return item;
    });

    return (
        <div className="sidebar sidebar-style-2" data-background-color="dark">
            <div className="sidebar-logo">
                <div
                    className="logo-header"
                    data-background-color="dark"
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        height: "70px",
                    }}
                >
                    {/* Center Logo */}
                    <Link
                        to="/dashboard"
                        className="logo"
                        style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src="/img/logo.svg"
                            alt="navbar brand"
                            style={{marginTop: "30px"}}
                            className="navbar-brand"
                            height="60"
                        />
                    </Link>

                    {/* Existing toggle buttons (DO NOT TOUCH CLASSES) */}
                    <div
                        className="nav-toggle"
                        style={{
                            marginLeft: "auto",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <button className="btn btn-toggle toggle-sidebar">
                            <i className="gg-menu-right"></i>
                        </button>

                        <button className="btn btn-toggle sidenav-toggler">
                            <i className="gg-menu-left"></i>
                        </button>
                    </div>

                    <button
                        className="topbar-toggler more"
                        style={{ marginLeft: "8px" }}
                    >
                        <i className="gg-more-vertical-alt"></i>
                    </button>
                </div>
            </div>

            <div className="sidebar-wrapper scrollbar scrollbar-inner">
                <div className="sidebar-content">
                    <ul className="nav nav-secondary">
                        {routes.map((item, key) =>
                            item.levels.length > 0 ? (
                                <li key={key} className={`nav-item ${item.active}`}>
                                    <a data-bs-toggle="collapse" href={`#collapse-${key}`}>
                                        {item.icon}
                                        <p>{item.name}</p>
                                        <span className="caret"></span>
                                    </a>
                                    <div className={`collapse ${item.active ? "show" : ""}`} id={`collapse-${key}`}>
                                        <ul className="nav nav-collapse">
                                            {item.levels
                                                .filter((i) => i.status)
                                                .map((level, index) => (
                                                    <li key={index} className={`${level.active}`}>
                                                        <Link to={level.url}>
                                                            <span className="sub-item">{level.name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </li>
                            ) : (
                                <li key={key} className={`nav-item ${item.active}`}>
                                    <Link to={item.url}>
                                        {item.icon}
                                        <p>{item.name}</p>
                                    </Link>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
