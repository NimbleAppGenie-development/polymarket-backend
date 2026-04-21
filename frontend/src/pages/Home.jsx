// import privacypolicycss from "../assets/css/static-pages/privacy-policy.module.css";
import { Fragment, useContext, useEffect, useState } from "react";
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
import CanvasChart from "../components/CanvasChart.jsx";

export default function Home() {
    const { user } = useContext(AuthContext);
    const [marketData, setMarketData] = useState([]);
    const [predictionData, setPredictionData] = useState([]);
    const [trendingData, setTrendingData] = useState([]);
    const [showSlider, setShowSlider] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [amount, setAmount] = useState("");
    const [hovered, setHovered] = useState({ id: null, option: null });
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const navigate = useNavigate();
    const [tradeData, setTradeData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [graphData, setGraphData] = useState({});
    const [activeChartId, setActiveChartId] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeItem = showSlider[activeIndex];

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

    useEffect(() => {
        const showSlider = async () => {
            try {
                setLoading(true);

                const services = new Service();

                const response = await services.get("/user/get-show-slider", {}, false);
                
                if (response?.status) {
                    setShowSlider(response?.data || []);
                } else {
                    setShowSlider([]);
                }
            } catch (error) {
                console.error("GET SHOW SLIDER ERROR:", error);

                errorToastr(error?.message || "Failed to fetch show slider");
                setShowSlider([]);
            } finally {
                setLoading(false);
            }
        };
        showSlider();
    }, []);

    const getGraphData = async (questionId) => {
        try {
            const services = new Service();

            const response = await services.get(`/user/get-graph-data/${questionId}`, {}, false);

            const optionMap = {};

            const question = marketData.find((q) => String(q.id) === String(questionId));

            if (response?.status && response.data.length > 0) {
                response.data.forEach((item) => {
                    const name = item.option.trim();

                    if (!optionMap[name]) {
                        optionMap[name] = [];
                    }

                    optionMap[name].push({
                        x: new Date(item.time.replace(" ", "T")),
                        y: Number(item.percentage),
                    });
                });
            } else if (question?.options) {
                question.options.forEach((opt) => {
                    optionMap[opt.option] = [
                        {
                            x: new Date(),
                            y: 0,
                        },
                    ];
                });
            }

            setGraphData((prev) => ({
                ...prev,
                [questionId]: optionMap,
            }));
        } catch (error) {
            console.error("GRAPH ERROR:", error);
        }
    };

    useEffect(() => {
        if (!marketData.length) return;

        marketData.forEach((item) => {
            if (!graphData[item.id]) {
                getGraphData(item.id);
            }
        });
    }, [marketData]);


    useEffect(() => {
        if (!marketData.length) return;
        marketData.forEach((item) => {
            if (!graphData[item.id]) {
                getGraphData(item.id);
            }
        });
    }, [marketData]);

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
                                {activeItem?.category?.name || "Loading..."}
                            </button>
                        </li>
                    </ul>
                    <div className="tabing-content-wrapper">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="treding-color-box-parent">
                                    {/* Slider Header */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: 12,
                                            padding: "8px 4px",
                                        }}
                                    >
                                        {/* Prev Button */}
                                        <button
                                            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                                            disabled={activeIndex === 0}
                                            style={{
                                                background: activeIndex === 0 ? "#eee" : "#6366f1",
                                                color: activeIndex === 0 ? "#aaa" : "#fff",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: 36,
                                                height: 36,
                                                cursor: activeIndex === 0 ? "not-allowed" : "pointer",
                                                fontSize: 18,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            ‹
                                        </button>

                                        {/* Question Title + Counter */}
                                        <div style={{ textAlign: "center", flex: 1, padding: "0 12px" }}>
                                            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 2 }}>
                                                {activeIndex + 1} of {marketData.length}
                                            </div>
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: 15,
                                                    color: "#333",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {activeItem?.question || ""}
                                            </div>
                                            {/* <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{activeItem?.category?.name || ""}</div> */}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={() => setActiveIndex((prev) => Math.min(prev + 1, marketData.length - 1))}
                                            disabled={activeIndex === marketData.length - 1}
                                            style={{
                                                background: activeIndex === marketData.length - 1 ? "#eee" : "#6366f1",
                                                color: activeIndex === marketData.length - 1 ? "#aaa" : "#fff",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: 36,
                                                height: 36,
                                                cursor: activeIndex === marketData.length - 1 ? "not-allowed" : "pointer",
                                                fontSize: 18,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            ›
                                        </button>
                                    </div>

                                    {/* Chart — only active question */}
                                    {activeItem && graphData[activeItem.id] ? (
                                        <CanvasChart questionId={activeItem.id} chartData={graphData[activeItem.id]} />
                                    ) : (
                                        <div
                                            style={{
                                                height: 260,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#aaa",
                                                fontSize: 13,
                                                background: "#f9f9f9",
                                                borderRadius: 8,
                                            }}
                                        >
                                            {marketData.length === 0 ? "No questions available" : "Loading chart..."}
                                        </div>
                                    )}

                                    {/* Dot indicators */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 6,
                                            marginTop: 12,
                                        }}
                                    >
                                        {marketData.map((_, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setActiveIndex(i)}
                                                style={{
                                                    width: i === activeIndex ? 20 : 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    background: i === activeIndex ? "#6366f1" : "#ddd",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease",
                                                }}
                                            />
                                        ))}
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
                                                    <h3>
                                                        <a href={item.link || "#"}>{item.question}</a>
                                                    </h3>
                                                    {/* <p className="date-text">{item.createdAt}</p> */}
                                                </div>
                                                <div className="trading-question-right"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
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
                                                            className="col-lg-4"
                                                            key={index}
                                                            onClick={(e) => {
                                                                if (e.target.closest(".option-row-parent")) return;

                                                                // navigate(`/home-detail/${item.id}`);
                                                                getGraphData(item.id);
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
                                                                {/* <p>{item.createdAt}</p> */}

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
                                                                                        <div className="option-row flex-parent">
                                                                                            <img
                                                                                                src={`${import.meta.env.VITE_IMAGE_URL}/public/question/${opt.image}`}
                                                                                                alt={opt.option}
                                                                                                className="option-img"
                                                                                            />
                                                                                            <span className="option-text">{opt.option}</span>
                                                                                        </div>

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
                                                                    <div className="politics-btn-box d-flex flex-column">
                                                                        {item.options
                                                                            ?.filter((opt) => opt.option !== "None of the Above")
                                                                            .map((opt) => (
                                                                                <div
                                                                                    key={opt.id}
                                                                                    className="option-row-parent"
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#exampleModal"
                                                                                >
                                                                                    <div className="option-row flex-parent">
                                                                                        <img
                                                                                            src={`${import.meta.env.VITE_IMAGE_URL}/public/question/${opt.image}`}
                                                                                            alt={opt.option}
                                                                                            className="option-img"
                                                                                        />

                                                                                        <span className="option-text">{opt.option}</span>
                                                                                    </div>

                                                                                    <span className="option-multiplier">
                                                                                        {opt.multiplier || "1x"}x
                                                                                    </span>

                                                                                    <span className="option-percentage">{opt.percentage || 0}%</span>
                                                                                </div>
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
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
