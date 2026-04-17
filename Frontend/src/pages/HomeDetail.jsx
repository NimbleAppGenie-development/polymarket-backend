// import privacypolicycss from "../assets/css/static-pages/privacy-policy.module.css";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { errorToastr, successToastr } from "../utils/toastr.js";
import { HttpClient } from "../utils/request.js";
import { Link, useParams } from "react-router";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Swal from "sweetalert2";
import Service from "../services/Http.js";
export default function Home() {
    const { user } = useContext(AuthContext);
    const [marketData, setMarketData] = useState([]);
    const [predictionData, setPredictionData] = useState([]);
    const [total, setTotal] = useState([]);
    const [loading, setLoading] = useState(false);
    const { detailId } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [amount, setAmount] = useState("");
    const [hovered, setHovered] = useState({
        id: null,
        option: null,
    });
    const [tradeData, setTradeData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [open, setOpen] = useState(true);

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

    const hasPredicted = (questionId) => {
        return predictionData?.find((item) => item.questionId === questionId);
    };
    const prediction = predictionData?.find((p) => String(p.questionId) === String(marketData?.id));

    const firstOption = async (userId, categoryId, questionId, selectedOption, amount) => {
        try {
            const services = new Service();

            const data = await services.post("/user/user-prdication", {
                userId,
                categoryId,
                questionId,
                selectedOption,
                amount,
            });

            if (data?.status) {
                getMarketData();
                getPredictionData();
            }
        } catch (error) {
            console.log("Error in select option", error);
        }
    };

    useEffect(() => {
        getMarketData();

        if (user?.id) {
            getPredictionData();
        }
    }, [user?.id, marketData?.id]);

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
                                Sport
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
                                                alt="image"
                                            />
                                        </figure>
                                        <h3>{marketData?.question}</h3>
                                        <h4>{marketData?.description}</h4>
                                    </div>
                                    <div className="details-user-right-parent">
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
                                    </div>
                                </div>
                                <div className="forecast-main-box">
                                    <p>56.7 forecast</p>
                                    <span>
                                        <img src="/img/arrow-top.svg" alt="icon" /> 38.3
                                    </span>
                                </div>
                                <div className="details-page-chart-parent">
                                    <div id="chartContainer" style={{ height: "370px", width: "100%" }}></div>
                                </div>
                                <div className="details-page-tabing-wraper">
                                    <div className="details-page-header-parent">
                                        <p>$3,778,567 vol</p>
                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link active"
                                                    id="home-tab001"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#home001"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="home001"
                                                    aria-selected="true"
                                                >
                                                    6H
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="profile-tab002"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#profile002"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="profile002"
                                                    aria-selected="false"
                                                >
                                                    1D
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="contact-tab003"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#contact003"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="contact003"
                                                    aria-selected="false"
                                                >
                                                    1W
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="contact-tab004"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#contact004"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="contact005"
                                                    aria-selected="false"
                                                >
                                                    1M
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="contact-tab005"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#contact005"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="contact005"
                                                    aria-selected="false"
                                                >
                                                    ALL
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="details-page-tbaing-content-parent">
                                        <div className="tab-content" id="myTabContent">
                                            <div className="tab-pane fade show active" id="home001" role="tabpanel" aria-labelledby="home-tab001">
                                                <div className="details-page-tbaing-content">
                                                    <div className="center-box">
                                                        <p>Chance</p>
                                                    </div>
                                                    <div>
                                                        {marketData?.options?.map((opt) => {
                                                            return (
                                                                <div
                                                                    key={opt.id}
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        border: "1px solid #ddd",
                                                                        padding: "10px",
                                                                        borderRadius: "8px",
                                                                        marginBottom: "8px",
                                                                    }}
                                                                >
                                                                    <span>{opt.option}</span>

                                                                    <span>{opt.multiplier}x</span>

                                                                    <div style={{ display: "flex", gap: "15px" }}>
                                                                        <span>{opt.percentage}%</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="details-page-tbaing-content-box">
                                                        <div className="show-less-content">Show Less Market</div>
                                                    </div>
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
                                                alt="image"
                                            />
                                        </figure>
                                        {/* <h6>{marketData?.question}</h6> */}
                                        <h5>{marketData?.question}</h5>
                                    </div>

                                    <div className="details-page-tbaing-right">
                                        <ul>
                                            {user ? (
                                                <div className="politics-btn-box d-flex flex-column">
                                                    {marketData?.options?.map((opt) => {
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
                                                                        options: marketData.options,
                                                                    });

                                                                    setSelectedOption(opt.id);

                                                                    setShowPopup(true);
                                                                }}
                                                            >
                                                                {/* IMAGE */}
                                                                <div className="option-row">
                                                                    <img
                                                                        src={`${import.meta.env.VITE_IMAGE_URL}/public/question/${opt.image}`}
                                                                        alt={opt.option}
                                                                        className="option-img"
                                                                    />
                                                                </div>

                                                                {/* OPTION NAME */}
                                                                <span className="option-text">{opt.option}</span>

                                                                {/* MULTIPLIER */}
                                                                <span className="option-multiplier">{opt.multiplier || "1x"}x</span>

                                                                {/* PERCENTAGE */}
                                                                <span className="option-percentage">{opt.percentage || 0}%</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="politics-btn-box">
                                                    {marketData?.options?.map((opt) => {
                                                        const alreadySelected = String(prediction?.selectedOptionId) === String(opt.id);

                                                        return (
                                                            <button
                                                                key={opt.id}
                                                                className={`btn ${alreadySelected ? "active" : ""}`}
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
                                                                        options: marketData.options,
                                                                    });

                                                                    setSelectedOption(opt.id);

                                                                    setShowPopup(true);
                                                                }}
                                                            >
                                                                {opt.option}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                    {/* <div className="amount-main-box">
                                        <div className="amount-label-box">
                                            <span>Amount</span>
                                            <p>Earn 3.25% Interest</p>
                                        </div>
                                        <div className="amount-label-box">
                                            <strong>$0</strong>
                                        </div>
                                    </div> */}
                                    {/* <div className="price-box-btn">
                                        <button>Sign up to trade</button>
                                    </div> */}
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
                            {/* HEADER */}
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

                            {/* OPTIONS */}
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

                            {/* AMOUNT */}
                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Enter amount"
                                value={amount}
                                min={1}
                                onChange={(e) => setAmount(e.target.value)}
                            />

                            {/* CONFIRM */}
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
