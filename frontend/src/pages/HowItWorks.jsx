import { useContext, useEffect, useState, Fragment } from "react";
import { errorToastr, successToastr } from "../utils/toastr.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Service from "../services/Http.js";

export default function HowItWorks() {
    const [howItWorksContent, SetHowItWorksContent] = useState([]);

    const getHowItWorksData = async () => {
        try {
            const services = new Service();
            const response = await services.get("/user/get-how-it-works", {}, false);
            if (response?.status) {
                
                SetHowItWorksContent(response.data);
            } else {
                SetHowItWorksContent({});
            }
        } catch (error) {
            errorToastr(error?.message || "Failed to fetch How it works data");
        }
    };
    useEffect(() => {
        getHowItWorksData();
    }, []);

    return (
        <Fragment>
            <Header />

            <section className="static-page-section py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <h1 className="mb-4 text-center">How It Works</h1>

                            <div className="static-content">
                                {howItWorksContent.length > 0 ? (
                                    howItWorksContent.map((item, index) => (
                                        <div className="mb-4" key={item.id || index}>
                                            <h4>
                                                {index + 1}. {item.title}
                                            </h4>
                                            <p>{item.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No content available</p>
                                )}

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
