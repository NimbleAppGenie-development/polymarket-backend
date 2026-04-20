import { useContext, useState } from "react";
import { HttpClient } from "../../utils/request";
import { useNavigate } from "react-router";
import AuthContext from "../../utils/auth/AuthContext";
import { errorToastr } from '../../utils/toastr.js';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(true);
    const [passwordAttr, setPasswordAttr] = useState("password");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // ⏳ optional loader state

    const toggleState = () => {
        setToggle(!toggle);
        setPasswordAttr(toggle ? "text" : "password");
    };

    const handleSubmition = async (e) => {
        e.preventDefault();

        try {
            const request = new HttpClient({
                url: "/admin/login",
                data: { email, password },
                auth: false
            });

            const { data, status } = await request.post();

            if (status && data?.body) {
                login(data.body);
                navigate("/dashboard");
            } else {
                errorToastr(data?.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            errorToastr(error.message || "Login failed");
        }

        return false; // ✅ prevents form from trying to reload
    };



    return (
        <form
            className="position-absolute top-50 start-50 translate-middle w-25 needs-validation"
            onSubmit={handleSubmition}
        >
            <div className="card text-bg-dark shadow-lg px-5">
                <img
                    src="/img/logos.svg"
                    className="card-img-top mt-5"
                    alt="Admin Logo"
                    style={{
                        position: "relative"
                    }}
                />
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-light">
                            Email:
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-light">
                            Password:
                        </label>
                        <div className="input-group flex-nowrap">
                            <input
                                type={passwordAttr}
                                value={password}
                                className="form-control"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                            />
                            <span
                                className="input-group-text"
                                id="addon-wrapping"
                                onClick={() => toggleState()}
                            >
                                <i
                                    className={`fa ${toggle ? "fa-eye-slash" : "fa-eye"
                                        }`}
                                ></i>
                            </span>
                        </div>
                    </div>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary" type="submit">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
