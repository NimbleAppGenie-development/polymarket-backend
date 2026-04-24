import { useContext, useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { errorToastr, successToastr } from "../utils/toastr.js";
import { Link, useParams } from "react-router";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Swal from "sweetalert2";
import Service from "../services/Http.js";
import { useNavigate } from "react-router-dom";
import CanvasChart from "../components/CanvasChart.jsx";

export default function HomeDetail() {
    const { user } = useContext(AuthContext);
    const [marketData, setMarketData] = useState([]);
    const [predictionData, setPredictionData] = useState([]);
    const [total, setTotal] = useState([]);
    const [loading, setLoading] = useState(false);
    const { detailId } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [amount, setAmount] = useState("");
    const [tradeData, setTradeData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [open, setOpen] = useState(true);
    const [graphData, setGraphData] = useState({});
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);
    const filterOptions = (options = []) => options.filter((opt) => opt.option !== "None of the Above");
    const options = filterOptions(marketData?.options || []);
    const visibleOptions = showAll ? options : options.slice(0, 3);

    const getMarketData = async () => {
        try {
            setLoading(true);
            const services = new Service();
            const response = await services.get(`/user/get-market-detail/${detailId}`, {}, false);

            if (response?.status) {
                setMarketData(response.data || []);
                setTotal(response.total || 0);
            } else {
                setMarketData([]);
                setTotal(0);
            }
        } catch (error) {
            errorToastr(error?.message || "Failed to fetch Market");
        } finally {
            setLoading(false);
        }
    };

    const getPredictionData = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const services = new Service();
            const response = await services.get(`/user/get-user-prdication-data/${user.id}`, {}, true);
            if (response?.status) {
                setPredictionData(response.data || []);
            } else {
                setPredictionData([]);
            }
        } catch (error) {
            errorToastr(error?.message || "Failed to fetch Prediction");
        } finally {
            setLoading(false);
        }
    };

    // fetch graph data for this question
    const getGraphData = async (questionId) => {
        try {
            const services = new Service();
            const response = await services.get(`/user/get-graph-data/${questionId}`, {}, false);

            const optionMap = {};

            const question = marketData;

            if (response?.status && response.data?.length) {
                response.data.forEach((item) => {
                    const name = item.option.trim();

                    if (name === "None of the Above") return;

                    if (!optionMap[name]) optionMap[name] = [];

                    const dateObj = new Date(item.time.replace(" ", "T"));

                    optionMap[name].push({
                        x: isNaN(dateObj) ? new Date() : dateObj,
                        y: Number(item.percentage) || 0,
                    });
                });
            }

            if (question?.options?.length) {
                question.options
                    .filter((opt) => opt.option !== "None of the Above")
                    .forEach((opt) => {
                        if (!optionMap[opt.option]) {
                            optionMap[opt.option] = [
                                {
                                    x: new Date(),
                                    y: 0,
                                },
                            ];
                        }
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

    const hasPredicted = (questionId) => {
        return predictionData?.find((item) => item.questionId === questionId);
    };

    const prediction = predictionData?.find((p) => String(p.questionId) === String(marketData?.id));

    const firstOption = async (userId, categoryId, questionId, selectedOption, amount) => {
        try {
            setLoading(true);
            const services = new Service();
            const response = await services.post("/user/user-prdication", {
                userId,
                categoryId,
                questionId,
                selectedOption,
                amount,
            });
            if (response?.status) {
                successToastr(response?.message || "Prediction submitted successfully");
                getMarketData();
                getPredictionData();
                getGraphData(questionId);
            } else {
                errorToastr(response?.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error in select option", error);
            errorToastr(error?.message || error?.response?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        getMarketData();
        if (user?.id) {
            getPredictionData();
        }
    }, [user?.id]);

    //fetch graph once marketData loaded and has an id
    useEffect(() => {
        if (marketData?.id) {
            getGraphData(marketData.id);
        }
    }, [marketData?.id]);

    // const filterOptions = (options = []) => options.filter((opt) => opt.option !== "None of the Above");

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
                                {marketData?.category?.name || "Loading..."}
                                {/* {response.data?.category?.name} */}
                            </button>
                        </li>
                    </ul>

                    <div className="tabing-content-wrapper">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="politics-main-box politics-main-details-box">
                                    <div className="politics-header-box">
                                        <figure>
                                            <img
                                                src={`${import.meta.env.VITE_IMAGE_URL}/public/category/${marketData?.category?.image}`}
                                                // alt="image"
                                            />
                                        </figure>
                                        <h3>{marketData?.question}</h3>
                                        {/* <h4>{marketData?.description}</h4> */}
                                    </div>
                                    {/* <div className="details-user-right-parent">
                                        <ul>
                                            <li>
                                                <a href="#">
                                                    <img src="/img/comment.svg" alt="icon" />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src="/img/copy.svg" alt="icon" />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src="/img/download.svg" alt="icon" />
                                                </a>
                                            </li>
                                        </ul>
                                    </div> */}
                                </div>

                                {/* <div className="forecast-main-box">
                                    <p>56.7 forecast</p>
                                    <span>
                                        <img src="/img/arrow-top.svg" alt="icon" /> 38.3
                                    </span>
                                </div> */}

                                {/* Graph Section */}
                                <div className="details-page-chart-parent">
                                    {marketData?.id && graphData[marketData.id] ? (
                                        <CanvasChart questionId={marketData.id} chartData={graphData[marketData.id]} />
                                    ) : (
                                        <div
                                            style={{
                                                height: 280,
                                                display: "flex",
                                                alignItems: "left",
                                                justifyContent: "left",
                                                color: "#aaa",
                                                fontSize: 13,
                                                background: "#f9f9f9",
                                                borderRadius: 8,
                                            }}
                                        >
                                            {loading ? "Loading chart..." : "No graph data yet"}
                                        </div>
                                    )}
                                </div>

                                <div className="details-page-tabing-wraper">
                                    <div className="details-page-header-parent">
                                        <p>${marketData.totalEntryAmountOnQuestion?.toLocaleString() || "0"} Vol</p>
                                        {/* <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="home-tab001" data-bs-toggle="tab" data-bs-target="#home001" type="button" role="tab">6H</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="profile-tab002" data-bs-toggle="tab" data-bs-target="#profile002" type="button" role="tab">1D</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="contact-tab003" data-bs-toggle="tab" data-bs-target="#contact003" type="button" role="tab">1W</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="contact-tab004" data-bs-toggle="tab" data-bs-target="#contact004" type="button" role="tab">1M</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="contact-tab005" data-bs-toggle="tab" data-bs-target="#contact005" type="button" role="tab">ALL</button>
                                            </li>
                                        </ul> */}
                                    </div>

                                    <div className="details-page-tbaing-content-parent">
                                        <div className="tab-content" id="myTabContent">
                                            <div className="tab-pane fade show active" id="home001" role="tabpanel">
                                                <div className="details-page-tbaing-content">
                                                    <div className="center-box">
                                                        <p>Chance</p>
                                                    </div>
                                                    <div className="main-box-inner-details-box">
                                                        {visibleOptions.map((opt) => (
                                                            <div key={opt.id}>
                                                                <span>{opt.option}</span>
                                                                <span>{opt.multiplier}x</span>
                                                                <div className="counter-box-btn">
                                                                    <span>{opt.percentage}%</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Show More / Less Button */}
                                                    {options.length > 3 && (
                                                        <div className="show-toggle">
                                                            <span style={{ cursor: "pointer", color: "black" }} onClick={() => setShowAll(!showAll)}>
                                                                {showAll ? "Show Less" : `${options.length - 3} more`}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* <div className="details-page-tbaing-content-box">
                                                        <div className="show-less-content">Show Less Market</div>
                                                    </div> */}
                                                    <div className="details-page-bottom-accordion">
                                                        <div className="accordion" id="accordionExample">
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="headingOne">
                                                                    <button
                                                                        className={`accordion-button ${open ? "" : "collapsed"}`}
                                                                        type="button"
                                                                        onClick={() => setOpen((prev) => !prev)}
                                                                    >
                                                                        Market Rules
                                                                    </button>
                                                                </h2>
                                                                <div className={`accordion-collapse collapse ${open ? "show" : ""}`}>
                                                                    <div className="accordion-body">
                                                                        <p>{marketData?.marketRules}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="details-price-box-parent">
                                    <div className="politics-header-box">
                                        <figure>
                                            <img
                                                src={`${import.meta.env.VITE_IMAGE_URL}/public/category/${marketData?.category?.image}`}
                                                // alt="image"
                                            />
                                        </figure>
                                        <h5>{marketData?.category?.name}</h5>
                                    </div>
                                    <h4>{marketData?.question}</h4>

                                    <div className="details-page-tbaing-right">
                                        <ul>
                                            {user ? (
                                                <div className="politics-btn-box d-flex flex-column">
                                                    {filterOptions(marketData?.options).map((opt) => {
                                                        const alreadySelected = String(prediction?.selectedOptionId) === String(opt.id);
                                                        return (
                                                            <div
                                                                key={opt.id}
                                                                className={`option-row-parent ${alreadySelected ? "active" : ""}`}
                                                                onClick={() => {
                                                                    const alreadyPredicted = hasPredicted(marketData.id);
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
                                                                        categoryId: marketData.category?.id,
                                                                        questionId: marketData.id,
                                                                        question: marketData.question,
                                                                        options: filterOptions(marketData.options),
                                                                    });
                                                                    setSelectedOption(opt.id);
                                                                    setShowPopup(true);
                                                                }}
                                                            >
                                                                <div className="option-row">
                                                                    {opt.image && (
                                                                        <img
                                                                            src={`${import.meta.env.VITE_IMAGE_URL}/public/question/${opt.image}`}
                                                                            alt={opt.option}
                                                                            className="option-img"
                                                                        />
                                                                    )}
                                                                </div>
                                                                <span className="option-text">{opt.option}</span>
                                                                <span className="option-multiplier">{opt.multiplier || "1x"}x</span>
                                                                <span className="option-percentage">{opt.percentage || 0}%</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="politics-btn-box d-flex flex-column">
                                                    {filterOptions(marketData?.options).map((opt) => (
                                                        <div
                                                            key={opt.id}
                                                            className="option-row-parent"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#exampleModal"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="option-row flex-parent">
                                                                {opt.image && (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_IMAGE_URL}/public/question/${opt.image}`}
                                                                        alt={opt.option}
                                                                        className="option-img"
                                                                    />
                                                                )}
                                                                <span className="option-text">{opt.option}</span>
                                                            </div>
                                                            <span className="option-multiplier">{opt.multiplier || "1x"}x</span>
                                                            <span className="option-percentage">{opt.percentage || 0}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showPopup && tradeData && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content p-3">
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
                                        setAmount("");
                                    }}
                                />
                            </div>
                            <div className="d-flex flex-column gap-2 mb-3">
                                {filterOptions(tradeData.options).map((opt) => (
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

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Enter amount"
                                value={amount}
                                min={1}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <button
                                className="btn btn-success w-100"
                                disabled={!selectedOption}
                                onClick={() => {
                                    if (!amount) return errorToastr("Enter amount");
                                    if (!selectedOption) return errorToastr("Select option");
                                    firstOption(tradeData.userId, tradeData.categoryId, tradeData.questionId, selectedOption, amount);
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

            <Footer />
        </div>
    );
}
