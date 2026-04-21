import { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HowItWorks() {
    return (
        <Fragment>
            <Header />

            <section className="static-page-section py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">

                            <h1 className="mb-4 text-center">How It Works</h1>

                            <div className="static-content">

                                <div className="mb-4">
                                    <h4>1. Explore Markets</h4>
                                    <p>
                                        Browse through different categories and discover trending questions.
                                        Each market represents a real-world event where you can make predictions.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h4>2. Analyze Data</h4>
                                    <p>
                                        View live charts and insights to understand how others are predicting.
                                        Use this data to make informed decisions before placing your prediction.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h4>3. Make a Prediction</h4>
                                    <p>
                                        Choose an option and enter the amount you want to invest.
                                        Your prediction is recorded instantly.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h4>4. Track Performance</h4>
                                    <p>
                                        Monitor your predictions and see how they perform over time
                                        from your dashboard.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h4>5. Earn Rewards</h4>
                                    <p>
                                        If your prediction is correct, you earn rewards based on
                                        the multiplier shown at the time of prediction.
                                    </p>
                                </div>

                                <div className="mt-5 text-center">
                                    <h5>Start predicting smarter 🚀</h5>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </Fragment>
    );
}