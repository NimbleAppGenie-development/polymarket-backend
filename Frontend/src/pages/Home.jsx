// import privacypolicycss from "../assets/css/static-pages/privacy-policy.module.css";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { errorToastr, successToastr } from "../utils/toastr.js";
import { HttpClient } from "../utils/request";
import { Link } from "react-router";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Service from "../services/Http.js";
import Swal from "sweetalert2";

export default function Home() {
    const { user } = useContext(AuthContext);
    const [marketData, setMarketData] = useState([]);
    const [predictionData, setPredictionData] = useState([]);
    const [trendingData, setTrendingData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [amount, setAmount] = useState("");
    const [hovered, setHovered] = useState({
        id: null,
        option: null,
    });
    const [loading, setLoading] = useState(false);

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
        return predictionData?.find((item) => item.questionId === questionId);
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
                                                        <div className="col-lg-6" key={index}>
                                                            <div className="politics-main-box">
                                                                <a href={`/home-detail/${item.id}`}>
                                                                    <div className="politics-header-box">
                                                                        <figure>
                                                                            <img
                                                                                src={`${import.meta.env.VITE_IMAGE_URL}/public/category/${item.category.image}`}
                                                                                alt="image"
                                                                            />
                                                                        </figure>
                                                                        <h4 className="text-uppercase">{item.category.name}</h4>
                                                                    </div>
                                                                </a>

                                                                <h3>{item.description}</h3>
                                                                <p>{item.createdAt}</p>

                                                                {user ? (
                                                                    <div className="politics-btn-box row">
                                                                        {item.options?.map((opt) => {
                                                                            const prediction = hasPredicted(item.id);

                                                                            return (
                                                                                <div className="col-6 mb-2" key={opt.id}>
                                                                                    <button
                                                                                        className={`btn option-btn w-100 ${
                                                                                            prediction?.selectedOptionId === opt.id ? "active" : ""
                                                                                        }`}
                                                                                        onClick={() => {
                                                                                            const alreadySelected = hasPredicted(item.id);

                                                                                            if (alreadySelected) {
                                                                                                Swal.fire({
                                                                                                    icon: "warning",
                                                                                                    title: "Already Selected",
                                                                                                    text: "You have already predicted on this question",
                                                                                                });
                                                                                                return;
                                                                                            }

                                                                                            setSelectedData({
                                                                                                userId: user.id,
                                                                                                categoryId: item.category.id,
                                                                                                itemId: item.id,
                                                                                                optionId: opt.id,
                                                                                            });

                                                                                            setShowPopup(true);
                                                                                        }}
                                                                                    >
                                                                                        {opt.option}

                                                                                        <span className="ms-1 text-muted">x{opt.multiplier}</span>
                                                                                    </button>
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
                                    {showPopup && (
                                        <div className="modal fade show d-block">
                                            <div className="modal-dialog modal-dialog-centered modal-md">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Enter Amount</h5>
                                                        <button className="btn-close" onClick={() => setShowPopup(false)}></button>
                                                    </div>

                                                    <div className="modal-body">
                                                        <form
                                                            onSubmit={(e) => {
                                                                e.preventDefault();

                                                                if (!amount || amount <= 0) {
                                                                    alert("Enter valid amount");
                                                                    return;
                                                                }

                                                                firstOption(
                                                                    selectedData.userId,
                                                                    selectedData.categoryId,
                                                                    selectedData.itemId,
                                                                    selectedData.optionId,
                                                                    amount,
                                                                );

                                                                setShowPopup(false);
                                                                setAmount("");
                                                            }}
                                                        >
                                                            <div className="login-form-parent">
                                                                <div className="form-group">
                                                                    <div className="mb-3">
                                                                        <label>Amount</label>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            placeholder="Enter amount"
                                                                            value={amount}
                                                                            step={1}
                                                                            min={1}
                                                                            onChange={(e) => setAmount(e.target.value)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <button className="btn btn-primaryx" type="submit">
                                                                    Confirm
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
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
