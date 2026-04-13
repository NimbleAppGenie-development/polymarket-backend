import privacypolicycss from "../assets/css/static-pages/privacy-policy.module.css";

export default function PrivacyPolicy() {
    return (
        <section className={privacypolicycss["same-section"]}>
            <div className="container">
                <div className={privacypolicycss["same-content"]}>
                    <p>
                        Welcome to <strong>Poly Market!</strong> Your privacy is important to us. This Privacy Policy explains how we collect,
                        use, and protect your personal data when you use our app and services.
                    </p>

                    <h4>01. Information We Collect</h4>
                    <p>When you use My Poly Market, we may collect the following types of information:</p>
                    <h5>Personal Information You Provide</h5>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Name, email address, and profile details when you create an account.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Photos, bio, and other profile information you choose to share.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Messages and interactions with other users.
                        </li>
                    </ul>

                    <h5>Automatically Collected Information</h5>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Device information (e.g., model, operating system).
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Usage data (e.g., features accessed, time spent on the app).
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Location data (if you allow location services).
                        </li>
                    </ul>

                    <h5>Third-Party Information</h5>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> If you sign up via third-party services (e.g., Google, Apple, Facebook), we
                            may receive relevant data from those platforms.
                        </li>
                    </ul>

                    <h4>02. How We Use Your Information</h4>
                    <p>We use the collected data to:</p>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Provide and improve Poly Market services.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Personalize your experience and match you with relevant users.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Facilitate communication between users.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Monitor and enhance app security.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Send important updates and notifications.
                        </li>
                    </ul>

                    <h4>03. Sharing of Information</h4>
                    <p>We do not sell your personal data. However, we may share your information in the following cases:</p>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> With other users: Your profile information is visible to other users.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> With service providers: We may share necessary data with partners that help us
                            operate the app.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> For legal reasons: If required by law or to enforce our Terms and Conditions.
                        </li>
                    </ul>

                    <h4>04. Your Privacy Controls</h4>
                    <p>You can:</p>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Edit or delete your profile information at any time.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Manage location permissions through your device settings.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Disable notifications in app settings.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Request account deletion by contacting us at [Insert Contact Email].
                        </li>
                    </ul>

                    <h4>05. Data Security</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> We take reasonable security measures to protect your data.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> However, no online service is completely secure, and we cannot guarantee
                            absolute protection.
                        </li>
                    </ul>

                    <h4>06. Children's Privacy</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Poly Market is not intended for users under the age of 18 (or the minimum
                            age in your country).
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> If we learn that a minor has provided personal data, we will take steps to
                            delete it.
                        </li>
                    </ul>

                    <h4>07. Third-Party Links & Services</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> Poly Market may contain links to third-party websites or services.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> We are not responsible for their privacy practices. Please review their
                            policies separately.
                        </li>
                    </ul>

                    <h4>08. Changes to This Policy</h4>
                    <ul>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> We may update this Privacy Policy from time to time.
                        </li>
                        <li>
                            <img src="/img/list-icon.svg" alt="icon" /> We will notify you of any significant changes by posting an updated version in
                            the app.
                        </li>
                    </ul>
                    <h4>09. Contact Us</h4>
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
