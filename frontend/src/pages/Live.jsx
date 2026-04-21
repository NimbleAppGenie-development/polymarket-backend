import { Fragment, useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Service from "../services/Http.js";
import { errorToastr } from "../utils/toastr.js";
import AuthContext from "../utils/auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Live() {
    const { user } = useContext(AuthContext);

    const [liveData, setLiveData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getLiveData = async () => {
        try {
            setLoading(true);

            const services = new Service();

            const response = await services.get("/user/get-live-data", {}, false);

            if (response?.status) {
                setLiveData(response?.data || []);
            } else {
                setLiveData([]);
            }
        } catch (error) {
            console.error("LIVE ERROR:", error);
            errorToastr(error?.message || "Failed to fetch live data");
            setLiveData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLiveData();
    }, []);

    return (
        <div className="home-page">
            <Header />

            <section className="banner-section-content">
                <div className="container">
                    <div className="trending-main-parent politics-main-content-parent">
                        <h2>
                            🔴 Live Markets
                            <img src="img/rightarrow.svg" alt="icon" />
                        </h2>

                        <div className="row">
                            {loading ? (
                                <div className="text-center py-5">Loading...</div>
                            ) : liveData.length === 0 ? (
                                <div className="text-center py-5 text-muted">No live markets available</div>
                            ) : (
                                liveData.map((item, index) => (
                                    <div className="col-lg-4" key={item.id || index}>
                                        <div className="politics-main-box">
                                            {/* HEADER  */}
                                            <div className="politics-header-box">
                                                <figure>
                                                    <img
                                                        src={`${import.meta.env.VITE_IMAGE_URL}/public/category/${item.category?.image}`}
                                                        alt="image"
                                                    />
                                                </figure>
                                                <h4 className="text-uppercase">{item.category?.name}</h4>
                                            </div>

                                            {/* QUESTION */}
                                            <h3>
                                                <span style={{ color: "red" }}>● LIVE</span> {item.question}
                                            </h3>

                                            {/* OPTIONS */}
                                            <div className="politics-btn-box d-flex flex-column">
                                                {item.options
                                                    ?.filter((opt) => opt.option !== "None of the Above")
                                                    ?.map((opt) => (
                                                        <div key={opt.id} className="option-row-parent">
                                                            <div className="option-row flex-parent">
                                                                <img
                                                                    src={`${import.meta.env.VITE_IMAGE_URL}/public/question/${opt.image}`}
                                                                    alt={opt.option}
                                                                    className="option-img"
                                                                />

                                                                <span className="option-text">{opt.option}</span>
                                                            </div>

                                                            {/* MULTIPLIER */}
                                                            <span className="option-multiplier">{opt.multiplier || "1x"}x</span>

                                                            {/* PERCENTAGE */}
                                                            <span className="option-percentage">{opt.percentage || 0}%</span>
                                                        </div>
                                                    ))}
                                            </div>
                                            <div>
                                            <button className="btn btn-primaryx w-100 mt-3" onClick={() => navigate(`/home-detail/${item.id}`)}>
                                                View Details
                                            </button>
                                        </div>
                                        </div>
                                        
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
