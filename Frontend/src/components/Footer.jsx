import React from 'react'

export default function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="footer-logo">
                            <a href="#"><img src="/img/logo.svg" alt="logo"/></a>
                            <p>The World’s Largest Prediction Market™</p>
                        </div>
                        <div className="footer-contact-fields">
                            <label>Contact Us.</label>
                            <a href="tel:1800 800 000">1800 800 000</a>
                        </div>
                        <div className="footer-contact-fields">
                            <label>Social</label>
                            <ul>
                                <li><a href="#"><img src="/img/linkedin.svg" alt="icon"/></a></li>
                                <li><a href="#"><img src="/img/twitter.svg" alt="icon"/></a></li>
                                <li><a href="#"><img src="/img/instagram.svg" alt="icon"/></a></li>
                                <li><a href="#"><img src="/img/social-icon01.svg" alt="icon"/></a></li>
                                <li><a href="#"><img src="/img/social-icon02.svg" alt="icon"/></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="footer-menu">
                            <label>COMPANY</label>
                            <ul>
                                <li><a href="#">Leaderboard</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Activity</a></li>
                                <li><a href="#">Brands</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="footer-menu">
                            <label>PRODUCT</label>
                            <ul>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Regulatory</a></li>
                                <li><a href="#">Trading Hours</a></li>
                                <li><a href="#">Fee Schedule</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom-content">
                    <h4>Adventure One QSS Inc. © 2026 · Privacy . Terms of Use · Help Center · Docs</h4>
                    <p>Trading on Target involves risk and may not be appropriate for all. Members risk losing their cost to enter any transaction, including fees. You should carefully consider whether trading on Kalshi is appropriate for you in light of your investment experience and financial resources. Any trading decisions you make are solely your responsibility and at your own risk. Information is provided for convenience only on an “AS IS” basis. Past performance is not necessarily indicative of future results. Kalshi is subject to U.S. regulatory oversight by the CFTC.</p>
                </div>
            </div>
        </footer>
    )
}
