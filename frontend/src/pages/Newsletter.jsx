import { useEffect } from "react";
import { useState } from "react";
import Loader from "../components/Loader";
import toastr from "toastr";
import useTitle from "../utils/title";
import "../assets/css/admin/bootstrap.min.css";
import "../assets/css/newsletter/media.css";
import { useNavigate } from "react-router";
import Service from "../services/Http";

export default function NewsLetter() {
    useTitle("Target", false);
    const [stylesLoaded, setStylesLoaded] = useState(false);
    const naviagate = useNavigate();

    useEffect(() => {
        setStylesLoaded(true);
        naviagate("/", {
            replace: true,
        });
    }, []);

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [checkbox, setCheckbox] = useState(true);

    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-center",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };

    useEffect(() => {
        const header = document.querySelector("header");
        const toggleClass = "is-sticky";

        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                header?.classList.add(toggleClass);
            } else {
                header?.classList.remove(toggleClass);
            }
        });
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 100);
    }, []);

    const submitEmail = async () => {
        if (!email || !email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
            toastr.error("Invalid Email", "Error");
            return false;
        }

        try {
            const services = new Service();

            const response = await services.post("/admin/user-newsletter", { email }, false);

            toastr.success(response?.data?.message || `Email sent to ${email}`, "Success");

            setEmail("");
        } catch (error) {
            console.error("Newsletter error:", error);

            toastr.error(error?.message || error?.data?.message || "Something went wrong", "Error");
        }
    };

    if (!stylesLoaded) return <Loader color={"yellow"} />;

    return (
        <div className="">
            {!stylesLoaded && <Loader color={"yellow"} />}

            {/* <header>
                <div className="container">
                    <div className="row">
                        <div className={`${styles.col} logo`}>
                            <a href="#">
                                <img
                                    loading="lazy"
                                    src="img/newsletter/Logo.png"
                                    alt="logo"
                                />
                            </a>
                        </div>
                        <div className={`${styles.col} ${styles.menu}`}>
                            <ul>
                                <li>
                                    <a href="#">
                                        <img
                                            loading="lazy"
                                            src="img/newsletter/facebook.svg"
                                            alt="icon"
                                        />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img
                                            loading="lazy"
                                            src="img/newsletter/twitter.svg"
                                            alt="icon"
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <section className={styles['banner-section']}>
                <div className={"container"}>
                    <div className={`${styles['banner-top']} text-center`}>
                        <h1>Dominate Your League This Season!</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod
                        </p>
                        <div className={styles["banner-form-parent"]}>
                            {loading && (
                                <Loader
                                    color={"yellow"}
                                    className="position-absolute top-25 start-50"
                                />
                            )}
                            <div className={styles["email-input-box"]}>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={styles["email-btn-box"]}>
                                <button
                                    className={`btn ${styles['btn-primaryx']}`}
                                    onClick={submitEmail}
                                >
                                    STAY INFORMED
                                </button>
                            </div>
                        </div>
                        <div className={styles["check-box-parent"]}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={checkbox}
                                    id="flexCheckChecked"
                                    checked={true}
                                    onChange={(e) =>
                                        setCheckbox(e.target.checked)
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckChecked"
                                >
                                    Notify me with updated information
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles["banner-image-wrapper"]}>
                        <div className="row">
                            <div className="col">
                                <div className={`${styles['banner-middle-image']} text-center`}>
                                    <img
                                        loading="lazy"
                                        src="img/newsletter/banner-image.png"
                                        alt="image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
