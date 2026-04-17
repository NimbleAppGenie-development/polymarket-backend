// import privacypolicycss from "../assets/css/static-pages/privacy-policy.module.css";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { errorToastr, successToastr } from "../utils/toastr.js";
import { HttpClient } from "../utils/request";
// import { Link } from "react-router";
import { Link } from "react-router-dom";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Service from "../services/Http.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { user } = useContext(AuthContext);
    const [marketData, setMarketData] = useState([]);
    const [predictionData, setPredictionData] = useState([]);
    const [trendingData, setTrendingData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [amount, setAmount] = useState("");
    const [hovered, setHovered] = useState({ id: null, option: null });
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const navigate = useNavigate();
    const [tradeData, setTradeData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const getMarketList = async () => {
        try {
            setLoading(true);

            const services = new Service();

            const response = await services.get("/user/get-market-list", {}, false);

            if (response?.status) {
                setMarketData(response?.data || []);
            } else {
                setMarketData([]);
            }
        } catch (error) {
            console.error("GET MARKET ERROR:", error);

            errorToastr(error?.message || "Failed to fetch Market");
            setMarketData([]);
        } finally {
            setLoading(false);
        }
    };

    const getPredictionData = async () => {
        if (!user?.id) {
            console.warn("User ID not available");
            return;
        }

        try {
            setLoading(true);

            const services = new Service();

            const response = await services.get(`/user/get-user-prdication-data/${user.id}`, {}, true);

            if (response?.status) {
                setPredictionData(response?.data || []);
            } else {
                setPredictionData([]);
            }
        } catch (error) {
            console.error("GET PREDICTION ERROR:", error);

            errorToastr(error?.message || "Failed to fetch prediction data");

            setPredictionData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMarketList();
        if (user?.id) {
            getPredictionData();
        }
    }, [user]);

    const groupedData = marketData?.reduce((acc, item) => {
        const categoryName = item.category?.name || "Other";

        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }

        acc[categoryName].push(item);

        return acc;
    }, {});

    const firstOption = async (userId, categoryId, questionId, selectedOption, amount) => {
        try {
            setLoading(true);

            const services = new Service();

            const response = await services.post(
                "/user/user-prdication",
                {
                    userId,
                    categoryId,
                    questionId,
                    selectedOption,
                    amount,
                },
                true,
            );
            if (response?.status) {
                successToastr(response?.message || "Prediction submitted successfully");

                await getMarketList();

                if (user?.id) {
                    await getPredictionData();
                }
            } else {
                errorToastr(response?.message || "Failed to submit prediction");
            }
        } catch (error) {
            console.error("FIRST OPTION ERROR:", error);

            errorToastr(error?.message || error?.response?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getTrendingList = async () => {
            try {
                setLoading(true);

                const services = new Service();

                const response = await services.get("/user/get-trending-list", {}, false);
                if (response?.status) {
                    setTrendingData(response?.data || []);
                } else {
                    setTrendingData([]);
                }
            } catch (error) {
                console.error("GET TRENDING ERROR:", error);

                errorToastr(error?.message || "Failed to fetch Trending");
                setTrendingData([]);
            } finally {
                setLoading(false);
            }
        };
        getTrendingList();
    }, []);

    const hasPredicted = (questionId) => {
        return predictionData?.find((item) => String(item.questionId) === String(questionId));
    };

    return (
        <div className="home-page">
            <Header />

            <section className="banner-section-content">
                <div className="container">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link active"
                                id="home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#home"
                                type="button"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                            >
                                Sports
                            </button>
                        </li>
                    </ul>
                    <div className="tabing-content-wrapper">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="treding-color-box-parent">
                                    <div className="owl-custom-nav" id="owlCustomNav">
                                        <button className="owl-custom-prev">
                                            <i className="fa fa-angle-left"></i>
                                        </button>
                                        <span className="owl-counter-text">
                                            <span id="owlCurrentSlide">1</span> of <span id="owlTotalSlides">3</span>
                                        </span>
                                        <button className="owl-custom-next">
                                            <i className="fa fa-angle-right"></i>
                                        </button>
                                    </div>
                                    <div className="tab-content" id="myTabContent">
                                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                            <div className="owl_1 owl-carousel owl-theme">
                                                <div className="item">
                                                    <div className="trending-banner-content">
                                                        <h2>How long will the government shutdown last?</h2>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="market-content-parent">
                                                                    <ul>
                                                                        <li>Market</li>
                                                                        <li>Pays out</li>
                                                                        <li>Odds</li>
                                                                    </ul>
                                                                    <ul>
                                                                        <li>
                                                                            <a href="#">Yes</a>
                                                                        </li>
                                                                        <li>1.93%</li>
                                                                        <li>
                                                                            <span>50%</span>
                                                                        </li>
                                                                    </ul>
                                                                    <ul>
                                                                        <li>
                                                                            <a href="#" className="nobtn">
                                                                                No
                                                                            </a>
                                                                        </li>
                                                                        <li>0.93%</li>
                                                                        <li>
                                                                            <span>30%</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="market-bottom-content">
                                                                    <p>$645,765 vol</p>
                                                                    <p>11 markets</p>
                                                                </div>
                                                                <div className="markets-bottom-text">
                                                                    <p>
                                                                        <strong>News:</strong> dolor sit amet, consetetur sadipscing elitr, sed diam
                                                                        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                                                                        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                                                                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                                                                        Lorem ipsum.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div id="chartContainer" style={{ height: 370, width: "100%" }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="trending-banner-content">
                                                        <h2>How long will the government shutdown last?</h2>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="market-content-parent">
                                                                    <ul>
                                                                        <li>Market</li>
                                                                        <li>Pays out</li>
                                                                        <li>Odds</li>
                                                                    </ul>
                                                                    <ul>
                                                                        <li>
                                                                            <a href="#">Yes</a>
                                                                        </li>
                                                                        <li>1.93%</li>
                                                                        <li>
                                                                            <span>50%</span>
                                                                        </li>
                                                                    </ul>
                                                                    <ul>
                                                                        <li>
                                                                            <a href="#" className="nobtn">
                                                                                No
                                                                            </a>
                                                                        </li>
                                                                        <li>0.93%</li>
                                                                        <li>
                                                                            <span>30%</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="market-bottom-content">
                                                                    <p>$645,765 vol</p>
                                                                    <p>11 markets</p>
                                                                </div>
                                                                <div className="markets-bottom-text">
                                                                    <p>
                                                                        <strong>News:</strong> dolor sit amet, consetetur sadipscing elitr, sed diam
                                                                        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                                                                        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                                                                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                                                                        Lorem ipsum.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div id="chartContainerone" style={{ height: "370px", width: "100%" }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="trending-banner-content">
                                                        <h2>How long will the government shutdown last?</h2>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="market-content-parent">
                                                                    <ul>
                                                                        <li>Market</li>
                                                                        <li>Pays out</li>
                                                                        <li>Odds</li>
                                                                    </ul>
                                                                    <ul>
                                                                        <li>
                                                                            <a href="#">Yes</a>
                                                                        </li>
                                                                        <li>1.93%</li>
                                                                        <li>
                                                                            <span>50%</span>
                                                                        </li>
                                                                    </ul>
                                                                    <ul>
                                                                        <li>
                                                                            <a href="#" className="nobtn">
                                                                                No
                                                                            </a>
                                                                        </li>
                                                                        <li>0.93%</li>
                                                                        <li>
                                                                            <span>30%</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="market-bottom-content">
                                                                    <p>$645,765 vol</p>
                                                                    <p>11 markets</p>
                                                                </div>
                                                                <div className="markets-bottom-text">
                                                                    <p>
                                                                        <strong>News:</strong> dolor sit amet, consetetur sadipscing elitr, sed diam
                                                                        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                                                                        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                                                                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                                                                        Lorem ipsum.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div id="chartContainertwo" style={{ height: "370px", width: "100%" }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade fade" id="home01" role="tabpanel" aria-labelledby="home-tab01">
                                            <div className="owl_1 owl-carousel owl-theme"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="trending-main-parent">
                                    <h2>
                                        Trending <img src="img/rightarrow.svg" alt="icon" />
                                    </h2>

                                    <div className="trading-content-right-box">
                                        {trendingData?.map((item, index) => (
                                            <div className="trading-content-right-box-inner" key={item.id || index}>
                                                <div className="trading-question-left">
                                                    <span>{index + 1}.</span>

                                                    <p className="date-text">{item.createdAt}</p>

                                                    <h3>
                                                        <a href={item.link || "#"}>{item.question}</a>
                                                    </h3>
                                                </div>

                                                <div className="trading-question-right"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="trending-main-parent politics-main-content-parent">
                                    {Object.entries(groupedData || {}).map(([categoryName, items]) => (
                                        <div key={categoryName}>
                                            <h2>
                                                {categoryName}
                                                <img src="img/rightarrow.svg" alt="icon" />
                                            </h2>

                                            <div className="row">
                                                {items.map((item, index) => {
                                                    const prediction = hasPredicted(item.id);

                                                    return (
                                                        <div
                                                            className="col-lg-6"
                                                            key={index}
                                                            onClick={(e) => {
                                                                if (e.target.closest(".option-row-parent")) return;

                                                                navigate(`/home-detail/${item.id}`);
                                                            }}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <div className="politics-main-box">
                                                                <div className="politics-header-box">
                                                                    <figure>
                                                                        <img
                                                                            src={`${import.meta.env.VITE_IMAGE_URL}/public/category/${item.category.image}`}
                                                                            alt="image"
                                                                        />
                                                                    </figure>
                                                                    <h4 className="text-uppercase">{item.category.name}</h4>
                                                                </div>

                                                                <h3>{item.question}</h3>
                                                                <p>{item.createdAt}</p>

                                                                {user ? (
                                                                    <div className="politics-btn-box d-flex flex-column">
                                                                        {item.options
                                                                            ?.filter((opt) => opt.option !== "None of the Above")
                                                                            .map((opt) => {
                                                                                const alreadySelected =
                                                                                    String(prediction?.selectedOptionId) === String(opt.id);

                                                                                return (
                                                                                    <div
                                                                                        key={opt.id}
                                                                                        className={`option-row-parent ${alreadySelected ? "active" : ""}`}
                                                                                        onClick={() => {
                                                                                            const alreadyPredicted = hasPredicted(item.id);

                                                                                            if (alreadyPredicted) {
                                                                                                Swal.fire({
                                                                                                    icon: "warning",
                                                                                                    title: "Already Selected",
                                                                                                    text: "You have already predicted on this question",
                                                                                                });
                                                                                                return;
                                                                                            }

                                                                                            setTradeData({
                                                                                                userId: user.id,
                                                                                                categoryId: item.category?.id,
                                                                                                questionId: item.id,
                                                                                                question: item.question,
                                                                                                options: item.options?.filter(
                                                                                                    (opt) => opt.option !== "None of the Above",
                                                                                                ),
                                                                                            });

                                                                                            setSelectedOption(opt.id);

                                                                                            setShowPopup(true);
                                                                                        }}
                                                                                    >
                                                                                        <div className="option-row">
                                                                                            <img
                                                                                                src={`${import.meta.env.VITE_IMAGE_URL}/public/question/${opt.image}`}
                                                                                                alt={opt.option}
                                                                                                className="option-img"
                                                                                            />
                                                                                        </div>
                                                                                        <span className="option-text">{opt.option}</span>

                                                                                        <span className="option-multiplier">
                                                                                            {opt.multiplier || "1x"}x
                                                                                        </span>

                                                                                        <span className="option-percentage">
                                                                                            {opt.percentage || 0}%
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                    </div>
                                                                ) : (
                                                                    <div className="politics-btn-box">
                                                                        {item.options?.map((opt) => (
                                                                            <button
                                                                                key={opt.id}
                                                                                className="btn option-btn"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#exampleModal"
                                                                            >
                                                                                {opt.option}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    {showPopup && tradeData && (
                                        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                                            <div className="modal-dialog modal-dialog-centered modal-md">
                                                <div className="modal-content p-3">
                                                    {/* Title */}
                                                    <div className="modal-header border-0">
                                                        <div>
                                                            {/* <h5 className="modal-title">{tradeData.question}</h5> */}
                                                            <h5 className="modal-title">{tradeData.options?.map((opt) => opt.option).join(" / ")}</h5>
                                                            <small className="text-muted">Select an option to trade</small>
                                                        </div>

                                                        <button
                                                            className="btn-close"
                                                            onClick={() => {
                                                                setShowPopup(false);
                                                                setTradeData(null);
                                                                setSelectedOption(null);
                                                            }}
                                                        />
                                                    </div>

                                                    {/* OPTIONS LIST (IMPORTANT PART) */}
                                                    <div className="d-flex flex-column gap-2 mb-3">
                                                        {tradeData.options.map((opt) => (
                                                            <div
                                                                key={opt.id}
                                                                onClick={() => setSelectedOption(opt.id)}
                                                                style={{
                                                                    padding: "12px",
                                                                    border: "1px solid #ddd",
                                                                    borderRadius: "10px",
                                                                    cursor: "pointer",
                                                                    background: selectedOption === opt.id ? "#e6fff2" : "#fff",
                                                                    borderColor: selectedOption === opt.id ? "#00c853" : "#ddd",
                                                                }}
                                                            >
                                                                <strong>{opt.option}</strong>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Amount */}
                                                    <input
                                                        type="number"
                                                        className="form-control mb-3"
                                                        placeholder="Enter amount"
                                                        value={amount}
                                                        min={1}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                    />

                                                    {/* Confirm */}
                                                    <button
                                                        className="btn btn-success w-100"
                                                        disabled={!selectedOption}
                                                        onClick={() => {
                                                            if (!amount) return errorToastr("Enter amount");
                                                            if (!selectedOption) return errorToastr("Select option");

                                                            firstOption(
                                                                tradeData.userId,
                                                                tradeData.categoryId,
                                                                tradeData.questionId,
                                                                selectedOption,
                                                                amount,
                                                            );

                                                            setShowPopup(false);
                                                            setAmount("");
                                                            setTradeData(null);
                                                            setSelectedOption(null);
                                                        }}
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* <div className="col-lg-4">
                                <div className="trending-main-parent margin-top-default">
                                    <h2>
                                        New <img src="img/rightarrow.svg" alt="icon" />
                                    </h2>
                                    <div className="trading-content-right-box">
                                        <div className="trading-content-right-box-inner">
                                            <div className="trading-question-left">
                                                <span>1.</span>
                                                <h3>
                                                    <a href="#">How long will the government shutdown last?</a>
                                                </h3>
                                                <p>At least 60 days</p>
                                            </div>
                                            <div className="trading-question-right">
                                                <h3>50 %</h3>
                                                <a href="#">
                                                    <img src="img/arrow-top.svg" alt="icon" /> 2
                                                </a>
                                            </div>
                                        </div>
                                        <div className="trading-content-right-box-inner">
                                            <div className="trading-question-left">
                                                <span>2.</span>
                                                <h3>
                                                    <a href="#">When will DHS be funded again?</a>
                                                </h3>
                                                <p>Before Apr 1, 2026</p>
                                            </div>
                                            <div className="trading-question-right">
                                                <h3>50 %</h3>
                                                <a href="#">
                                                    <img src="img/arrow-top.svg" alt="icon" /> 2
                                                </a>
                                            </div>
                                        </div>
                                        <div className="trading-content-right-box-inner">
                                            <div className="trading-question-left">
                                                <span>3.</span>
                                                <h3>
                                                    <a href="#">Who will win the 2026 Nepal House of Representatives election?</a>
                                                </h3>
                                                <p>RSP</p>
                                            </div>
                                            <div className="trading-question-right">
                                                <h3>50 %</h3>
                                                <a href="#">
                                                    <img src="img/arrow-top.svg" alt="icon" /> 2
                                                </a>
                                            </div>
                                        </div>
                                        <div className="trading-content-right-box-inner">
                                            <div className="trading-question-left">
                                                <span>4.</span>
                                                <h3>
                                                    <a href="#">How long will the government shutdown last?</a>
                                                </h3>
                                                <p>At least 60 days</p>
                                            </div>
                                            <div className="trading-question-right">
                                                <h3>50 %</h3>
                                                <a href="#">
                                                    <img src="img/arrow-top.svg" alt="icon" /> 2
                                                </a>
                                            </div>
                                        </div>
                                        <div className="trading-content-right-box-inner">
                                            <div className="trading-question-left">
                                                <span>5.</span>
                                                <h3>
                                                    <a href="#">How long will the government shutdown last?</a>
                                                </h3>
                                                <p>At least 60 days</p>
                                            </div>
                                            <div className="trading-question-right">
                                                <h3>50 %</h3>
                                                <a href="#">
                                                    <img src="img/arrow-top.svg" alt="icon" /> 2
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
