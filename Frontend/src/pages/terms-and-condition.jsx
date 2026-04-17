import tncCss from "../assets/css/static-pages/terms-condition.module.css";

export default function TermsAndCondition() {
    return (
        <section className={tncCss["same-section"]}>
            <div className="container">
                <div className={tncCss["same-content"]}>
                    <p>
                        Welcome to <strong>Target!</strong> These Terms and Conditions govern your use of our app and services. By accessing
                        or using Target, you agree to comply with these terms. If you do not agree, please do not use our platform.
                    </p>

                    <h4>01. Acceptance of Terms</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> By creating an account, accessing, or using Target, you agree to be
                            bound by these Terms and our Privacy Policy.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> You must be at least 13 years old (or the applicable age in your country) to
                            use our services.
                        </li>
                    </ul>
                    <h4>02. User Accounts</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> You are responsible for maintaining the confidentiality of your account
                            credentials.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> You agree to provide accurate and truthful information when creating your
                            account.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Target reserves the right to suspend or terminate accounts that
                            violate these terms.
                        </li>
                    </ul>
                    <h4>03. Acceptable Use</h4>
                    <p>By using Target, you agree:</p>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Not to engage in harassment, hate speech, or harmful behavior.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Not to post or share illegal, abusive, or offensive content.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Not to impersonate others or provide false information.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Not to use the app for commercial solicitation without permission.
                        </li>
                    </ul>
                    <h4>04. Content Ownership & Rights</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> You retain ownership of any content you post. However, by posting, you grant
                            Target a non-exclusive, royalty-free license to use, display, and share your content within the platform.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Target reserves the right to remove any content that violates these
                            Terms.
                        </li>
                    </ul>
                    <h4>05. Safety & Community Guidelines</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Users should exercise caution when meeting others in person. Target
                            is not responsible for any interactions outside the app.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Report any inappropriate behavior or violations to our support team.
                        </li>
                    </ul>
                    <h4>06. Privacy & Data Usage</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> We do not sell your data, but we may collect and use it to improve the app
                            experience.
                        </li>
                    </ul>
                    <h4>07. Limitation of Liability</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Target is provided "as is," and we make no guarantees about uptime,
                            availability, or uninterrupted service.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> We are not liable for any damages, injuries, or disputes arising from the use
                            of the platform or interactions between users.
                        </li>
                    </ul>
                    <h4>08. Modifications to Terms</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> We may update these Terms periodically. Continued use of the app after changes
                            are posted constitutes acceptance of the new Terms.
                        </li>
                    </ul>
                    <h4>09. Termination</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> We reserve the right to terminate or suspend accounts at our discretion if
                            users violate these Terms.
                        </li>
                    </ul>
                    <h4>10. Contact Us</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> For questions or support, contact us at{" "}
                            <strong>[Insert Contact Information]</strong>.
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
