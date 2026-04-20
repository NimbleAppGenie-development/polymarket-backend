import { Fragment } from "react";
import "../assets/css/bootstrap.min.css";

export default function HomeLayout({ children }) {
    return (
        <Fragment>
            <header>
                <div className="container">
                    <div className="row">
                        <div className="col logo">
                            <a href="#">
                                <img src="/img/newsletter/Logo.png" alt="logo" />
                            </a>
                        </div>
                        <div className="col menu">
                            <ul>
                                <li>
                                    <a href="#">
                                        <img src="/img/newsletter/facebook.svg" alt="icon" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src="/img/newsletter/twitter.svg" alt="icon" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <section className="banner-section">
                <div className="container">{children}</div>
            </section>
        </Fragment>
    );
}
