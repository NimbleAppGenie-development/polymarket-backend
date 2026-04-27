import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorToastr } from "../utils/toastr.js";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Service from "../services/Http.js";

export default function Header() {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [marketData, setMarketData] = useState([]);
    const [trendingData, setTrendingData] = useState([]);
    const searchRef = useRef(null);

    const isValidMarket = (item) => {
        const now = Date.now();
        const end = new Date(item.eventEndDate).getTime();
        const isExpired = end < now;
        const isResultDeclared = item.options?.some((opt) => opt.resultStatus === true);
        return !isExpired && !isResultDeclared;
    };

    // Fetch market list
    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const services = new Service();
                const response = await services.get("/user/get-market-list", {}, false);
                if (response?.status) {
                    setMarketData((response.data || []).filter(isValidMarket));
                }
            } catch (error) {
                console.error("Header market fetch error:", error);
            }
        };
        fetchMarketData();
    }, []);

    // Fetch trending list
    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                const services = new Service();
                const response = await services.get("/user/get-trending-list", {}, false);
                if (response?.status) {
                    const validTrending = (response.data || [])
                        .filter((item) => item.trending === true)
                        .filter(isValidMarket)
                        .slice(0, 5);
                    setTrendingData(validTrending);
                }
            } catch (error) {
                console.error("Header trending fetch error:", error);
            }
        };
        fetchTrendingData();
    }, []);

    const isSearching = searchQuery.trim() !== "";

    const searchResults = isSearching
        ? marketData.filter((item) => item.question?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10)
        : [];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSelect = (item) => {
        setSearchQuery("");
        setShowDropdown(false);
        navigate(`/home-detail/${item.id}`);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            const list = isSearching ? searchResults : trendingData;
            if (list.length > 0) handleSearchSelect(list[0]);
        }
        if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    // Highlight matching text
    const highlightMatch = (text, query) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} style={{ background: "#6366f1", color: "#fff", borderRadius: "2px", padding: "0 2px" }}>
                    {part}
                </mark>
            ) : (
                part
            ),
        );
    };

    const validateForm = (formData) => {
        const errors = {};
        const name = formData.get("name")?.trim();
        const email = formData.get("email")?.trim();
        const password = formData.get("password")?.trim();
        const confirmPassword = formData.get("confirmPassword")?.trim();

        if (!name) errors.name = "Name field is required.";
        if (!email) errors.email = "Email is required.";
        if (!password) errors.password = "Password is requird.";
        if (!confirmPassword) {
            errors.confirmPassword = "Confirm password is required.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        setFormErrors(errors);
        return errors;
    };

    const validateLoginForm = (formData) => {
        const errors = {};
        const emailL = formData.get("emailL")?.trim();
        const passwordL = formData.get("passwordL")?.trim();

        if (!emailL) errors.email = "Email is required.";
        if (!passwordL) errors.password = "Password is requird.";

        setFormErrors(errors);
        return errors;
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmitionLogin = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const errors = validateLoginForm(form);

        if (Object.keys(errors).length > 0) {
            errorToastr(Object.values(errors)[0]);
            return;
        }

        try {
            const jsonData = Object.fromEntries(form);
            const service = new Service();
            let response;
            try {
                response = await service.post("/user/user-login", jsonData, false);
            } catch (error) {
                Swal.fire(error?.response?.data?.message || error?.message || "Login failed", "", "error");
                return;
            }

            if (response?.status) {
                Swal.fire({
                    title: response?.message || "Login successful",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    login(response?.data?.body);
                    window.location.reload();
                });
            } else {
                Swal.fire(response?.message || "Login failed", "", "error");
            }
        } catch (error) {
            Swal.fire(error?.response?.data?.message || "Login failed", "", "error");
        }

        return false;
    };

    const handleSubmition = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
            errorToastr(Object.values(errors)[0]);
            return;
        }

        try {
            const jsonData = Object.fromEntries(form);
            const service = new Service();
            const response = await service.post("/user/user-register", jsonData, false);

            if (response?.status) {
                login(response?.data);
                Swal.fire(response?.message || "Registration & login successful", "", "success");
                setTimeout(() => window.location.reload(), 1000);
            } else {
                Swal.fire(response?.message || "Registration failed", "", "error");
            }
        } catch (error) {
            Swal.fire(error?.response?.data?.message || error?.message || "Registration failed", "", "error");
        }

        return false;
    };

    const handleOpenLogin = (e) => {
        e.preventDefault();
        const registerModalEl = document.getElementById("exampleModal01");
        const registerModal = Modal.getInstance(registerModalEl);
        document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
        if (registerModal) registerModal.hide();
        registerModalEl.addEventListener("hidden.bs.modal", () => Modal.getOrCreateInstance(document.getElementById("exampleModal")).show(), {
            once: true,
        });
    };

    // Dropdown item renderer
    const DropdownItem = ({ item, index, showIndex }) => (
        <div
            key={item.id}
            onClick={() => handleSearchSelect(item)}
            style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "background 0.15s",
                background: "#fff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f3ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
            {showIndex && <span style={{ fontSize: "12px", fontWeight: 700, color: "#6366f1", minWidth: 18 }}>{index + 1}.</span>}
            <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                    style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {highlightMatch(item.question || "", searchQuery)}
                </div>
                {item.category?.name && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{item.category.name}</div>}
            </div>
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
            >
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </div>
    );

    return (
        <header>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="header-left-content">
                            <div className="logo">
                                <a href={"/"}>
                                    <img src="/img/logo.svg" alt="logo" />
                                </a>
                            </div>

                            {/* ===== SEARCH BOX WITH DROPDOWN ===== */}
                            <div className="header-search-box" ref={searchRef} style={{ position: "relative" }}>
                                <img src="/img/search-icon.svg" alt="search-icon" />
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search your TARGET…"
                                    value={searchQuery}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    onKeyDown={handleSearchKeyDown}
                                />

                                {showDropdown && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "calc(100% + 8px)",
                                            left: 0,
                                            right: 0,
                                            background: "#fff",
                                            borderRadius: "12px",
                                            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                                            zIndex: 9999,
                                            overflow: "hidden",
                                            border: "1px solid #e5e7eb",
                                            maxHeight: "400px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {isSearching ? (
                                            searchResults.length > 0 ? (
                                                <>
                                                    <div
                                                        style={{
                                                            padding: "8px 14px",
                                                            fontSize: "11px",
                                                            fontWeight: 600,
                                                            color: "#9ca3af",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.05em",
                                                            borderBottom: "1px solid #f3f4f6",
                                                            background: "#fafafa",
                                                        }}
                                                    >
                                                        Results for &quot;{searchQuery}&quot;
                                                    </div>
                                                    {searchResults.map((item, i) => (
                                                        <DropdownItem key={item.id} item={item} index={i} showIndex={false} />
                                                    ))}
                                                </>
                                            ) : (
                                                <div style={{ padding: "20px 14px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
                                                    No questions found for &quot;{searchQuery}&quot;
                                                </div>
                                            )
                                        ) : trendingData.length > 0 ? (
                                            <>
                                                <div
                                                    style={{
                                                        padding: "8px 14px",
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                        color: "#9ca3af",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.05em",
                                                        borderBottom: "1px solid #f3f4f6",
                                                        background: "#fafafa",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                    }}
                                                ></div>
                                                {trendingData.map((item, i) => (
                                                    <DropdownItem key={item.id} item={item} index={i} showIndex={true} />
                                                ))}
                                            </>
                                        ) : (
                                            <div style={{ padding: "16px 14px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
                                                Loading...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="header-works">
                                <Link to="/how-it-works">
                                    <img src="/img/setting.svg" alt="setting-icon" /> How it works?
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="header-right-content">
                            <ul>
                                <li>
                                    <Link to="/live" className="btn live-btn">
                                        <img src="/img/live.svg" alt="live-icon" /> LIVE
                                    </Link>
                                </li>
                                {user ? (
                                    <>
                                        <li>
                                            <Link to="/portfolio" className="btn login-btn">
                                                Portfolio
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/account" className="btn login-btn">
                                                Account
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={logout} className="btn login-btn">
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn login-btn">
                                                Login
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModal01"
                                                className="btn register-btn"
                                            >
                                                Sign up
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <div className="modal fade login-modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form className="position-absolute top-50 start-50 translate-middle w-25" onSubmit={handleSubmitionLogin}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="login-modal-content">
                                    <figure>
                                        <img src="/img/logo.svg" alt="logo" />
                                    </figure>
                                    <h2>Welcome Back!</h2>
                                    <p>Lorem ipsum dolor sit amet, consetetur.</p>
                                    <div className="login-form-parent">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="text" name="emailL" className="form-control" placeholder="Enter email" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password:</label>
                                            <div className="password-fields" style={{ position: "relative" }}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control"
                                                    name="passwordL"
                                                    placeholder="Enter password"
                                                />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    className={`fa fa-fw ${showPassword ? "fa-eye" : "fa-eye-slash"} field-icon`}
                                                    style={{
                                                        position: "absolute",
                                                        right: "10px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        cursor: "pointer",
                                                    }}
                                                ></span>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-primaryx" type="submit">
                                                Log In
                                            </button>
                                        </div>
                                        <div className="form-bottom-btn">
                                            <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal01" data-bs-dismiss="modal">
                                                No account? Create one
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Register Modal */}
            <div className="modal fade login-modal" id="exampleModal01" tabIndex="-1" aria-labelledby="exampleModalLabel01" aria-hidden="true">
                <form className="position-absolute top-50 start-50 translate-middle w-25" onSubmit={handleSubmition}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="login-modal-content">
                                    <figure>
                                        <img src="/img/logo.svg" alt="logo" />
                                    </figure>
                                    <h2>Welcome Back!</h2>
                                    <p>Lorem ipsum dolor sit amet, consetetur.</p>
                                    <div className="login-form-parent">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input type="text" name="name" className="form-control" placeholder="Enter name" />
                                            {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-control" name="email" placeholder="Enter email" />
                                            {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password:</label>
                                            <div className="password-fields" style={{ position: "relative" }}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control"
                                                    name="password"
                                                    placeholder="Enter Password"
                                                />
                                                <span
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className={`fa fa-fw ${showPassword ? "fa-eye" : "fa-eye-slash"} field-icon`}
                                                    style={{
                                                        position: "absolute",
                                                        right: "10px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        cursor: "pointer",
                                                    }}
                                                ></span>
                                            </div>
                                            {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword">Confirm Password:</label>
                                            <div className="password-fields">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className="form-control"
                                                    name="confirmPassword"
                                                    placeholder="Enter confirm password"
                                                />
                                                <span
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className={`fa fa-fw ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} field-icon`}
                                                    style={{
                                                        position: "absolute",
                                                        right: "10px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        cursor: "pointer",
                                                    }}
                                                ></span>
                                            </div>
                                            {formErrors.confirmPassword && <div className="text-danger">{formErrors.confirmPassword}</div>}
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-primaryx" type="submit">
                                                Sign Up
                                            </button>
                                        </div>
                                        <div className="form-bottom-btn">
                                            <a href="#" onClick={handleOpenLogin}>
                                                Already have an account? Login Here
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </header>
    );
}
