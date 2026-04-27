import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Service from "../services/Http.js";
import Paginator from "../components/Paginator.jsx";

const Portfolio = () => {
    const { user } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState("open");
    const [loading, setLoading] = useState(false);

    const [openOrders, setOpenOrders] = useState([]);
    const [history, setHistory] = useState([]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [total, setTotal] = useState(0);

    const [historyFilter, setHistoryFilter] = useState("ALL");

    const getPortfolio = async () => {
        try {
            setLoading(true);

            const services = new Service();

            const response = await services.get(`/user/user-portfolio/${user.id}?page=${page}&limit=${limit}`, {}, true);

            if (response?.status) {
                setOpenOrders(response.data.open || []);
                setHistory(response.data.history || []);

                setTotal(activeTab === "open" ? response.data.totalOpen : response.data.totalHistory);
            }
        } catch (error) {
            console.error("PORTFOLIO ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            getPortfolio();
        }
    }, [user, page, limit, activeTab]);

    //FIXED FILTER LOGIC (WIN / LOSS)
    const filteredHistory = historyFilter === "ALL" ? history : history.filter((item) => item.winningStatus === historyFilter);

    const renderCards = (data) => {
        if (!data.length) return <p className="mt-3">No data found</p>;

        return (
            <div className="row mt-3">
                {data.map((item) => (
                    <div className="col-lg-4" key={item.id}>
                        <div className="politics-main-box">
                            <div className="politics-header-box">
                                <h4 className="text-uppercase">{item.category}</h4>
                            </div>

                            <h3>{item.question}</h3>

                            <p>{new Date(item.createdAt).toLocaleDateString("en-GB")}</p>

                            <div className="option-row-parent">
                                <span>{item.selectedOption}</span>
                                <span>{item.multiplier}x</span>
                            </div>

                            <div className="politics-footer-box d-flex justify-content-between">
                                <span>₹ {item.entryAmount}</span>

                                <span
                                    className={`badge ${
                                        item.winningStatus === "PENDING"
                                            ? "bg-warning text-dark"
                                            : item.winningStatus === "WIN"
                                              ? "bg-success"
                                              : "bg-danger"
                                    }`}
                                >
                                    {item.winningStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="home-page">
            <Header />

            <section className="banner-section-content">
                <div className="container">
                    <h2>My Portfolio</h2>
                    <div className="custom-tabs mt-3">
                        <button
                            className={`tab-btn ${activeTab === "open" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("open");
                                setPage(1);
                            }}
                        >
                            Open Orders
                        </button>

                        <button
                            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("history");
                                setPage(1);
                            }}
                        >
                            History
                        </button>
                    </div>

                    {/* HISTORY FILTER */}
                    {activeTab === "history" && (
                        <div className="d-flex gap-2 mt-3">
                            <button
                                className={`btn ${historyFilter === "ALL" ? "btn-primary" : "btn-light"}`}
                                onClick={() => setHistoryFilter("ALL")}
                            >
                                All
                            </button>

                            <button
                                className={`btn ${historyFilter === "WIN" ? "btn-success" : "btn-light"}`}
                                onClick={() => setHistoryFilter("WIN")}
                            >
                                WIN
                            </button>

                            <button
                                className={`btn ${historyFilter === "LOSS" ? "btn-danger" : "btn-light"}`}
                                onClick={() => setHistoryFilter("LOSS")}
                            >
                                LOSS
                            </button>
                        </div>
                    )}

                    {loading ? <p className="mt-3">Loading...</p> : activeTab === "open" ? renderCards(openOrders) : renderCards(filteredHistory)}

                    {/* PAGINATION */}
                    <div className="card-footer mt-4">
                        <Paginator
                            page={page}
                            limit={limit}
                            total={total}
                            firstItem={total === 0 ? 0 : (page - 1) * limit + 1}
                            lastItem={Math.min(page * limit, total)}
                            pageChangeHandler={setPage}
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Portfolio;