import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HttpClient } from "../utils/request";
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
            const firstError = Object.values(errors)[0];
            errorToastr(firstError);
            return;
        }

        try {
            const jsonData = Object.fromEntries(form);
            const service = new Service();
            let response;
            try {
                response = await service.post("/user/user-login", jsonData, false);
            } catch (error) {
                const errMsg = error?.response?.data?.message || error?.message || "Login failed";
                Swal.fire(errMsg, "", "error");
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
            const errMsg = error?.response?.data?.message || "Login failed";
            Swal.fire(errMsg, "", "error");
        }

        return false;
    };

    const handleSubmition = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            errorToastr(firstError);
            return;
        }

        try {
            const jsonData = Object.fromEntries(form);
            const service = new Service();

            const response = await service.post("/user/user-register", jsonData, false);

            if (response?.status) {
                login(response?.data);
                Swal.fire(response?.message || "Registration & login successful", "", "success");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                Swal.fire(response?.message || "Registration failed", "", "error");
            }
        } catch (error) {
            const errMsg = error?.response?.data?.message || error?.message || "Registration failed";
            Swal.fire(errMsg, "", "error");
        }

        return false;
    };
    const handleOpenLogin = (e) => {
        e.preventDefault();

        const registerModalEl = document.getElementById("exampleModal01");
        const loginModalEl = document.getElementById("exampleModal");

        const registerModal = Modal.getInstance(registerModalEl);
        const loginModal = new Modal(loginModalEl);

        document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

        if (registerModal) {
            registerModal.hide();
        }

        // Wait for the hide transition to fully complete before showing login
        registerModalEl.addEventListener(
            "hidden.bs.modal",
            () => {
                const loginModal = Modal.getOrCreateInstance(loginModalEl);
                loginModal.show();
            },
            { once: true }, // fires only once, auto-removes listener
        );

        /* setTimeout(() => {
            loginModal.show();
            // registerModalEl.show();
            document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
        }, 300); */
    };

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
                            <div className="header-search-box">
                                <img src="/img/search-icon.svg" alt="search-icon" />
                                <input type="text" name="" placeholder="Search your TARGET…" />
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
            {/* <div className="modal fade login-modal" id="exampleModal01" tabIndex="-1" aria-labelledby="exampleModalLabel01" aria-hidden="true">
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
                                            <div className="password-fields">
                                                <input type="password" className="form-control" name="password" />
                                                <span toggle="#password-field" className="fa fa-fw fa-eye-slash field-icon toggle-password"></span>
                                            </div>
                                            {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Confirm Password:</label>
                                            <div className="password-fields">
                                                <input type="password" className="form-control" name="confirmPassword" />
                                                <span className="fa fa-fw fa-eye-slash field-icon toggle-password"></span>
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
            </div> */}
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

                                        {/* Password Field */}
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

                                        {/* Confirm Password Field */}
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
